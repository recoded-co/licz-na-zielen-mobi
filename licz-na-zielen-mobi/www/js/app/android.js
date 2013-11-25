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
		
		this.getLocation = function () {
            return [52.399, 16.900];
        };
		
		this.lopt = function () {
            alert('koko');
        };
		
    };    

    return cls;
})();