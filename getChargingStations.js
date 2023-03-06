var map;
var service;
var infowindow;
const stationIcon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
const loc1 = {lat: 19.239229392086635, lng: 72.8391563609109};
const loc2 = {lat: 19.244189125784448, lng: 72.8640486262227};
var maxRange = 5000;
const stationIcon2 = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/gas_station-71.png";


function initMap() {
  var borivali = new google.maps.LatLng(19.2293422, 72.8655691);
  const mumbai = new google.maps.LatLng(19.0760, 72.8777);
  
  

  map = new google.maps.Map(document.getElementById('map'), {
    center: loc1,
    zoom: 10
  });

  service = new google.maps.places.PlacesService(map);

  google.maps.event.addListener(map, 'click', (event) => {
    var clickedPos = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
    console.log(clickedPos);
    getStations(clickedPos);
  })

}

function getStations(loc){
  var request = {
    location: loc,
    radius: maxRange,
    type: ['gas_station']
  };

  service.nearbySearch(request, callback)
  
  

}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    var stations = [];
    console.log(results)
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      var loc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
      var marker = new google.maps.Marker({
      position: loc,
      map:map,
      icon: stationIcon2
      });
      // console.log(place.name + ': ' + place.geometry.location.lat() + ', ' + place.geometry.location.lng());
      stations.push({name :place.name, lat: place.geometry.location.lat(), lng: place.geometry.location.lng()});
    }
    
    // console.log(stations)
  }
}


