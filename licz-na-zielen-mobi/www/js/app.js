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
	
	//map.fitBounds(bounds);
		
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
	
	near_btn.addClass('image-animation');
	
	setTimeout(function () {
	
	var centerPoint = map.getCenterOfMap();		
		
	var objectsList = webapi.getNearObjects(centerPoint.lat,centerPoint.lng);
	
	map.removeMarkers('near');
	
	if(objectsList != false){
	
		nearObjects = new Array();
	
		jQuery.each(objectsList, function( key, val ) {
			
			singleObject = new Array();
			singleObject['id'] = new Array(val.id,val.feature,val.slug,val.datasetdef.id);
			singleObject['cache'] = false;
			singleObject['favorite'] = val.favorite;
			singleObject['name'] = val.datasetdef.name;
			
			wkt = new Wkt.Wkt();
			
			wkt.read(val.geometry);
			
			map.addMarker('near',map.MARKER_BLUE,wkt.components[0].x,wkt.components[0].y,val.datasetdef.name,false);
			
			singleObject['location'] = val.datasetdef.name;
			nearObjects[val.id] = singleObject;			
			
			
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
	map.addMarker('primary',map.MARKER_BLUE,latitude, longitude,'Jesteś tutaj',true);
	$('#splashscreen').hide();
}

function centerMap()
{
	map.goToCenter();
}
