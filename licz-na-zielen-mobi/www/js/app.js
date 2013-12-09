/*requirejs.config({
    baseUrl: 'js/lib',   
    paths: {
        app: '../app'
    }
});*/


var map;
var webapi;
var device;
var cachedNearObjects;
var wkt;

//requirejs(['jquery','leaflet','app/android','Google'],
//function   ($,lf,mb,gg) {

jQuery(document).ready(function(){
	
	device=new MobileDevice();	
	webapi = new WebService();	
	map = new MapWrapper('map',InitApp);
	
	webapi.saveSettings('fav',true);
	
	//if(webapi.getSettings('fav'))
	//	showFavorite(true);
	
	jQuery('#menu-btn').click(function()
	{	
		if(jQuery('#map').css('left')=='0px')
			$( "#map" ).animate({ "left": "-90%" }, "slow" );
		else
			$( "#map" ).animate({ "left": "0%" }, "slow" );
	});
	
	jQuery('#find-near-btn').click(searchNearObjects);
	
	jQuery('#hide-near-dlg').click(function()
	{	
		jQuery('#near-object-list').hide();
	});
	
	
});


function showFavorite(bShow)
{
	if(!bShow)
	{
		map.removeMarkers('fav');
		return true;
	}

	var favObjects = webapi.getFavoriteObjects();
		
	if(favObjects != false){			
	
		jQuery.each(favObjects, function( key, val ) {				
			map.addMarker('fav',map.MARKER_GREEN,val.getLatitude(),val.getLongitude(),val.getName(),false);				
		});
		
	}else{
		return false;
	}
	
	return true;
}

function showObjectOnList(simpleObject,color,dist)
{	
	var oObject = $('#near-object-list').find('.template').clone();
	
	oObject.removeClass('template hidden');
	
	oObject.find('.obj-name').text(simpleObject.getName());
	oObject.find('.obj-fav').text(simpleObject.getFavorite());
	oObject.find('.obj-dist').text(dist);

	oObject.find('.obj-color').addClass('obj-'+color);
	
	jQuery('#near-continer').append(oObject);
	
}

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
	
	cachedNearObjects = new Array();
	
	if(nearObjects != false){			
	
		jQuery.each(nearObjects, function( key, val ) {	
			
			var distance = centerPoint.distanceTo([val.getLatitude(),val.getLongitude()]);
			distance = parseFloat(distance/1000.0).toFixed(2);
			
			map.addMarker('near',markerColorList[iCounter++],val.getLatitude(),val.getLongitude(),'<b>'+val.getName()+'</b><br />'+distance+' km',false);
			
			cachedNearObjects[val.getGUID()] = val;
			
			showObjectOnList(val,markerColorList[iCounter-1],distance);
				
			//webapi.saveFavoriteObject(val);
			
		});
		
		map.fitZoom('near',5,centerPoint);
		
		jQuery('#near-object-list').show();
		
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
