

mapboxgl.accessToken = mapToken;
console.log('map token:',mapToken);
console.log('listing data:', listing);


if (!listing.geometry.coordinates || listing.geometry.coordinates.length !== 2) {
    console.log("invalid cordinates" ,listing.geometry.coordinates);
    alert('coordinates not available for this listing');
} else{
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style : "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 8 // starting zoom
});

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color:'red'})
.setLngLat(listing.geometry.coordinates)  //listing.geometry.coordinates
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(
    `<h4>${listing.title}</h4><p>Exact Location will be provided after booking!</p>
    `
)
)
.addTo(map);
}
