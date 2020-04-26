const Pizza_List = require('./data/Pizza_List');
const crypto	=	require('crypto');
const LIQPAY_PUBLIC_KEY='sandbox_i12221602267';
const LIQPAY_PRIVATE_KEY='sandbox_G8Z6r3MEginn5Icae47buUyzc3t7p2L34F0qYoAr';


function base64(str)	 {
    return new Buffer(str).toString('base64');
}

function sha1(string) {
    var sha1	=	crypto.createHash('sha1');
    sha1.update(string);
    return	sha1.digest('base64');
}


exports.getPizzaList = function(req, res) {
    res.send(Pizza_List);
};


exports.createOrder = function(req, res) {
    var order_info = req.body;
    var description=
        "Замовник: "+order_info.name+"\n" +
        "Адреса: "+order_info.address+"\n" +
        "Телефон: "+order_info.phone+"\n" +
        "Замовлення:\n"+order_info.pizzas +
        "Разом "+order_info.cost+".00грн";
    var order={
        version:	3,
        public_key:	LIQPAY_PUBLIC_KEY,
        action:	"pay",
        amount:	order_info.cost,
        currency:	"UAH",
        description:	description,
        order_id:	Math.random(),
        sandbox:	1
    };
    var data  =  base64(JSON.stringify(order));
    var signature = sha1(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY);
    res.send({
        status: true,
        data:data,
        signature:signature
    });
};