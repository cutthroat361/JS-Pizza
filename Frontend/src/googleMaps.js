var map;
var point;
var directionsDisplay;
var newMarker;

function	initialize()	{
//Тут починаємо працювати з картою
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapProp =	{
        center:	new	google.maps.LatLng(50.464379,30.519131),
        zoom:	13
    };
    var html_element =	document.getElementById("googleMap");
    map	= new google.maps.Map(html_element, mapProp);
//Карта створена і показана
    directionsDisplay.setMap(map);
    directionsDisplay.setOptions( { suppressMarkers: true } );
    point = new	google.maps.LatLng(50.464379,30.519131);
    var marker	=	new	google.maps.Marker({
        position: point,
        map: map,
        icon: {
            url:"assets/images/map-icon.png",
            anchor: new google.maps.Point(30, 30)
        }
    });
    google.maps.event.addListener(map, 'click', function(me){
        var coordinates	=	me.latLng;
        geocodeLatLng(coordinates,	function(err,	adress){
            if(!err){
                //Дізналися адресу
                $("#address").val(adress);
                $("#addressInfo").text(adress);
                $("#address").css("box-shadow", "0 0 3px #006600");
                if(newMarker)newMarker.setMap(null);
                newMarker	=	new	google.maps.Marker({
                    position: coordinates,
                    map: map,
                    icon: {
                        url:"assets/images/home-icon.png",
                        anchor: new google.maps.Point(30, 30)
                    }
                });
                calculateRoute(point, coordinates, function(err, data){
                    if(!err){
                        directionsDisplay.setDirections(data.route);
                        $("#timeInfo").text(data.duration);
                    }
                    else console.log(err);
                })
            } else {
                console.log(err);
            }
        });
    });
}
//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);

function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'location':	latlng},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[1])	{
            var adress =	results[1].formatted_address;
            callback(null,	adress);
        }	else	{
            callback(new Error("Can't find address"));
        }
    });
}

function geocodeAddress(address, callback)	{
    var geocoder	=	new	google.maps.Geocoder();
    geocoder.geocode({'address':	address},	function(results,	status)	{
        if	(status	===	google.maps.GeocoderStatus.OK && results[0])	{
            var coordinates	=	results[0].geometry.location;
            callback(null,	coordinates);
        }	else	{
            callback(new Error("Can	not	find the address"));
        }
    });
}

function calculateRoute(A_latlng,	 B_latlng,	callback) {
    var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination:	B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    }, function(response,	status)	{
        if	(status	==	google.maps.DirectionsStatus.OK) {
            var leg	=	response.routes[0].legs[0];
            callback(null,	{
                route: response,
                duration:	leg.duration.text
            });
        }	else	{
            callback(new	Error("Can't find direction"));
        }
    });
}

exports.geocodeLatLng=geocodeLatLng;
exports.geocodeAddress=geocodeAddress;
exports.calculateRoute=calculateRoute;
exports.map=map;
exports.point=point;
exports.directionsDisplay=directionsDisplay;
exports.newMarker=newMarker;