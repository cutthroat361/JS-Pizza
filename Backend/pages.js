/**
 * Created by chaika on 09.02.16.
 */
exports.mainPage = function(req, res) {
    res.render('mainPage', {
        pageTitle: 'Вибір Піци',
        style:"assets/less/main.less"
    });
};

exports.orderPage = function(req, res) {
    //TODO: implement
    res.render('order', {
        pageTitle: 'Оформлення замовлення',
        style:"assets/less/order.less"
    });
};