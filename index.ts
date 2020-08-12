// Start Long Poll
// require('./longPoll');

// Datas
const keys = require('./keys/index');
const categories = require('./categories');

// MSG
const FAIL_MSG: string = 'Извините, произошла ошибка. Попробуйте еще раз.';

// Create bot
const VkBot = require('node-vk-bot-api');
const bot = new VkBot(keys.TOKEN);

// Start command with Inline-Keyboard
bot.command('Начать', ctx => {
  ctx.reply('Что Вас интересует?', null, require('node-vk-bot-api/lib/markup')
    .keyboard(categories, { columns: 2 })
    .inline(),
  );
});

// Session
const Session = require('node-vk-bot-api/lib/session');
const session = new Session();
bot.use(session.middleware());

// API
const api = require('node-vk-bot-api/lib/api');

bot.on(ctx => {
  const [user_id, message]: Array<String> = [ctx.message.user_id, ctx.message.body];
  const isCat: Boolean = categories.filter(name => name === message).length !== 0;

  api('users.get', {
    user_ids: user_id,
    fields: 'first_name',
    access_token: keys.TOKEN,
  }).catch(e => {
    console.error(e);
    ctx.reply(FAIL_MSG);
  }).then(res => {
    if (isCat && ctx.session.name) {
      ctx.session.name = null;
    }

    if (!ctx.session.name) {
      if (isCat) {
        const name: String = res.response[0].first_name;
        ctx.reply(`Спасибо, ${name}. Оставьте Ваш номер телефона для связи. :)`);
        ctx.session.target = message;
        ctx.session.name = name;
      }
    } else {
      if (require('validator').isMobilePhone(message)) {
        ctx.reply(`Спасибо за номер телефона. :)`);

        ctx.session.phone = message;
        ctx.session.url = `https://vk.com/id${user_id}`;

        api('messages.send', {
          user_ids: keys.ADMINS_ID,
          random_id: Math.ceil(Math.random() * 1000 + 1),
          message: `Новая заявка от ${ctx.session.url}: ${ctx.session.name}, ${ctx.session.phone}; Интересуется: ${ctx.session.target}`,
          access_token: keys.TOKEN,
        }).catch(e => {
          console.error(e);
          ctx.reply(FAIL_MSG);
        }).then(res => console.log('Заявка отправлена'));
      } else {
        ctx.reply('Введите корректный номер телефона.');
      }
    }
  });
});

bot.startPolling();