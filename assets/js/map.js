// leaflet map module
let leafletMapIt = (function() {
    'use strict';

    // creates a new leaflet map
    function makeMap(mapPlace, lat, lng, popupMessage){
        try{
            $('#'+mapPlace).html('<div id="mapid"></div>');
            let ourMap = L.map("mapid").setView([lat, lng], 12);
            L.tileLayer(osmStreetLayer, {
                //attribution: osmAttribution,
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: leafletAccessToken
            }).addTo(ourMap);

            addMarker(ourMap, [lat, lng], popupMessage);
        }catch(error){
            // error message display if no location present
            $('#'+mapPlace).html('<div id="mapError" class="alert alert-danger" role="alert">Sorry could not load the map <br/> as no location co-ordinates available!</div>');
        }
    }

    // adds a marker to the map reference
    // associates it with a popup
    function addMarker(map, position, popupMessage){
        let messageText = document.createTextNode(popupMessage);
        let popupContent = document.createElement("DIV");
        popupContent.style.textAlign = "center";
        popupContent.appendChild(messageText);
        L.marker(position).addTo(map).bindPopup(popupContent, {autoClose:false}).openPopup();
    }

    // public methods
    return {
        makeMap: makeMap
    };
}());
//leaflet map module ends
