requirejs.config({
    baseUrl: 'js/lib',   
    paths: {
        app: '../app'
    }
});


requirejs(['jquery','leaflet','app/android'],
function   ($,lf,mb) {
    
	
	var greenIcon = L.icon({
		iconUrl: 'images/marker.png',
		shadowUrl: 'images/marker-shadow.png',

		iconSize:     [25, 41], // size of the icon
		shadowSize:   [41, 41], // size of the shadow
		iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
		shadowAnchor: [0, 0],  // the same for the shadow
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});
	
	var device=new MobileDevice();	
	
	var map = L.map('map', {
		center: device.getLocation(),
		zoom: 20
	});

	
	L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
	}).addTo(map);
	
	if(!device.isLocationEnable())
	//	map.locate({setView: true, maxZoom: 16});
	{
		
		if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(function(position)
			{
				map.setView([position.coords.latitude, position.coords.longitude], 20);
				L.marker([position.coords.latitude, position.coords.longitude],{icon: greenIcon}).addTo(map);
				$('#splashscreen').hide();
			},
			function(err)
			{				
				
			}
			);
		}else{
			
		}
		
		
	}
	
	
	
});