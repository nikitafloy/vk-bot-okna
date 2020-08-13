// Datas
const keys = require('./keys/index');

// MSG
const messages = require('./messages');

// Markup
const Markup = require('node-vk-bot-api/lib/markup');

// Create bot
const VkBot = require('node-vk-bot-api');
const bot = new VkBot(keys.TOKEN);

// Redis-Session
const RedisSession = require('node-vk-bot-api-session-redis/lib/session');
const session = new RedisSession();
bot.use(session.middleware());

// Start command with Inline-Keyboard
const startKeyBoard = ctx => {
  ctx.session.step = null;
  showCategories(ctx);
};

const showCategories = ctx => {
  ctx.reply(messages.ON_START, null, Markup
    .keyboard(messages.CATEGORIES, { columns: 2 })
    .inline(),
  );
};

bot.command(messages.START_CMD, startKeyBoard);
bot.command(messages.I_HAVE_QUESTION, startKeyBoard);

// API
const api = require('node-vk-bot-api/lib/api');

bot.on(async ctx => {
  const [user_id, message]: Array<String> = [ctx.message.user_id, ctx.message.body];
  const isCategories: Boolean = messages.CATEGORIES.filter(name => name === message).length !== 0;

  // Выбрана категория в самом начале
  if (isCategories) {
    // Выбор категории, запоминание имени, запрос номера
    ctx.session.step = 1;

    // Не введено имя, человек обратился впервые
    if (!ctx.session.name) {
      const params: Object = {
        user_ids: user_id,
        fields: 'first_name',
        access_token: keys.TOKEN,
      };
    
      return await api('users.get', params)
        .catch(e => {
          console.error(e);
          ctx.reply(messages.FAIL);
        })
        .then(res => {
          const name: String = res.response[0].first_name;
          ctx.reply(messages.GET_PHONE(name));
          ctx.session.target = message;
          ctx.session.name = name;
          ctx.session.step = 2;
        }); 
    } else {
      // Есть имя и даже телефон, человек обращается повторно
      if (ctx.session.phone) {
        // Ввод актуального номера
        ctx.reply(messages.IS_CORRECT_PHONE(ctx.session.phone), null, Markup
          .keyboard(messages.YES_NOT, { columns: 2 })
          .inline(),
        );
        ctx.session.target = message;
        return;
      } else {
        return ctx.reply(messages.GET_PHONE(ctx.session.name));
      };
    };
    showCategories(ctx);
  } else {
    // Какой-то текст, не из категорий

    // Нужен этап, первый, когда мы запрашиваем номер и в конце, даем возможность вернуться в начало
    if (!ctx.session.step) {
      return showCategories(ctx);
    };

    // Актуальный номер телефона или нет
    const isYesOrNot: Boolean = messages.YES_NOT.filter(name => name === message).length !== 0;
    // Да/Нет (актуальность), либо был введен номер телефона
    if (isYesOrNot || message.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)) {
      // Введен номер
      if (!isYesOrNot) {
        if (ctx.session.step !== 2) {
          // Ввод актуального номера
          ctx.reply(messages.IS_CORRECT_PHONE(ctx.session.phone), null, Markup
            .keyboard(messages.YES_NOT, { columns: 2 })
            .inline(),
          );
          return;
        };

        // Говорим спасибо, сохраняем номер
        ctx.session.phone = message;
        closeSession(ctx, messages.END);
      } else {
        // Актуальность номера
        if (message === 'Нет') {
          // Просим ввести актуальный номер
          ctx.session.step = 2;
          return ctx.reply(messages.GET_CORRECT_PHONE);
        } else {
          if (!ctx.session.phone || ctx.session.step === 2) {
            return ctx.reply(messages.GET_CORRECT_PHONE);
          };

          // Благодарим за номер, закрыли сессию
          closeSession(ctx, messages.WE_WILL_CALL);
        };
      };

      ctx.session.url = `https://vk.com/id${user_id}`;

      const {url, name, phone, target} = ctx.session;

      // Get Admins
      require('./admins')()
        .catch(e => console.error(e))
        .then(admins => {
          if (!admins) {
            return console.log(messages.CANT_GET_ADMINS(phone, url));
          };
          
          // Choose the method depending on the number of people
          const ids_method = admins.match(/,/) ? 'user_ids' : 'user_id';
          const params: Object = {
            [ids_method]: admins,
            random_id: Math.ceil(Math.random() * 1000 + 1),
            message: messages.MSG_TO_MANAGER(url, name, phone, target),
            access_token: keys.TOKEN,
          };

          api('messages.send', params)
            .catch(e => {
              console.error(e);
              ctx.reply(messages.FAIL);
            })
            .then(res => console.log(messages.CONSOLE_END));
        });
    } else {
      // if (ctx.session.step !== 2) {
      //   return;
      // };

      return ctx.reply(messages.INCORRECT_PHONE);
    };  
  };
});

const closeSession = (ctx: any, msg?: String) => {
  ctx.session.step = null;

  // Оставляем клавиатуру на будущее
  ctx.reply(msg || messages.GOOD_DAY, null, Markup
    .keyboard([messages.I_HAVE_QUESTION])
    .oneTime(),
  );
};

bot.startPolling();