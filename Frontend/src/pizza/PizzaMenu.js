/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List =null;
var API=require('../API');
API.getPizzaList(function (error, data){
    if(error)alert(error);
    else Pizza_List=data;
    initialiseMenu();
});

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");
$("#buy").click(function () {
    window.location.href='/order.html';
});

$(".pizza-filter").click(function(){
    $(".active").prop('class', 'pizza-filter');
    $(this).prop('class', 'pizza-filter active');
    var filter=$(this).prop('id').substr(7);
    filterPizza(filter);
});

function showPizzaList(list) {
    $("#all").text(list.length);
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    var pizza_shown = [];

    Pizza_List.forEach(function(pizza){
        //Якщо піка відповідає фільтру
        if(pizza.content[filter] || filter==='all')pizza_shown.push(pizza);

        //TODO: зробити фільтри
    });

    //Показати відфільтровані піци
    showPizzaList(pizza_shown);
}

function initialiseMenu() {
    //Показуємо усі піци
    if(Pizza_List)showPizzaList(Pizza_List);

}

exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;