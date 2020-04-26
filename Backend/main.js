
let express = require('express');
let path = require('path');
let morgan = require('morgan');
let bodyParser = require('body-parser');

function configureEndpoints(app) {
    let pages = require('./pages');
    let api = require('./api');

    //Налаштування URL за якими буде відповідати сервер
    //Отримання списку піц
    app.get('/api/get-pizza-list/', api.getPizzaList);
    app.post('/api/create-order/', api.createOrder);

    //Сторінки
    //Головна сторінка
    app.get('/', pages.mainPage);

    //Сторінка замовлення
    app.get('/order.html', pages.orderPage);

    //Якщо не підійшов жоден url, тоді повертаємо файли з папки www
    app.use(express.static(path.join(__dirname, '../Frontend/www')));
}

function startServer(port) {
    //Створюється застосунок
    let app = express();

    //Налаштування директорії з шаблонами
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    //Налаштування виводу в консоль списку запитів до сервера
    app.use(morgan('dev'));

    //Розбір POST запитів
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    //Налаштовуємо сторінки
    configureEndpoints(app);

    //Запуск додатка за вказаним портом
    app.listen(port, function () {
        console.log('My Application Running on http://localhost:'+port+'/');
    });
}

exports.startServer = startServer;