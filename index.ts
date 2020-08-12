// Datas
const keys = require('./keys/index');

// MSG
const messages = require('./messages');

// Markup
const Markup = require('node-vk-bot-api/lib/markup');

// Create bot
const VkBot = require('node-vk-bot-api');
const bot = new VkBot(keys.TOKEN);

// Start command with Inline-Keyboard
const startKeyBoard = ctx => {
  ctx.reply(messages.ON_START, null, Markup
    .keyboard(messages.CATEGORIES, { columns: 2 })
    .inline(),
  );
};

bot.command(messages.START_CMD, startKeyBoard);

// Redis-Session
const RedisSession = require('node-vk-bot-api-session-redis/lib/session');
const session = new RedisSession();
bot.use(session.middleware());

// API
const api = require('node-vk-bot-api/lib/api');

bot.on(async ctx => {
  const [user_id, message]: Array<String> = [ctx.message.user_id, ctx.message.body];
  const isCategories: Boolean = messages.CATEGORIES.filter(name => name === message).length !== 0;

  if (isCategories) {
    if (!ctx.session.name) {
      const params: Object = {
        user_ids: user_id,
        fields: 'first_name',
        access_token: keys.TOKEN,
      };
    
      await api('users.get', params)
        .catch(e => {
          console.error(e);
          ctx.reply(messages.FAIL);
        })
        .then(res => {
          const name: String = res.response[0].first_name;
          ctx.reply(messages.GET_PHONE(name));
          ctx.session.target = message;
          ctx.session.name = name;
        });  
    } else {
      if (ctx.session.phone) {
        ctx.reply(messages.IS_CORRECT_PHONE(ctx.session.phone), null, Markup
          .keyboard(messages.YES_NOT, { columns: 2 })
          .inline(),
        );  
        ctx.session.target = message;
      };
    };
  } else {
    if (messages.WANT_NOT_WANT.filter(name => name === message).length !== 0) {
      if (message === 'Хочу') {
        return startKeyBoard(ctx);
      } else {
        return ctx.reply(messages.GOOD_DAY);
      };
    };

    const isYesOrNot: Boolean = messages.YES_NOT.filter(name => name === message).length !== 0;
    if (isYesOrNot || require('validator').isMobilePhone(message)) {
      if (!isYesOrNot) {
        ctx.reply(messages.END);
        ctx.session.phone = message;
      } else {
        if (message === 'Нет') {
          return ctx.reply(messages.GET_CORRECT_PHONE);
        } else {
          ctx.reply(messages.WE_WILL_CALL);
          startKeyBoard(ctx);
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

        ctx.reply(messages.WANT_RESTART, null, Markup
          .keyboard(messages.WANT_NOT_WANT, { columns: 2 })
          .inline(),
        );  
    } else {
      return ctx.reply(messages.INCORRECT_PHONE);
    };  
  };
});

bot.startPolling();