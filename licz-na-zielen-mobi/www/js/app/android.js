/*

Android

*/

var MobileDevice = (function () {

    var cls = function () {
        
        this.closeApp = function () {
            
        };
		
		this.isLocationEnable = function () {
            return false;
        };
		
		this.EmulateLocation = function (callback) {
		
		
			setTimeout(function () {
				callback(52.399, 16.900);			
			},6000);
		
			/*if (navigator.geolocation)
			{
				navigator.geolocation.getCurrentPosition(function(position)
				{
					callback(position.coords.latitude,position.coords.longitude);
				},
				function(err)
				{				
					
				}
				);
			}else{
				
			}*/
        };		
		
		this.getLocation = function () {
            return [52.399, 16.900];
        };
		
		this.lopt = function () {
            alert('koko');
        };
		
    };    

    return cls;
})();