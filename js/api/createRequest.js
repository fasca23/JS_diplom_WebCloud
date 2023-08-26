/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    // Из опций забираем url
    let url = options.url;

    // Собираем url из url и data
    if (options.data) {
        for (let i=0; i < Object.keys(options.data).length; i++) {
            if (i === 0) {
                url += '?' + Object.entries(options.data)[i][0] + '=' + Object.entries(options.data)[i][1];
            } else {
                const add = Object.entries(options.data)[i][0] + '=' + Object.entries(options.data)[i][1];
                url += '&' + add.replace(/&/g, '%26');
            }
        }
    }
    // сбрасываем еррор
    let error = null;
    // При инициации запроса используем try чтоб собрать возможные ошибки
    try {
        xhr.open(options.method, url);
        if (options.headers) {
            for (let i=0; i < Object.keys(options.headers).length; i++) {
                xhr.setRequestHeader(Object.entries(options.headers)[i][0], Object.entries(options.headers)[i][1]);
            }
        }
        // Хотим получать json
        xhr.responseType = 'json';
        // Посылаем запрос
        xhr.send();
    }
    // Собираем ошибки
    catch (err) {
        error = err;
    }
    // В колбэк пишем ошибки и ответ сервера
    xhr.onloadend = function() {
        options.cb(error, xhr.response);
    };
};