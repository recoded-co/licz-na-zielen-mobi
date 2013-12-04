/*

Android

*/

var MapWrapper = (function () {

	//constructor
    var cls = function (div_tag,locationCallback) {
        
		function onLocationFound(e) {
			locationCallback(e.latlng.lat,e.latlng.lng);
		}

		function onLocationError(e) {
			alert(e.message);
		}
		
		var aMarkerList = new Array();
		
		
		//Init map
		var map = L.map(div_tag);
		var osm = L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
				maxZoom: 18,
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
		}).addTo(map);
		
		map.on('locationfound', onLocationFound);
		map.on('locationerror', onLocationError);
		map.locate({setView: true, maxZoom: 16});
		
		try
		{
			var ggl = new L.Google();
			map.addControl(new L.Control.Layers( {'OSM':osm, 'Google':ggl}, {}));
		}catch(err){
			alert('Error: '+err.message);
		}
		
		//Init center of map
		var center = new Array();
		center[0] = 0;
		center[1] = 0;
		
		/*custum markers*/		
		this.MARKER_BLUE = 'blue';
		
		var markers = new Array();
		
		markers[this.MARKER_BLUE] = L.icon({
			iconUrl: 'images/marker.png',
			shadowUrl: 'images/marker-shadow.png',
			iconSize:     [25, 41],
			shadowSize:   [41, 41],
			iconAnchor:   [0, 0],
			shadowAnchor: [0, 0],
			popupAnchor:  [12, 0]
		});
		
		this.fitZoom = function (layer,number,centerPoint) {
		
			var iCounter = 0;
			var iLength = aMarkerList[layer].length;
			var iNumber = Math.min(iLength,number);
			
			var markerst = new Array();			
						
			for(i=0;i<iLength;i++)
			{				
				markerst[i] = new Array(centerPoint.distanceTo(aMarkerList[layer][i].getLatLng()),aMarkerList[layer][i].getLatLng());			
			}			
			
			markerst.sort(function(a,b){return a[0]-b[0]});				
			
			var iSouth = centerPoint.lng,
				iWest = centerPoint.lat,
				iNorth = centerPoint.lng,
				iEast = centerPoint.lat;			
			
			
			for(i=0;i<iNumber;i++)
			{				
				if(markerst[i][1].lng<iSouth)
					iSouth = markerst[i][1].lng;
					
				if(markerst[i][1].lng>iNorth)
					iNorth = markerst[i][1].lng;
					
				if(markerst[i][1].lng<iWest)
					iWest = markerst[i][1].lat;
					
				if(markerst[i][1].lng>iEast)
					iEast = markerst[i][1].lat;
			}				
			
			var southWest = L.latLng(iWest,iSouth),northEast = L.latLng(iEast,iNorth);	

			var newRegion = L.latLngBounds(southWest, northEast);
		
			if(!map.getBounds().contains(newRegion))
			{			
				map.fitBounds(newRegion);
			}
		};
		
		this.removeMarkers = function (layer) {
		
			if(!aMarkerList.hasOwnProperty(layer))
				return;
			
			var iLength = aMarkerList[layer].length;
			
			for(i=0;i<iLength;i++)
			{				
				map.removeLayer(aMarkerList[layer]);			
			}
			aMarkerList[layer] = new Array();
		};
				
		this.addMarker = function (layer,type,latitude, longitude,text,show) {
		
			var mark = L.marker([latitude, longitude],{icon: markers[type]}).addTo(map).bindPopup(text);
			
			if(show)
				mark.openPopup();				
				
			if(!aMarkerList.hasOwnProperty(layer))
				aMarkerList[layer] = new Array();
			
			aMarkerList[layer].push(mark);
        };
				
		this.setCenter = function (latitude, longitude,zoom) {
		
			map.setView([latitude, longitude], 20);	
			center[0] = latitude;
			center[1] = longitude;
			
        };
		
		this.goToCenter = function () {		
			map.setView([center[0], center[1] ], 20);			
        };
		
		this.getCenterOfMap = function () {
			return map.getCenter();	
        };
		
    };    

    return cls;
})();



