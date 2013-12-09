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
	
	//Init classes
	device=new MobileDevice();	
	webapi = new WebService();	
	map = new MapWrapper('map',InitApp);
	
	//Update favorite info
	webapi.enumFavoriteObjects(
		function()
		{
			webapi.clearFavoriteObjects();
		},
		function(simpleObject)
		{
			webapi.getDetails(simpleObject);
			webapi.saveFavoriteObject(simpleObject);
		},''
	);
	
	//To Remove	
	webapi.saveSettings('fav',true);
	
	//Show favorite
	if(webapi.getSettings('fav'))
		showFavorite(true);
	
	//Show/Hide menu
	jQuery('#menu-btn').click(function()
	{	
		if(jQuery('#map').css('left')=='0px')
			$( "#map" ).animate({ "left": "-90%" }, "slow" );
		else
			$( "#map" ).animate({ "left": "0%" }, "slow" );
	});
	
	//Find 10 objects button
	jQuery('#find-near-btn').click(searchNearObjects);
	
	//Hide dialog whit 10 objects
	jQuery('#hide-near-dlg').click(function()
	{	
		jQuery('#near-object-list').hide();
	});
	
	//Hide object detalis dialog
	jQuery('#object-menu > button').click(function()
	{	
		jQuery('#object-dlg').hide();
	});
	
	//Add to favorite
	jQuery('#fav-obj-dlg').click(function()
	{	
		var id = $(this).find('span').text();		
		webapi.saveFavoriteObject(cachedNearObjects[id]);
	});
	
});


function showFavorite(bShow)
{
	if(!bShow)
	{
		map.removeMarkers('fav');
		return true;
	}
	
	webapi.enumFavoriteObjects('',
		function(simpleObject)
		{			
			map.addMarker('fav',map.MARKER_GREEN,simpleObject.getLatitude(),simpleObject.getLongitude(),
			simpleObject.getName(),false,showObjectDetalis,simpleObject);
		},'');
		
	return true;
}

function triggerShowDetalis()
{	
	showObjectDetalis(cachedNearObjects[$(this).attr('id')],'');
}	
	
function showObjectOnList(simpleObject,color,dist)
{	
	var oObject = $('#near-object-list').find('.template').clone();
	
	oObject.removeClass('template hidden');
	
	oObject.attr('id',simpleObject.getGUID());
	
	oObject.find('.obj-name').text(simpleObject.getName());
	oObject.find('.obj-fav').text(simpleObject.getFavorite());
	oObject.find('.obj-dist').text(dist);
	oObject.find('.obj-color').addClass('obj-'+color);	
	oObject.bind('click',triggerShowDetalis);
	
	var oObjIcons = oObject.find('.obj-icons');
	
	simpleObject.enumIcons(function(ico){
		oObjIcons.append('<div>*'+ico+'</div>');
	});
	
	jQuery('#near-continer').append(oObject);
	
}

function showObjectDetalis(simpleObject,e)
{
	jQuery('#near-object-list').hide();
	
	var oObjectDlg = $('#object-dlg');
	
	oObjectDlg.find('.obj-name').text(simpleObject.getName());
	oObjectDlg.find('.obj-dist').text(2.4);

	var oQuest = jQuery('#obj-quesans');
	oQuest.empty();
	
	simpleObject.enumQuestionsAnswers(function(q,a){
		oQuest.append('<div><span>'+q+'</span><p>'+a+'</p></div>');
	});
	
	var oObjStars = oObjectDlg.find('.obj-stars');
	oObjStars.empty();
	
	for(var i = 0;i<simpleObject.getPopularity();i++)
		oObjStars.append('<img src="images/yellow_star_ico.png" />');
	
	for(var i = simpleObject.getPopularity();i<5;i++)
		oObjStars.append('<img src="images/grey_star_ico.png" />');
		
	var oObjIcons = oObjectDlg.find('.obj-icons');
	oObjIcons.empty();
	
	simpleObject.enumIcons(function(ico){
		oObjIcons.append('<div>*'+ico+'</div>');
	});
	
	jQuery('#fav-obj-dlg').find('span').text(simpleObject.getGUID());
	
	oObjectDlg.show();
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
		
	var nearObjects = webapi.getNearObjects(centerPoint.lat,centerPoint.lng);
	
	map.removeMarkers('near');
	
	cachedNearObjects = new Array();
	
	if(nearObjects != false){			
	
		jQuery.each(nearObjects, function( key, val ) {	
			
			webapi.getDetails(val);
			
			var distance = centerPoint.distanceTo([val.getLatitude(),val.getLongitude()]);
			distance = parseFloat(distance/1000.0).toFixed(2);
			
			map.addMarker('near',markerColorList[iCounter++],val.getLatitude(),val.getLongitude(),
			'<b>'+val.getName()+'</b><br />'+distance+' km',false,showObjectDetalis,val);
			
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
	map.addMarker('primary',map.MARKER_ORANGE,latitude, longitude,'Jesteś tutaj',true,function(){},'');
	$('#splashscreen').hide();
}

function centerMap()
{
	map.goToCenter();
}
