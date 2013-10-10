/**
 * Created with PyCharm.
 * User: dwa
 * Date: 10.10.2013
 * Time: 12:07
 * To change this template use File | Settings | File Templates.
 */

var global_marker_layers = {};

var placeMarkers = function(map, markers){
    var size = new OpenLayers.Size(21,25);
    console.log(size);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    console.log(offset);
    var icon = new OpenLayers.Icon('img/marker.png', size, offset);
    console.log(icon);
    for (var i in markers){
        var layerData = markers[i];
        var layerName = layerData.type;
        var markerLayers;
        if( layerName in global_marker_layers){
            markerLayers = global_marker_layers[layerName];
        } else {
            markerLayers = new OpenLayers.Layer.Markers( layerName );
            map.addLayer(markerLayers);
            global_marker_layers[layerName]=markerLayers;
        }
        var geometry_obj = layerData.geometry;
            var geometry = OpenLayers.Geometry.fromWKT(geometry_obj); //new OpenLayers.Geometry.Point();
            var marker = new OpenLayers.Marker(new OpenLayers.LonLat(geometry.x, geometry.y),icon.clone());
            markerLayers.addMarker(marker);
    }

    //map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.zoomToMaxExtent();
    console.log('markers added');
}

var getMarkers = function(){
    console.log('markers_data:'+markers_data);
    placeMarkers(map, markers_data);
}