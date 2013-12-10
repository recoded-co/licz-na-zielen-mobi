/*

Android

*/


var PleaceObject = (function () {
	
	//constructor
    var cls = function (isNew) {
        
		
		var  objData = new Object(); 
		
		objData.sName = 'AAA';
		objData.dLatitude = '';
		objData.dLongitude = '';
		objData.iFavorite = 0;
		objData.oId = '';
		objData.aQuestAns = new Array();
		objData.aIcons = new Array();
		objData.iPopularity = 0;
		
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
			//objData.sName = name;			
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
		
		this.getPopularity = function () {			
			return objData.iPopularity;
        };
		
		this.setPopularity = function (pop) {	
			objData.iPopularity = pop;
        };			
		
		this.addQuestionAnswer = function (q,a) {			
			objData.aQuestAns[objData.aQuestAns.length] = new Array(q,a);
        };
		
		this.clearQuestionsAnswers = function (callback) {	
			objData.aQuestAns = new Array();
        };	
		
		this.enumQuestionsAnswers = function (callback) {	
		
			if(objData.aQuestAns.length)
				jQuery.each(objData.aQuestAns, function( key, val ) {				
					callback(val[0],val[1]);
				});
        };				
		
		this.addIcon = function (ico) {			
			objData.aIcons[objData.aIcons.length] = ico;
        };
		
		this.enumIcons = function (callback) {	
		
			if(objData.aIcons.length)
				jQuery.each(objData.aIcons, function( key, val ) {				
					callback(val);
				});
			
        };	
		
    }; 

    return cls;
})();



