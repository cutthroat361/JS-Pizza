
$(function(){
    //This code will execute when the page is ready
    var PizzaMenu = require('./pizza/PizzaMenu');
    var PizzaCart = require('./pizza/PizzaCart');

    PizzaCart.initialiseCart();
    if(window.location.pathname==='/order.html' || window.location.href==='/order.html')var Order = require('./order');
    else PizzaMenu.initialiseMenu();


});