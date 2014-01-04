/*

*/

var apiUrl =
{
  near_objects: 'http://alfa.licznazielen.pl/geocache/search/geo/',
  search_objects: 'http://alfa.licznazielen.pl/geocache/search/namehint/',
  details_object: 'http://alfa.licznazielen.pl/geocache/search/object/'
}

var WebService = (function () {
		
	function request_get(url_string,extra_data,success_callback)
	{				
		//		
			jQuery.ajax(
				{
					dataType: "jsonp",
					type: 'GET',
					async: false,
					url:url_string,
					data:extra_data,
					success:function(data)
					{
						success_callback(data,true);
					},
					error: function (xhr, ajaxOptions, thrownError) {
						//success_callback(xhr.responseText,false);
					}
				}
			);	
		//},3000);
	}

	//constructor
    var cls = function (div_tag) {
        
		this.getNearObjects = function (latitude, longitude,api_callback) {
				
				
			request_get(apiUrl.near_objects,
				{polygon:'POINT ('+longitude+' '+latitude+')'},
				function(data,mb)
				{						
					if(data.success)
					{
						var nearObjects = new Array();
	
						var iCounter = 0;						
						
						jQuery.each(data.objects, function( key, val ) {
							
							var singleObject = new PleaceObject(true);
							
							singleObject.setId(val.id);
							singleObject.setName(val.name);
							singleObject.setFavorite(val.favorite);
							singleObject.setUrl("http://google.pl");
							
							singleObject.setPopularity(val.popularity);
							
							var wkt = new Wkt.Wkt();					
							wkt.read(val.position);
							
							singleObject.setLatitude(wkt.components[0].y);
							singleObject.setLongitude(wkt.components[0].x);
							
							jQuery.each(val.comments, function( key, val ) {
								singleObject.addQuestionAnswer(val.key,val.value);
							});							
							
							jQuery.each(val.icons, function( key, val ) {
								singleObject.addIcon(val);
							});
							
							nearObjects[iCounter++] = singleObject;
							
						});
						
						api_callback(nearObjects);
					}else{
					//	alert(data.error_message);
					}			
				}
			);	
			
			
        };
		
		this.getDetails = function (singleObject,api_callback) {	
		
			api_callback(singleObject);					
		};
		
		this.saveLocation = function (latitude,longitude) {		
			localStorage.setItem('lnz_latitude',latitude);
			localStorage.setItem('lnz_longitude',longitude);
		};
		
		this.getLastLocation = function () {
		
			if(localStorage['lnz_latitude'])
			{
				return [localStorage.getItem('lnz_latitude'),localStorage.getItem('lnz_longitude'),0];			
			}
			
			return false;
		};
		
		
		this.saveSettings = function (key,value) {		
			localStorage.setItem(key,value);
		};
		
		this.getSettings = function (key) {
			return localStorage.getItem(key);		
		};
		
		this.saveFavoriteObject = function (singleObject) {		
			var storedNames = new Array();
			
			if(localStorage["favorite"])
				storedNames = JSON.parse(localStorage["favorite"]);
			
			storedNames[storedNames.length] = singleObject.getData();
				
			localStorage.setItem('favorite', JSON.stringify(storedNames));			
		};
		
		this.clearFavoriteObjects = function () {
			localStorage.setItem('favorite','');
		};
		
		this.enumFavoriteObjects = function (before_callback,enum_callback,after_callback) {
			
			var favObjects = this.getFavoriteObjects();
		
			if(jQuery.isFunction(before_callback))
				before_callback();
		
			if(jQuery.isFunction(enum_callback))
				if(favObjects != false){
					jQuery.each(favObjects, function( key, val ) {				
						enum_callback(val);
					});					
				}			
			
			if(jQuery.isFunction(after_callback))
				after_callback();
		};
		
		this.getFavoriteObjects = function () {
			
			var favObjects = new Array();
			
			if(!localStorage["favorite"])
				return favObjects;
			
			try
			{
					var favData = JSON.parse(localStorage["favorite"])
					
					var iCounter = 0;
					
					jQuery.each(favData, function( key, val ) {				
						var singleObject = new PleaceObject(true);	
						singleObject.setData(val);
						favObjects[iCounter++] = singleObject;
					});
					
			}catch(e){}
			
			return favObjects;			
		};
		
		this.getSearchObjects = function (sSearchText,api_callback,data1,data2) {
			
			var result = false;
		
			request_get(apiUrl.search_objects+sSearchText,
				{name:sSearchText},
				function(data,mb)
				{					
					if(data.success)
					{
						var nearObjects = new Array();
	
						var iCounter = 0;						
						
						jQuery.each(data.objects, function( key, val ) {
							
							var singleObject = new PleaceObject(true);
							
							singleObject.setId(val.id);
							singleObject.setName(val.name);
							singleObject.setFavorite(val.favorite);
							
							singleObject.setPopularity(3);
							
							var wkt = new Wkt.Wkt();					
							wkt.read(val.position);
							
							singleObject.setLatitude(wkt.components[0].y);
							singleObject.setLongitude(wkt.components[0].x);
							
							jQuery.each(val.comments, function( key, val ) {
								singleObject.addQuestionAnswer(val.key,val.value);
							});
							
							
							jQuery.each(val.icons, function( key, val ) {
								singleObject.addIcon(val);
							});
							
							nearObjects[iCounter++] = singleObject;
							
						});
						
						api_callback(nearObjects);
					}else{
					//	alert(data.error_message);
					}			
							
				}
			);
			
			return result;		
        };
		
		
    };    

    return cls;
})();



