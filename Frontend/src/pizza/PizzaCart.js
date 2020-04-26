/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];
var $order_number=$("#orderNum");
var empty="<div id=\"empty\">Пусто в холодильнику?<br>Замовте піцу!</div>";

$("#clear-order").click(function(){
    Cart=[];
    $("#sum-title").remove();
    $("#sum-number").remove();
    localStorage.clear();
    updateCart();
});
//HTML едемент куди будуть додаватися піци
var $cart = $("#boughtList");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    var exists=false;
    if(Cart.length>0){
        Cart.forEach(function(item){
            if(item.pizza.id===pizza.id && item.size===size){
                exists=true;
                item.quantity++;
            }
        });
    }
    else{
        $("#sum").prepend($(Templates.PizzaSumOrder));
        $("#buy").prop('disabled', false);
    }
    //Приклад реалізації, можна робити будь-яким іншим способом
    if(!exists) {
        Cart.push({
            pizza: pizza,
            size: size,
            quantity: 1
        });
        localStorage.setItem(pizza.id+" "+size, JSON.stringify({
            pizza: pizza,
            size :size,
            quantity:1
        }));
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    localStorage.removeItem(cart_item.pizza.id+" "+cart_item.size);
    //TODO: треба зробити
    for(var i=0, j=0;i<Cart.length;i++){
        if(Cart[i]!==cart_item)Cart[j++]=Cart[i];
    }
    Cart.pop();
    if(Cart.length===0){
        $("#sum-title").remove();
        $("#sum-number").remove();
    }
    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    //TODO: ...

    // Retrieve the object from storage
    Object.keys(localStorage).forEach(function(key){
        Cart.push(JSON.parse(localStorage.getItem(key)));
    });
    if(Cart.length>0){
        $("#sum").prepend($(Templates.PizzaSumOrder));
        $("#buy").prop('disabled', false);
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage
    var sum=0;
    //Очищаємо старі піци в кошику
    $cart.html("");

    $order_number.text(Cart.length);
    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        localStorage.setItem(cart_item.pizza.id+" "+cart_item.size, JSON.stringify(cart_item));

        sum+=cart_item.pizza[cart_item.size].price * cart_item.quantity;

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            //Оновлюємо відображення
            updateCart();
        });
        $node.find(".minus").click(function(){
            //Збільшуємо кількість замовлених піц
            if(cart_item.quantity===1)removeFromCart(cart_item);
            else {
                cart_item.quantity -= 1;
                //Оновлюємо відображення
                updateCart();
            }
        });
        $node.find(".remove").click(function(){
            removeFromCart(cart_item);
        });

        $cart.append($node);
    }

    if(Cart.length===0){
        $cart.html(empty);
        $("#buy").prop('disabled', true);
    }
    else {
        Cart.forEach(showOnePizzaInCart);
        $("#sum-number").text(sum + " грн");
    }
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;