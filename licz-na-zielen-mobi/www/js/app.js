/*requirejs.config({
    baseUrl: 'js/lib',   
    paths: {
        app: '../app'
    }
});*/

var map;
var webapi;
var debug;
var cachedNearObjects = new Array();
var cachedFindObjects = new Array();
var markerColorList;
var myAudio;

//requirejs(['jquery','leaflet','app/android','Google'],
//function   ($,lf,mb,gg) {

jQuery(document).ready(function(){
	
	//Init classes
	//debug=new DebugMop();
	webapi = new WebService();	
	map = new MapWrapper('map',InitApp);
	
	
	markerColorList = new Array(
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
	
	
	//Update favorite info
	webapi.enumFavoriteObjects(
		function()
		{
			webapi.clearFavoriteObjects();
		},
		function(simpleObject)
		{
			webapi.getDetails(simpleObject,function(simpleObject){
				webapi.saveFavoriteObject(simpleObject);
			});
			
		},''
	);
			
	//Show favorite
	if(webapi.getSettings('fav')=='true')
		showFavorite(true);
	else{
		$('.icon-heart').addClass('deactiv');
	}
	
	if(webapi.getSettings('sat')=='true'){
		map.showSateliteView(true);
	}else{
		$('.icon-globe').addClass('deactiv');
	}
	
	//Show/Hide menu TODO
	jQuery('#menu-btn').click(showMenu);	
	
	jQuery('#menu-page > div > div:first-child').click(showMenu);
	
	//Find 10 objects button
	jQuery('#find-near-btn, #search-near-dlg').click(searchNearObjects);
	
	//Hide dialog whit 10 objects
	jQuery('#hide-near-dlg').click(function()
	{	
		
		jQuery('#near-object-list').hide();
		
	});
	
	//Hide object detalis dialog
	jQuery('#close-obj-dlg').click(function()
	{	
		jQuery('#object-dlg').hide();
		changeSearchBar('',false);
	});
	
	//Add to favorite
	jQuery('#fav-obj-dlg').click(function()
	{	
		var id = $(this).find('span').text();		
		webapi.saveFavoriteObject(cachedNearObjects[id]);
		showFlashMessage('lokalizacja została dodana do ulubionych');
	});
	
	jQuery('#project-info-btn').click(function(){
		jQuery('#about-dlg').show();
	});
	
	jQuery('#close-about-dlg').click(function(){
		jQuery('#about-dlg').hide();
	});
		
	jQuery('#on-fav-btn').click(function()
	{	
		var iClass = $(this).children("i").eq(0);
		var action = iClass.hasClass('deactiv');
		
		if(action)
		{
			iClass.removeClass('deactiv');
		}else{
			iClass.addClass('deactiv');
		}
		
		showFavorite(action);
		webapi.saveSettings('fav',action);
	});
	
	jQuery('#on-sat-btn').click(function()
	{	
		var iClass = $(this).children("i").eq(0);
		var action = iClass.hasClass('deactiv');
		
		if(action)
		{
			iClass.removeClass('deactiv');
		}else{
			iClass.addClass('deactiv');
		}
		
		map.showSateliteView(action);
		webapi.saveSettings('sat',action);
		
	});
	
	jQuery('#off-sat-btn').click(function()
	{	
		$(this).addClass('activ');
		$('#on-sat-btn').removeClass('activ');
		map.showSateliteView(false);
		webapi.saveSettings('sat',false);
	});
	
	//Find button
	jQuery('#find-btn').click(function()
	{
		changeSearchBar('',true);
	});
	
	$('#menu-item-14 > input').keyup(function () { 
	
		var sText = $(this).val();
		var iLenghth = sText.length;
		
		if(iLenghth==3)
		{
			var centerPoint = map.getCenterOfMap();
			
			if(!cachedFindObjects.length)
				webapi.getSearchObjects(sText,function(data){
					cachedFindObjects = data;
					showObjectSerchResult(cachedFindObjects);
				},centerPoint.lat,centerPoint.lng);
			
		}else if(iLenghth<3)
		{
			cachedFindObjects = new Array();
			$('#find-list').hide();
		}else{
			//alert(cachedFindObjects.length);
			$('#find-list').hide();
			if(cachedFindObjects.length)
			{
				var obj = filterObject(cachedFindObjects,sText);
				
				showObjectSerchResult(obj);
			}			
		}		

	});	
		
	$('#menu-item-14 > input').blur(function(){
		//$('#find-list').hide();	
	});
	
	$('#menu-item-14 > input').focus(function(){
		$('#find-canvas').fadeIn('slow');
		showObjectSerchResult(cachedFindObjects);
	});
	
	$('#find-canvas').click(function(){
		$('#find-canvas').fadeOut('slow');
		$('#find-list').hide();
	});
	
	changeSearchBar('',false);
	
	if (navigator.userAgent.toLowerCase().indexOf("android") > -1) {
		bindTouch($('#face-obj-dlg'));
		//bindTouch($('#find-btn'));
		bindTouch($('#fav-obj-dlg'));
		bindTouch($('#hide-near-dlg'));
		bindTouch($('#search-near-dlg'));
		bindTouch($('.leaflet-control-zoom > a'));
		bindTouch($('.touch-action'));
	}
	
	$('#close_app').click(function(){		
		var centerPoint = map.getCenterOfMap();		
		webapi.saveLocation(centerPoint.lat,centerPoint.lng);
	});
	
	jQuery('.obj-tab-buttons > button').click(function()
	{	
		
		var obj = jQuery(this);
		jQuery('.obj-tab-buttons > button').removeClass('btn-active');
		obj.addClass('btn-active');
		
		jQuery('#obj-tab-items > div').hide();
		jQuery('#obj-tab-items > div').eq(obj.index()).show();
		
	});
	
	var container = jQuery('#error-continer');
	
	jQuery('#obj-add-comment > form').validate({
		errorContainer: container,
		errorLabelContainer: jQuery("span", container),
		wrapper: 'div',
		submitHandler: function(form) 
		{    
			webapi.addComment(jQuery('#comment-name').val(),jQuery('#comment-message').val());
			showFlashMessage('komentarz został dodany');	
			jQuery('#comment-name').val('').prop("disabled",true);
			jQuery('#comment-message').val('').prop("disabled",true);
			jQuery('#send-comment-btn').prop("disabled",true);
		},
		rules: {                        
			'nick': {required:true},
			'message': {required:true}
		},
		messages: {
			'nick': {
				required:'Nick field is required.'
			},
			'first-name': {
				required:'Message field is required.'
			}
		}                 
    });	
	
});


function bindTouch(eventTouch)
{
	
 +eventTouch
 .bind("touchstart", function () { 
     $(this).addClass("fake-active");
 })
 .bind("touchend", function() {
     $(this).removeClass("fake-active");
 });

}

function showFlashMessage(sText)
{
	jQuery('#flash-dlg').text(sText).fadeIn("slow").delay( 2000 ).fadeOut('slow');
}

function showMenu()
{
	
	if(!$( "#menu-canvas" ).is(':visible'))
	{
		$( "#menu-canvas" ).fadeIn("normal");
		$('#menu-page').show();
		$('#menu-page').css("left","100%");
		$( "#menu-page" ).animate({ "left": "0%" }, "normal" );
	}else{	
		$( "#menu-page" ).animate({ "left": "100%" }, "normal",function(){
			$('#menu-page').hide();
		} );
		$( "#menu-canvas" ).fadeOut( "normal" );
	}
}

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
			simpleObject.setFavorite(true);
			map.addMarker('fav',map.MARKER_GREEN,simpleObject.getLatitude(),simpleObject.getLongitude(),
			simpleObject.getName(),false,showObjectDetalis,simpleObject);
		},'');
		
	return true;
}

function triggerShowDetalis()
{	
	showObjectDetalis(cachedNearObjects[$(this).attr('id')],'');
}	

function filterObject(aObjectList,sText)
{
	var result = new Array();
	
	jQuery.each(aObjectList, function( key, val ) {	
	
		if(val.getName().toLowerCase().indexOf(sText.toLowerCase()) == 0)
		{			
			result.push(val.cloneObject());
		}
	});
	
	return result;
}

function showObjectSerchResult(aObjectList)
{
	if(!aObjectList.length)
		return false;


	var ls = $('#find-list');
	
	ls.empty();
	
	jQuery.each(aObjectList, function( key, val ) {
	
		var newItem = $('<a href="#"><div>'+val.getName()+'</div></a>');
		bindTouch(newItem);
		newItem.bind('click',function(){
			showSerachObjectOnMap(val);
			ls.hide();
			changeSearchBar('',false);
			$('#find-canvas').fadeOut('slow');
		});	
		
		ls.append(newItem);
		
	});
	
	ls.show();
	return true;
}

function showSerachObjectOnMap(simpleObject)
{	
	//webapi.getDetails(simpleObject,function(){
		
		map.addMarker('near',map.MARKER_AQUA2,simpleObject.getLatitude(),simpleObject.getLongitude(),
				'<b>'+simpleObject.getName()+'</b>',false,showObjectDetalis,simpleObject);
		map.moveTo(simpleObject.getLatitude(),simpleObject.getLongitude());
		
		if(cachedNearObjects[simpleObject.getGUID()] === undefined)
			cachedNearObjects[simpleObject.getGUID()] = simpleObject;
	
	//});
	
}

function showObjectOnList(simpleObject,color,dist)
{	
	var oObject = $('#near-object-list').find('.template').clone();
	
	oObject.removeClass('template hidden');
	
	oObject.attr('id',simpleObject.getGUID());
	
	oObject.find('.obj-name').text(simpleObject.getName());
	oObject.find('.obj-fav').text(simpleObject.getFavorite());
	oObject.find('.obj-dist').text(simpleObject.getDistance());
	oObject.find('.obj-color').addClass('obj-'+color);	
	oObject.bind('click',triggerShowDetalis);
	
	var oObjIcons = oObject.find('.obj-icons');
	
	simpleObject.enumIcons(function(ico){
		oObjIcons.append('<div><img src="images/tag_ico.png" />'+ico+'</div>');
	});
	
	jQuery('#near-continer').append(oObject);
	
}

function showObjectDetalis(simpleObject,e)
{
	jQuery('#near-object-list').hide();
	
	var oObjectDlg = $('#object-dlg');
	
	oObjectDlg.find('.obj-name').text(simpleObject.getName());
	
	oObjectDlg.find('.obj-url').attr('href',simpleObject.getUrl());
	
	if(!simpleObject.setFavorite(true))
		oObjectDlg.find('.obj-dist').text(simpleObject.getDistance());
	else
		oObjectDlg.find('.obj-dist').text(map.getDistanceFromCenter(simpleObject.getLatitude(),simpleObject.getLongitude()));
		
	var oQuest = jQuery('#obj-quesans');
	oQuest.empty();
	
	simpleObject.enumQuestionsAnswers(function(q,a){
		oQuest.append('<div><span>'+q+'</span><p>'+a+'</p></div>');
	});
	
	var oObjStars = oObjectDlg.find('.obj-stars');
	oObjStars.empty();
	
	for(var i = 0;i<simpleObject.getPopularity();i++)
		oObjStars.append('<i class=" icon-star"></i>');
	
	for(var i = simpleObject.getPopularity();i<5;i++)
		oObjStars.append('<i class=" icon-star-empty"></i>');
		
	var oObjIcons = oObjectDlg.find('.obj-icons');
	oObjIcons.empty();
	
	simpleObject.enumIcons(function(ico){
		oObjIcons.append('<div><img src="images/tag_ico.png" />'+ico+'</div>');
	});
	
	jQuery('#fav-obj-dlg').find('span').text(simpleObject.getGUID());
		
	oObjectDlg.show();
	
	
	//Center marker in small map
	var iMapPixel = map.getMapPixel();
	
	var iFullMapHeight = $('#map').height();
	
	var iDlgHeight = oObjectDlg.children().eq(0).height();
	
	var iSmallMapHeight = iFullMapHeight - iDlgHeight ;
	
	var iToMove = iDlgHeight-iFullMapHeight/2 + iSmallMapHeight/2;
	
	iToMove /= iMapPixel[1];
	
	map.moveTo(simpleObject.getLatitude()-iToMove,simpleObject.getLongitude());
	
	jQuery('#comment-name').val('').prop("disabled",false);;
	jQuery('#comment-message').val('').prop("disabled",false);;
	jQuery('#send-comment-btn').prop('disabled', false);
	
	changeSearchBar(simpleObject.getName(),false);
	
}

function changeSearchBar(sText,showInput)
{
	var oSpan = $('#menu-item-14 > span');
	var oInput = $('#menu-item-14 > input');
	
	oSpan.hide();
	oInput.hide();
	
	if(sText != '')
	{
		oSpan.text(sText).show();
	}else if(showInput)
	{
		oInput.val('').show().focus();
	}else{
		oSpan.text('Licz na zieleń').show();
	}
	
}

function searchNearObjectsDetalisCallback(val)
{
	
}

function sleeping(tm,cb)
{
	var tid = setInterval(function(){
		
		if(cb())
			clearInterval( tid );
	
	},tm);
}

function searchNearObjectsCallback(nearObjects)
{
	
	var iCounter = 0;
	
	if(nearObjects != false){			
	
		var objCount = nearObjects.length;
	
		jQuery.each(nearObjects, function( key, val ) {	
		
			//webapi.getDetails(val,searchNearObjectsDetalisCallback);
			
			var distance = map.getDistanceFromCenterOfMap(val.getLatitude(),val.getLongitude());
		
			map.addMarker('near',markerColorList[iCounter++],val.getLatitude(),val.getLongitude(),
			'<b>'+val.getName()+'</b><br />'+distance+' km',false,showObjectDetalis,val);
			
			cachedNearObjects[val.getGUID()] = val;
			
			val.setDistance(distance);
			
			showObjectOnList(val,markerColorList[iCounter-1]);
			
			
		});
			
		
		var centerPoint = map.getCenterOfMap();	
		map.fitZoom('near',5,centerPoint);
		jQuery('#near-object-list').show();
		//myAudio.pause();
	}else{
		showFlashMessage('nie znalazłem obiektów');
	}
	
	$('#find-near-btn').removeClass('image-animation');
	
}

function searchNearObjects()
{

	$('#near-object-list').hide();

	var near_btn = $('#find-near-btn');
	
	if(near_btn.hasClass('image-animation')){
		return false;
	}
	
	iCounter = 0;
	
	near_btn.addClass('image-animation');
	//$('#radar-sound').get(0).play();
	
	//myAudio = new Audio('sound/sonar.mp3'); 
	//myAudio.loop = true;
	//myAudio.play();
	
	
	var centerPoint = map.getCenterOfMap();		
		
	map.removeMarkers('near');
	
	cachedNearObjects = new Array();
	
	webapi.getNearObjects(centerPoint.lat,centerPoint.lng,searchNearObjectsCallback);
	
	webapi.saveLocation(centerPoint.lat,centerPoint.lng);
	
	
	jQuery('#near-continer').empty();
	
}

function InitApp(latitude,longitude,bSuccess)
{
	if(bSuccess)
	{	
		webapi.saveLocation(latitude,longitude);
		map.setCenter(latitude,longitude,16);
		map.addMarker('primary',map.MARKER_ORANGE,latitude, longitude,'Jesteś tutaj',true,function(){},'');	
	}else{
		var loc = webapi.getLastLocation();	
		
		if(loc !== false)
		{
			map.addMarker('primary',map.MARKER_ORANGE,loc[0],loc[1],'Tu ostatnio byłeś',true,function(){},'');
			map.setCenter(loc[0],loc[1],16);
		}else{
			map.setCenter(51.97134580885172,18.599853515625,7);
		}
		
		
	}
	$('#splashscreen').hide();
}

function centerMap()
{
	map.goToCenter();
}
