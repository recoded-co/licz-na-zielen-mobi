/*

Android

*/

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }

    alert(out);
}

function jQuery_ajax(args)
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


var WebService = (function () {

	var apiUrl =
	{
	  near_objects: 'https://example.com/geocache/search/polygon/'
	}
		
	function request_get(url_string,extra_data,success_callback)
	{		
		
		jQuery_ajax(
			{
				dataType: "jsonp",
				type: 'GET',
				async:true,                    
				url:apiUrl.near_objects,
				data:extra_data,
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
		
			request_get(apiUrl.near_objects,
				{polygon:'POINT ('+latitude+' '+longitude+')'},
				function(data,mb)
				{					
					if(data.success)
					{
						
						var nearObjects = new Array();
	
						var iCounter = 0;
						
						jQuery.each(data.objects, function( key, val ) {
							
							var singleObject = new PleaceObject();
							
							singleObject.setId(new Array(val.id,val.feature,val.slug,val.datasetdef.id));
							singleObject.setName(val.datasetdef.name);
							singleObject.setFavorite(val.favorite);
							
							wkt = new Wkt.Wkt();					
							wkt.read(val.geometry);
							
							singleObject.setLatitude(wkt.components[0].x);
							singleObject.setLongitude(wkt.components[0].y);
							
							nearObjects[iCounter++] = singleObject;
							
						});
						
						result = nearObjects;
					}else{
						alert(data.error_message);
					}			
				}
			);
			
			return result;
			
        };
		
    };    

    return cls;
})();



