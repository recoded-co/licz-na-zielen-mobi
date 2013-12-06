/*

Android

*/


var PleaceObject = (function () {
	
	//constructor
    var cls = function () {
        
		var sName = '';
		var dLatitude = '';
		var dLongitude = '';
		var iFavorite = 0;
		var oId = '';
		
		this.getName = function () {			
			return sName;			
        };
		
		this.getLatitude = function () {			
			return dLatitude;			
        };
		
		this.getLongitude = function () {			
			return dLongitude;			
        };
		
		this.setName = function (name) {			
			sName = name;			
        };
		
		this.setLatitude = function (lat) {			
			dLatitude = lat;			
        };
		
		this.setLongitude = function (lng) {			
			dLongitude = lng;			
        };
		
		this.getFavorite = function () {			
			return iFavorite;			
        };
		
		this.setFavorite = function (fav) {			
			iFavorite = fav;			
        };
		
		this.getId = function () {			
			return oId;			
        };
		
		this.setId = function (id) {			
			oId = id;			
        };
		
    };    

    return cls;
})();



