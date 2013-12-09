/*

Android

*/


var PleaceObject = (function () {
	
	//constructor
    var cls = function (isNew) {
        
		
		var  objData = new Object(); 
		
		objData.sName = '';
		objData.dLatitude = '';
		objData.dLongitude = '';
		objData.iFavorite = 0;
		objData.oId = '';
		
		var iDistance = 0;
		var bCache = isNew;
		
		objData.toJSON = function(key)
		 {
			var replacement = new Object();
			for (var val in this)
			{
				if (typeof (this[val]) === 'string')
					replacement[val] = this[val].toUpperCase();
				else
					replacement[val] = this[val]
			}
			return replacement;
		};
		
				
		this.getName = function () {			
			return objData.sName;			
        };
		
		this.getLatitude = function () {			
			return objData.dLatitude;			
        };
		
		this.getLongitude = function () {			
			return objData.dLongitude;			
        };
		
		this.setName = function (name) {			
			objData.sName = name;			
        };
		
		this.setLatitude = function (lat) {			
			objData.dLatitude = lat;			
        };
		
		this.setLongitude = function (lng) {			
			objData.dLongitude = lng;			
        };
		
		this.getFavorite = function () {			
			return objData.iFavorite;			
        };
		
		this.setFavorite = function (fav) {			
			objData.iFavorite = fav;			
        };
		
		this.getId = function () {			
			return objData.oId;			
        };
		
		this.setId = function (id) {			
			objData.oId = id;			
        };	
		
		this.getGUID = function (id) {			
			return objData.oId[0];			
        };
		
		this.getData = function () {			
			return JSON.stringify(objData)
        };
		
		this.setData = function (sText) {	
			
			try
			{
				objData = JSON.parse(sText);
			}catch(e)
			{
				
			}
        };	
		
		this.getDistance = function () {			
			return iDistance;
        };
		
		this.setDistance = function (dist) {	
			iDistance = dist;
        };		
		
    };    

    return cls;
})();



