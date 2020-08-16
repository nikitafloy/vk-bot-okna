// Datas
import keys from './keys/index';

// MSG
import messages from './messages';

// TypeScript
import {ICtx} from './Interfaces/bot/ICtx';
import {IParams} from './Interfaces/bot/IParams';
import {IBot} from './Interfaces/bot/IBot';

// Markup
import * as Markup from 'node-vk-bot-api/lib/markup';

// VKBot
import * as VkBot from 'node-vk-bot-api';
const bot: IBot = new VkBot(keys.TOKEN);

// API
import * as api from 'node-vk-bot-api/lib/api';

// Redis-Session
import * as RedisSession from 'node-vk-bot-api-session-redis/lib/session';

// Create bot
const session = new RedisSession({
  host: keys.REDIS_HOST,
  port: keys.REDIS_PORT,
  user: keys.REDIS_USER,
  password: keys.REDIS_PASSWORD,
  url: keys.REDIS_URL,
});

bot.use(session.middleware());

// Start command with Inline-Keyboard
const startKeyBoard = (ctx: ICtx): void => {
  ctx.session.step = null;
  showCategories(ctx);
};

const showCategories = (ctx: ICtx): void => ctx.reply(
  messages.ON_START, null,
  Markup
    .keyboard(messages.CATEGORIES, { columns: 2 })
    .inline()
);

// Command handlers
bot.command(messages.START_CMD, startKeyBoard);
bot.command(messages.I_HAVE_QUESTION, startKeyBoard);

// Обработка основных команд
bot.on(async (ctx: ICtx): Promise<any> => {
  const [user_id, message]: Array<String> = [ctx.message.user_id, ctx.message.body];
  const isCategories: Boolean = messages.CATEGORIES.filter(name => name === message).length !== 0;

  // Выбрана категория в самом начале
  if (isCategories) {
    // Выбор категории, запоминание имени, запрос номера
    ctx.session.step = 1;

    // Не введено имя, человек обратился впервые
    if (!ctx.session.name) {
      try {
        const params: IParams = {
          user_ids: user_id,
          fields: 'first_name',
          access_token: keys.TOKEN,
        };  

        const user = await api('users.get', params);
        if (user) {
          const name: String = user.response[0].first_name;
          ctx.reply(messages.GET_PHONE(name));
          ctx.session.target = message;
          ctx.session.name = name;
          ctx.session.step = 2;
        } else {
          console.error(messages.CANT_GET_NAME(user_id));
          ctx.reply(messages.FAIL);  
        };
      } catch (e) {
        console.error(e);
        ctx.reply(messages.FAIL);      
      };
    } else {
      // Есть имя, человек обращается повторно, просим телефон
      ctx.session.target = message;
      return ctx.reply(messages.GET_PHONE(ctx.session.name));
    };
    showCategories(ctx);
  } else {
    // Какой-то текст, не из категорий
    if (!ctx.session.step) {
      return showCategories(ctx);
    };

    // Введен номер телефона
    if (message.match(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)) {

      // Благодарим за номер, закрыли сессию
      ctx.session.phone = message;
      ctx.session.url = `https://vk.com/id${user_id}`;
      closeSession(ctx, messages.WE_WILL_CALL);

      const {url, name, phone, target} = ctx.session;

      // Choose the method depending on the number of people
      const params: IParams = {
        'user_id': keys.ADMIN_ID,
        random_id: Math.ceil(Math.random() * 1000 + 1),
        message: messages.MSG_TO_MANAGER(url, name, phone, target),
        access_token: keys.TOKEN,
      };

      try {
        if (await api('messages.send', params)){
          console.log(messages.CONSOLE_END);
        };
      } catch (e) {
        console.error(e);
        ctx.reply(messages.FAIL);
      };
    } else {
      return ctx.reply(messages.INCORRECT_PHONE);
    };  
  };
});

const closeSession = (ctx: ICtx, msg?: String): void => {
  ctx.session.step = null;

  // Оставляем клавиатуру на будущее
  ctx.reply(msg || messages.GOOD_DAY, null, Markup
    .keyboard([messages.I_HAVE_QUESTION])
    .oneTime(),
  );
};

bot.startPolling(error => error ? console.error(error) : null);