module.exports = {
    FAIL: 'Извините, произошла ошибка. Попробуйте еще раз.',
    ON_START: 'Что Вас интересует?',
    GET_PHONE: name => `Спасибо, ${name}. Оставьте Ваш номер телефона для связи. :)`,
    START_CMD: 'Начать',
    END: `Спасибо за номер телефона. :) Мы Вам скоро перезвоним.`,
    CONSOLE_END: 'Заявка отправлена',
    INCORRECT_PHONE: 'Введите корректный номер телефона.',
    CANT_GET_ADMINS: (phone, url) => `Ошибка отправки заявки. Не смогли определить админов. Temp заявки: ${phone}, ${url}`,
    MSG_TO_MANAGER: (url, name, phone, target) => `Новая заявка от ${url}: ${name}, ${phone}; Интересуется: ${target}`,
    IS_CORRECT_PHONE: phone => `Этот номер еще актуален ${phone} ?`,
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
    ],
}