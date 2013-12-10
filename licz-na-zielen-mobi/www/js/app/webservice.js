/*

Android

*/

function fakeApiNearObjects(args)
{
	try
		{
			
			var wkt = new Wkt.Wkt();			
			wkt.read(args.data["polygon"]);			
			
			//var json = '{"success":"true","hits":1,"objects":[{"id": 1060,"type": "praca-lub-nauka","slug": "praca-lub-nauka-23","geometry": "POINT (1885969.0171316999476403 6884584.6045808997005224)","feature": 24,"datasetdef": {"id": 6,"name": "AAA","icon":""},"favorite": "9"}]}';
			
			var json = '{"success":"true","hits":1,"objects":[';			
			
			json += '{"id":'+Math.floor((Math.random()*1000)+1);
			json += ',"type": "praca-lub-nauka","slug": "praca-lub-nauka-23","geometry": "POINT (';
			json += parseFloat(wkt.components[0].x)+Math.random()/100;
			json += ' ';
			json += parseFloat(wkt.components[0].y)+Math.random()/100;
			json += ')","feature": 24,"datasetdef": {"id": 6,"name": "AAA","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
			json += '"}';			
			
			for(var i=0;i<9;i++)
			{						
				json += ',{"id":'+Math.floor((Math.random()*1000)+1);
				json += ',"type": "praca-lub-nauka","slug": "praca-lub-nauka-23","geometry": "POINT (';
				json += parseFloat(wkt.components[0].x)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ' ';
				json += parseFloat(wkt.components[0].y)+(Math.random()/100*Math.floor((Math.random()*2)-1));
				json += ')","feature": 24,"datasetdef": {"id": 6,"name": "AAA","icon":""},"favorite": "'+Math.floor((Math.random()*1000)+1);
				json += '"}';	
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

var apiUrl =
{
  near_objects: 'http://alfa.licznazielen.pl/geocache/search/geo/',
  search_objects: 'http://alfa.licznazielen.pl/geocache/search/namehint/',
  details_object: 'http://alfa.licznazielen.pl/geocache/search/object/'
}

function jQuery_ajax(args)
{
	if(args.url==apiUrl.near_objects)
		fakeApiNearObjects(args);
	else if(args.url.search(apiUrl.search_objects))
		fakeApiSearchObjects(args);
	else
		args.success('');
}


var WebService = (function () {
		
	function request_get(url_string,extra_data,success_callback)
	{		
		
		jQuery.ajax(
			{
				dataType: "json",
				type: 'GET',
				async: false,
				url:url_string,
				//data:extra_data,
				success:function(data)
				{
					success_callback(data,true);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					success_callback(xhr.responseText,false);
				}
			}
		);		
		
	}

	//constructor
    var cls = function (div_tag) {
        
		this.getNearObjects = function (latitude, longitude) {
				
			var result = false;
		
			request_get(apiUrl.near_objects+'?polygon=POINT+('+latitude+'+'+longitude+')/',
				{polygon:'POINT ('+latitude+' '+longitude+')'},
				function(data,mb)
				{					
					//if(data.success)
					//{
						var nearObjects = new Array();
	
						var iCounter = 0;
						
						//alert(data.length);
						
						//jQuery.each(data, function( key, val ) {
						
						for(var i=0;i<data.length;i++)
						{
							var val = data[i];
							
							
							if(typeof val === 'undefined')
							{
							}else
							{
							
							
							
							var singleObject = new PleaceObject(true);
							
							singleObject.setId(new Array(val.id,val.feature,val.slug,val.datasetdef.id));
							singleObject.setName(val.name);
							singleObject.setFavorite(val.favorite);
							
							wkt = new Wkt.Wkt();					
							wkt.read(val.place_LL);
							
							singleObject.setLatitude(wkt.components[0].y);
							singleObject.setLongitude(wkt.components[0].x);
							
							//TODO
							//singleObject.addIcon('rower');
							singleObject.addIcon('muzeum');
							
							nearObjects[iCounter++] = singleObject;
							}
						}
						
						result = nearObjects;
					//}else{
					//	alert(data.error_message);
					//}			
				}
			);
			
			return result;
			
        };
		
		this.getDetails = function (singleObject) {

			var result = false;
		
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
						
					}else{
						alert(data.error_message);
					}			
				}
			);
			
			return result;			
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
		
		this.getSearchObjects = function (sSearchText) {
			//TODO
			return false;			
        };
		
		
    };    

    return cls;
})();



