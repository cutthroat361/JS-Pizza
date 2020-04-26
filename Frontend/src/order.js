var API = require('./API');
var $client=$("#flname");
var $clientPhone=$("#phone");
var $clientAddress=$("#address");
var GoogleMap=require('./googleMaps');
var map=GoogleMap.map;
var point=GoogleMap.point;
var directionsDisplay=GoogleMap.directionsDisplay;
var newMarker=GoogleMap.newMarker;
var Pay=require('./payment');


 $(".quantity-ordered").each(function (i, item) {
     var num=parseInt($(item).text(), 10);
     var add;
     if(num>1)add="піци";
     else add="піца";
     $(item).text(num+" "+add);
 });

 $client.bind("keypress", function(event){
     var regex= new RegExp("^[0-9A-Za-zА-Яа-яІіЇїЄєҐґ'/ -]+$");
     var key=String.fromCharCode(!event.charCode ? event.which : event.charCode);
     if(!regex.test(key)){
         event.preventDefault();
         return false;
     }
 });

 $client.bind("keydown", function(event){
     window.setTimeout(function() {
         if($client.val()===""){
             $client.css("box-shadow", "0 0 3px #CC0000");
         }
         else $client.css("box-shadow", "0 0 3px #006600");
     }, 0);
 });

 $clientPhone.bind("keypress", function(event){
     var regex;
     var key;
     var text=$(this).val();
     switch(text.length){
         case 0:
             regex=new RegExp("[0+]");
             break;
         case 1:
             if(text.charAt(0)!=='0') {
                 regex = new RegExp("[3]");
                 break;
             }
         case 2:
             if(text.charAt(0)!=='0') {
                 regex = new RegExp("[8]");
                 break;
             }
         case 3:
             if(text.charAt(0)!=='0') {
                 regex = new RegExp("[0]");
                 break;
             }
         default:
             regex = new RegExp("[0-9]");
     }
     key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
     if(!regex.test(key) || (text.charAt(0)==='0' && text.length===10) || (text.charAt(0)==='+' && text.length===13)){
         event.preventDefault();
         return false;
     }
 });

 $clientPhone.bind("keydown", function(event){
     window.setTimeout(function() {
         if ($clientPhone.val() === "" || ($clientPhone.val().charAt(0) === '+' && $clientPhone.val().length < 13) || ($clientPhone.val().charAt(0) === '0' && $clientPhone.val().length < 10)) {
             $clientPhone.css("box-shadow", "0 0 3px #CC0000");
         }
         else $clientPhone.css("box-shadow", "0 0 3px #006600");
     });
 });

 $clientAddress.bind("keypress", function(event){
     var regex;
     var key;
     regex= new RegExp("^[0-9A-Za-zА-Яа-яІіЇїЄєҐґ'.,/ -]+$");
     key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
     if(!regex.test(key)){
         event.preventDefault();
         return false;
     }
 });

 $clientAddress.bind("keydown", function(event){
     window.setTimeout(function() {
         GoogleMap.geocodeAddress($clientAddress.val(), function(err, data){
             if(!err){
                 if(newMarker)newMarker.setMap(null);
                 newMarker	=	new	google.maps.Marker({
                     position: data,
                     map: map,
                     icon: {
                         url:"assets/images/home-icon.png",
                         anchor: new google.maps.Point(30, 30)
                     }
                 });
                 GoogleMap.calculateRoute(point, data, function(err, data2){
                     directionsDisplay.setDirections(data2.route);
                     $("#timeInfo").text(data2.duration);
                 });
                 $clientAddress.css("box-shadow", "0 0 3px #006600");
                 $("#addressInfo").text($clientAddress.val());
             }
             else {
                 $("#addressInfo").text("невідома");
                 $("#timeInfo").text("невідомий");
                 $clientAddress.css("box-shadow", "0 0 3px #CC0000");
             }
         });
     });
 });

 $("#submit").click(function () {
     event.preventDefault();
     var suc=true;
     var name = $client.val();
     if(name===""){
         $client.css("box-shadow", "0 0 3px #CC0000");
         suc=false;
     }
     else $client.css("box-shadow", "0 0 3px #006600");
     var phone = $clientPhone.val();
     if(phone==="" || (phone.charAt(0)==='+' && phone.length<13) || (phone.charAt(0)==='0' && phone.length<10)){
         $clientPhone.css("box-shadow", "0 0 3px #CC0000");
         suc=false;
     }
     else $clientPhone.css("box-shadow", "0 0 3px #006600");
     var address = $clientAddress.val();
     if(address===""){
         $clientAddress.css("box-shadow", "0 0 3px #CC0000");
         suc=false;
     }
     else $clientAddress.css("box-shadow", "0 0 3px #006600");
     if(suc) {
         var pizzas=require('./pizza/PizzaCart').getPizzaInCart();
         var pizzasLine="";
         for(var i=0;i<pizzas.length;i++){
             pizzasLine+="- "+pizzas[i].quantity+"шт. ["+(pizzas[i].size==='big_size'?"Велика":"Мала")+"] "+pizzas[i].pizza.title+";\n"
         }
         var order_info = {
             name: name,
             phone: phone,
             address: address,
             cost: parseFloat($("#sum-number").text().split(" ")[0])*1.00,
             pizzas:pizzasLine
         };
         API.createOrder(order_info, function (error, data) {
             if (error) alert(error);
             else {
                 window.LiqPayCheckoutCallback=Pay.create(data.data, data.signature);
             }
         });

     }
 });

 $("#reorder").click(function () {
     window.location.href = '/';
 });