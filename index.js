// Start Long Poll
require('./longPoll');
// Datas
var keys = require('./keys/index');
var categories = require('./categories');
// MSG
var FAIL_MSG = 'Извините, произошла ошибка. Попробуйте еще раз.';
// Create bot
var VkBot = require('node-vk-bot-api');
var bot = new VkBot(keys.TOKEN);
// Start command with Inline-Keyboard
bot.command('Начать', function (ctx) {
    ctx.reply('Что Вас интересует?', null, require('node-vk-bot-api/lib/markup')
        .keyboard(categories, { columns: 2 })
        .inline());
});
// Session
var Session = require('node-vk-bot-api/lib/session');
var session = new Session();
bot.use(session.middleware());
// API
var api = require('node-vk-bot-api/lib/api');
bot.on(function (ctx) {
    var _a = [ctx.message.user_id, ctx.message.body], user_id = _a[0], message = _a[1];
    var isCat = categories.filter(function (name) { return name === message; }).length !== 0;
    api('users.get', {
        user_ids: user_id,
        fields: 'first_name',
        access_token: keys.TOKEN
    })["catch"](function (e) {
        console.error(e);
        ctx.reply(FAIL_MSG);
    }).then(function (res) {
        if (isCat && ctx.session.name) {
            ctx.session.name = null;
        }
        if (!ctx.session.name) {
            if (isCat) {
                var name_1 = res.response[0].first_name;
                ctx.reply("\u0421\u043F\u0430\u0441\u0438\u0431\u043E, " + name_1 + ". \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0434\u043B\u044F \u0441\u0432\u044F\u0437\u0438. :)");
                ctx.session.target = message;
                ctx.session.name = name_1;
            }
        }
        else {
            if (require('validator').isMobilePhone(message)) {
                ctx.reply("\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430. :)");
                ctx.session.phone = message;
                ctx.session.url = "https://vk.com/id" + user_id;
                api('messages.send', {
                    user_ids: keys.ADMINS_ID,
                    random_id: Math.ceil(Math.random() * 1000 + 1),
                    message: "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430 \u043E\u0442 " + ctx.session.url + ": " + ctx.session.name + ", " + ctx.session.phone + "; \u0418\u043D\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442\u0441\u044F: " + ctx.session.target,
                    access_token: keys.TOKEN
                })["catch"](function (e) {
                    console.error(e);
                    ctx.reply(FAIL_MSG);
                }).then(function (res) { return console.log('Заявка отправлена'); });
            }
            else {
                ctx.reply('Введите корректный номер телефона.');
            }
        }
    });
});
bot.startPolling();
