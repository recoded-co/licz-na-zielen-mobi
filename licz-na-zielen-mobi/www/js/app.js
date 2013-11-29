/*requirejs.config({
    baseUrl: 'js/lib',   
    paths: {
        app: '../app'
    }
});*/


var greenIcon;
var map;
var center;
var ggl;

//requirejs(['jquery','leaflet','app/android','Google'],
//function   ($,lf,mb,gg) {

jQuery(document).ready(function(){
	
	greenIcon = L.icon({
		iconUrl: 'images/marker.png',
		shadowUrl: 'images/marker-shadow.png',
		iconSize:     [25, 41],
		shadowSize:   [41, 41],
		iconAnchor:   [0, 0],
		shadowAnchor: [0, 0],
		popupAnchor:  [12, 0]
	});
	
	var device=new MobileDevice();	
	
	map = L.map('map', {
		center: device.getLocation(),
		zoom: 20
	});
	
	var osm = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);
	
	try
	{
		var ggl = new L.Google();
		map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl}, {}));
	}catch(err){
		alert('Error: '+err.message);
	}
		
		
	//map.fitBounds(bounds);
		
	device.EmulateLocation(InitApp);	
	
	jQuery('#menu-btn').click(function()
	{	
		if(jQuery('#map').css('left')=='0px')
			$( "#map" ).animate({ "left": "-90%" }, "slow" );
		else
			$( "#map" ).animate({ "left": "0%" }, "slow" );
	});
	
});

function centerMap(m)
{
	map.setView([center[0], center[1]], 20);
}

function InitApp(latitude,longitude)
{
	map.setView([latitude, longitude], 20);
	
	center = [latitude, longitude];
	
	L.marker([latitude, longitude],{icon: greenIcon}).addTo(map).bindPopup("Jeste≈õ <b>tutaj</b>.").openPopup();
	$('#splashscreen').hide();
}
