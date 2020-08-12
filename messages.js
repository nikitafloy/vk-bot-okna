module.exports = {
    FAIL: 'Извините, произошла ошибка. Попробуйте еще раз.',
    ON_START: 'Что Вас интересует?',
    GET_PHONE: name => `Спасибо, ${name}. Оставьте Ваш номер телефона для связи. :)`,
    START_CMD: 'Начать',
    END: `Спасибо за номер телефона. :)`,
    CONSOLE_END: 'Заявка отправлена',
    INCORRECT_PHONE: 'Введите корректный номер телефона.',
    CANT_GET_ADMINS: (phone, url) => `Ошибка отправки заявки. Не смогли определить админов. Temp заявки: ${phone}, ${url}`,
    MSG_TO_MANAGER: (url, name, phone, target) => `Новая заявка от ${url}: ${name}, ${phone}; Интересуется: ${target}`,
}