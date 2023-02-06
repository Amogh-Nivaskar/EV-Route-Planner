const loc = {lat: 19.239229392086635, lng: 72.8391563609109};
var map ;
var polyline;
var arr = []


function initMap() {

    // const mumbai = {lat: 19.0760, lng: 72.8777}
    
    var options = {
      center: loc,
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP  

    };
   
    map = new google.maps.Map(document.getElementById("map"), options);

    var directionsService = new google.maps.DirectionsService();

    var directionsRenderer = new google.maps.DirectionsRenderer();

    // === A method which returns a google.maps.LatLng of a point a given distance along the path ===
    // === Returns null if the path is shorter than the specified distance ===
    google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
      // some awkward special cases
      if (metres == 0) return this.getPath().getAt(0);
      if (metres < 0) return null;
      if (this.getPath().getLength() < 2) return null;
      var dist=0;
      var olddist=0;
      for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
        olddist = dist;
        dist += google.maps.geometry.spherical.computeDistanceBetween(
                  this.getPath().getAt(i),
                  this.getPath().getAt(i-1)
                );
      }
      if (dist < metres) {
        return null;
      }
      var p1= this.getPath().getAt(i-2);
      var p2= this.getPath().getAt(i-1);
      var m = (metres-olddist)/(dist-olddist);
      return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
    }

    directionsRenderer.setMap(map);

    calcRoute(directionsService, directionsRenderer, map);

    // console.log(arr)



}


function calcRoute(directionsService, directionsRenderer, map) {

  
    var request = {
      origin: loc,
      destination: "malad",
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    polyline = new google.maps.Polyline({
        path: [],
        strokeColor: '#0000FF',
        strokeWeight: 3
      });
  
    directionsService.route(request, (response, status) => {
      if (status == google.maps.DirectionsStatus.OK){
        // directionsRenderer.setDirections(result);
        
          var bounds = new google.maps.LatLngBounds();
    
          var legs = response.routes[0].legs;
          for (i = 0; i < legs.length; i++) {
            var steps = legs[i].steps;
            for (j = 0; j < steps.length; j++) {
              var nextSegment = steps[j].path;
              for (k = 0; k < nextSegment.length; k++) {
                polyline.getPath().push(nextSegment[k]);
                bounds.extend(nextSegment[k]);
              }
            }
          }
    
          polyline.setMap(map);
          
          addMarkersOnPolyline(polyline);
  
      }else{
        // directionsRenderer.setDirections({routes: []});
        // map.setCenter(mumbai);
        window.alert('Directions request failed due to ' + status);
      }
    })

    


  }


 

  function addMarkersOnPolyline(polyline){
    var i=1;
    var length = google.maps.geometry.spherical.computeLength(polyline.getPath());
    console.log(console.log(length));
    var remainingDist = length;
    const step = 10
    // console.log(polyline.GetPointAtDistance(1000));
    createMarker(map,polyline.getPath().getAt(0),length/1000+" km");
    while (remainingDist > 0)
    {

    createMarker(map, polyline.GetPointAtDistance(step*i),i+" km");
    remainingDist -= step;
    i++;
    }
    // put markers at the ends
    
    createMarker(map,polyline.getPath().getAt(polyline.getPath().getLength()-1),(length/1000).toFixed(2)+" km");
    polyline.setMap(map);
}

function createMarker(map, latlng, title){
    if (latlng){
      arr.push(latlng)
      var marker = new google.maps.Marker({
        position:latlng,
        map:map,
        title: title
        });
    }
    
}

//   google.maps.event.addDomListener(window, "load", initialize);