// Creating our initial map object:
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding a tile layer (the background map image) to our map:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Getting our GeoJSON data
d3.json(link).then((data) => {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {pointToLayer:drawCircle, onEachFeature: bindPopUp2}).addTo(myMap);

  console.log(data);
  
// Drawing the circles
function drawCircle(feature, latlng) {
    let mag = feature.properties.mag;
    let depth = feature.geometry.coordinates[2];
    return L.circle(latlng, {
            fillOpacity: 0.75,
            color: "black",
            weight: 0.25,
            fillColor: getColor(depth),
            radius: mag * 25000
    })
}

// Coloring the circles
// Getting the colors for the circles and legend based on depth
function getColor(depth) {
    return depth >= 90 ? "#FC3C0C" :
        depth >= 70 ? "#FC7C0C" :
        depth >= 50 ? "#FC9C0C" :
        depth >= 30 ? "#FCC80C" :
        depth >= 10 ? "#FCFC0C" :
                     "#5CFC0C";
}

 // Include popups that provide additional info about the earthquake when its associated marker is clicked.
 function bindPopUp2(feature, layer) {
  return layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p> Magnitude:" + feature.properties.mag + "</h3><hr><p>Depth:" + feature.geometry.coordinates[2]+ "</p>");
}

 // Set up the legend.
 let legend = L.control({ position: 'bottomright' });
 legend.onAdd = function() {
   let div = L.DomUtil.create('div', 'info legend');
   let grades = [-10, 10, 30, 50, 70, 90];
div.innerHTML = "<strong>Legend </strong><br>"
 // loop through our density intervals and generate a label with a colored square for each interval
 //from Leaflet:
 for (let i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
}

return div;
};

 // Adding the legend to the map
 legend.addTo(myMap);

});