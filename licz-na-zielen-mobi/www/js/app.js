/*requirejs.config({
    baseUrl: 'js/lib',   
    paths: {
        app: '../app'
    }
});*/


var map;
var webapi;
var device;
var nearObjects;
var wkt;

//requirejs(['jquery','leaflet','app/android','Google'],
//function   ($,lf,mb,gg) {

jQuery(document).ready(function(){
	
	device=new MobileDevice();	
	webapi = new WebService();	
	map = new MapWrapper('map',InitApp);
	
	jQuery('#menu-btn').click(function()
	{	
		if(jQuery('#map').css('left')=='0px')
			$( "#map" ).animate({ "left": "-90%" }, "slow" );
		else
			$( "#map" ).animate({ "left": "0%" }, "slow" );
	});
	
	jQuery('#find-near-btn').click(searchNearObjects);
	
});

function searchNearObjects()
{
	var near_btn = $(this);
	
	if(near_btn.hasClass('image-animation')){
		return false;
	}
	
	var iCounter = 0;
	
	var markerColorList = new Array(
		map.MARKER_BLUE,
		map.MARKER_PURPLE,
		map.MARKER_YELLOW,
		map.MARKER_RED,
		map.MARKER_GREEN2,
		map.MARKER_PURPLE2,
		map.MARKER_GREEN3,
		map.MARKER_AQUA,
		map.MARKER_GRAY,
		map.MARKER_BROWN
	);
	
	near_btn.addClass('image-animation');
	
	setTimeout(function () {
	
	var centerPoint = map.getCenterOfMap();		
		
	nearObjects = webapi.getNearObjects(centerPoint.lat,centerPoint.lng);
	
	map.removeMarkers('near');
	
	
	if(nearObjects != false){			
	
		jQuery.each(nearObjects, function( key, val ) {	
			
			map.addMarker('near',markerColorList[iCounter++],val.getLatitude(),val.getLongitude(),val.getName(),false);
			
		});
		
		map.fitZoom('near',5,centerPoint);
		
	}else{
		alert('error');
	}
	
	near_btn.removeClass('image-animation');
	
	
	},3000);
	
}

function InitApp(latitude,longitude)
{
	map.setCenter(latitude,longitude,0);
	map.addMarker('primary',map.MARKER_ORANGE,latitude, longitude,'Jesteś tutaj',true);
	$('#splashscreen').hide();
}

function centerMap()
{
	map.goToCenter();
}
