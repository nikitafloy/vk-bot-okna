// Datas
const keys = require('./keys/index');
const categories = require('./categories');

// MSG
const messages = require('./messages');

// Create bot
const VkBot = require('node-vk-bot-api');
const bot = new VkBot(keys.TOKEN);

// Start command with Inline-Keyboard
bot.command(messages.START_CMD, ctx => {
  ctx.reply(messages.ON_START, null, require('node-vk-bot-api/lib/markup')
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
  const isCategories: Boolean = categories.filter(name => name === message).length !== 0;

  const params: Object = {
    user_ids: user_id,
    fields: 'first_name',
    access_token: keys.TOKEN,
  };

  api('users.get', params)
    .catch(e => {
      console.error(e);
      ctx.reply(messages.FAIL);
    })
    .then(res => {
      if (isCategories && ctx.session.name) {
        ctx.session.name = null;
      };

      if (!ctx.session.name) {
        if (isCategories) {
          const name: String = res.response[0].first_name;
          ctx.reply(messages.GET_PHONE(name));
          ctx.session.target = message;
          ctx.session.name = name;
        };
      } else {
        if (require('validator').isMobilePhone(message)) {
          ctx.reply(messages.END);

          ctx.session.phone = message;
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
          ctx.reply(messages.INCORRECT_PHONE);
        };
      };
    });
});

bot.startPolling();