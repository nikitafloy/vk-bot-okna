"use strict";
exports.__esModule = true;
exports["default"] = {
    FAIL: 'Извините, произошла ошибка. Попробуйте еще раз.',
    ON_START: 'Что Вас интересует?',
    GET_PHONE: function (name) { return "\u0421\u043F\u0430\u0441\u0438\u0431\u043E, " + name + ". \u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0412\u0430\u0448 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430 \u0434\u043B\u044F \u0441\u0432\u044F\u0437\u0438. :)"; },
    START_CMD: 'Начать',
    END: "\u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430. :) \u041C\u044B \u0412\u0430\u043C \u0441\u043A\u043E\u0440\u043E \u043F\u0435\u0440\u0435\u0437\u0432\u043E\u043D\u0438\u043C.",
    CONSOLE_END: 'Заявка отправлена',
    INCORRECT_PHONE: 'Введите корректный номер телефона.',
    CANT_GET_ADMINS: function (phone, url) { return "\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438 \u0437\u0430\u044F\u0432\u043A\u0438. \u041D\u0435 \u0441\u043C\u043E\u0433\u043B\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u0442\u044C \u0430\u0434\u043C\u0438\u043D\u043E\u0432. Temp \u0437\u0430\u044F\u0432\u043A\u0438: " + phone + ", " + url; },
    MSG_TO_MANAGER: function (url, name, phone, target) { return "\u041D\u043E\u0432\u0430\u044F \u0437\u0430\u044F\u0432\u043A\u0430 \u043E\u0442 " + url + ": " + name + ", " + phone + "; \u0418\u043D\u0442\u0435\u0440\u0435\u0441\u0443\u0435\u0442\u0441\u044F: " + target; },
    IS_CORRECT_PHONE: function (phone) { return "\u042D\u0442\u043E\u0442 \u043D\u043E\u043C\u0435\u0440 \u0435\u0449\u0435 \u0430\u043A\u0442\u0443\u0430\u043B\u0435\u043D " + phone + " ?"; },
    GET_CORRECT_PHONE: 'Укажите номер.',
    WE_WILL_CALL: 'Спасибо за заявку, мы Вам скоро перезвоним. :)',
    GOOD_DAY: 'Хорошего дня!',
    I_HAVE_QUESTION: 'У меня есть вопрос',
    YES_NOT: ['Да', 'Нет'],
    CATEGORIES: [
        'Ремонт окон',
        'Отделка балконов',
        'Остекление балконов',
        'Установка окон',
        'Отделка окон',
        'Москитные сетки',
        'Рулонные шторы',
        'Другое',
    ]
};
