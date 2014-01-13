var debug = true;

function fakeApiNearObjects(args)
{
	try
		{
			var wkt = new Wkt.Wkt();			
			wkt.read(args.data["polygon"]);			
			
			var json = '{"success":"true","objects":[';			
			
			json += '{"id":'+Math.floor((Math.random()*1000)+1);
			json += ',"type": "praca-lub-nauka","name": "praca-lub-nauka-23-wyzszaszkola-tanca-latino","position": "POINT (';
			json += parseFloat(wkt.components[0].x)+Math.random()/100;
			json += ' ';
			json += parseFloat(wkt.components[0].y)+Math.random()/100;
			json += ')","popularity": 4,"datasetdef": {"id": 6,"name": "AAA","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
			json += '","icons":["muzeum","lotnisko","ble","skansen","wieloryb","hotel"],"comments":[]}';			
			
			for(var i=0;i<9;i++)
			{						
				json += ',{"id":'+Math.floor((Math.random()*1000)+1);
				json += ',"type": "praca-lub-nauka","name": "praca lub nauka 23 yzszaszkola tanca latino","position": "POINT (';
				json += parseFloat(wkt.components[0].x)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ' ';
				json += parseFloat(wkt.components[0].y)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ')","popularity": 4,"datasetdef": {"id": 6,"name": "AAA","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
				json += '","icons":["muzeum","lotnisko","ble","skansen","wieloryb","hotel"],"comments":[]}';	
			}
			
			json += ']}';

			json = jQuery.parseJSON(json);
			
			args.success(json);	
	
		}catch(e)
		{
			alert(e.message );
		}
}

function fakeApiSearchObjects(args)
{
	try
	{	
		var json = '{"success":"true","object":{"raw_properties":[{"value": "codziennie-lub-prawie-codziennie","key": "4.2. Czestotliwosc odwiedzania"},{"value":"rowerem","key": "4.3. Sposob dotarcia"}]}}';
		json = jQuery.parseJSON(json);		
		args.success(json);	
	}catch(e)
	{
		alert(e.message );
	}
}

function fakefindByNameObjects(args)
{		
	try
		{
			var wkt = new Wkt.Wkt();			
			wkt.read(args.data["polygon"]);			
			
			var json = '[';			
			
			json += '{"id":'+Math.floor((Math.random()*1000)+1);
			json += ',"type": "praca-lub-nauka","name": "praca-lub-nauka-23","position": "POINT (';
			json += parseFloat(wkt.components[0].x)+Math.random()/100;
			json += ' ';
			json += parseFloat(wkt.components[0].y)+Math.random()/100;
			json += ')","popularity": 24,"datasetdef": {"id": 6,"name": "'+args.data['name'];
			
			var lo = Math.floor(Math.random()*5);
			
			for(var j=0;j<lo;j++)
			json += String.fromCharCode(65+Math.floor((Math.random()*20)+1));
			
			json += '","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
			json += '"}';			
			
			for(var i=0;i<9;i++)
			{						
				json += ',{"id":'+Math.floor((Math.random()*1000)+1);
				json += ',"type": "praca-lub-nauka","name": "praca-lub-nauka-23","position": "POINT (';
				json += parseFloat(wkt.components[0].x)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ' ';
				json += parseFloat(wkt.components[0].y)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ')","popularity": 24,"datasetdef": {"id": 6,"name": "'+args.data['name'];
			
				var lo = Math.floor(Math.random()*5);
				
				for(var j=0;j<lo;j++)
				json += String.fromCharCode(65+Math.floor((Math.random()*20)+1));
			
				json += '","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
				json += '"}';	
			}
			
			json += ']';

			json = jQuery.parseJSON(json);
			
			args.success(json);	
	
		}catch(e)
		{
			alert(e.message );
		}	
}

var apiUrl =
{
  near_objects: 'http://alfa.licznazielen.pl/geocache/search/geo/',
  search_objects: 'http://alfa.licznazielen.pl/geocache/search/namehint/',
  details_object: 'http://alfa.licznazielen.pl/geocache/search/object/'
}

function jQuery_ajax(args)
{
	if(args.url.search(apiUrl.near_objects)>-1)
		fakeApiNearObjects(args);
	else if(args.url.search(apiUrl.details_object)>-1)
		fakeApiSearchObjects(args);
	else
		fakefindByNameObjects(args);
}


var WebService = (function () {
		
	function request_get(url_string,extra_data,success_callback)
	{				
		setTimeout(function(){
			jQuery_ajax(
				{
					dataType: "json",
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
		},3000);
		
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
		
			/*var result = false;
		
			var aId = singleObject.getId();
			
			request_get(apiUrl.details_object+aId[1]+'/'+aId[3]+'/'+aId[2],
				{feature:aId[1],datasetdef_id:aId[3],slug:aId[2]},
				function(data,mb)
				{					
					if(data.success)
					{
						singleObject.clearQuestionsAnswers();
						
						jQuery.each(data.object.raw_properties, function( key, val ) {
							singleObject.addQuestionAnswer(val.key,val.value);
						});
						
						//TODO
						singleObject.setPopularity(3);
						
						result = true;
						api_callback(singleObject);
					}else{
						alert(data.error_message);
					}			
				}
			);*/
			
			//return result;			
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




