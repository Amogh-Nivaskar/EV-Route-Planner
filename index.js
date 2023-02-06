// Initialize and add the map

const loc = {lat: 19.239229392086635, lng: 72.8391563609109};
var numDeltas = 100;
var delay = 10;
const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
var stepPoints = []
var map;
var EV;
var polyline;
const stations = [{lat: 21.024397037754834, lng: 73.16520064671518}, {lat: 22.45304931650903, lng: 73.7218414952326}, {lat: 24.027780730132566, lng: 73.9415680577326},{lat: 25.067069830570134, lng: 74.6227204014826}, {lat: 26.49159671907655, lng: 75.3478180577326}, {lat: 27.684869973344256, lng: 76.4903961827326}];
const car = "http://maps.google.com/mapfiles/ms/micons/cabs.png";
var speedInv = 10;

function initMap() {

    // const mumbai = {lat: 19.0760, lng: 72.8777}

    const markerArray = []
    
    var options = {
      center: loc,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP  

    };
   
    map = new google.maps.Map(document.getElementById("map"), options);

    var directionsService = new google.maps.DirectionsService();

    var directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map)

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


    // EV = new google.maps.Marker({
    //   position: loc,
    //   map: map,
    //   icon: car
    // });


    // Info Window
    // const detailWindow = new google.maps.InfoWindow({
    //   content: `<h3>EV</h3>`
    // });

    // EV.addListener("mouseover", () => {
    //   detailWindow.open(map, EV);
    // })

    // let p = new Promise(calcRoute => {
    //   calcRoute(directionsService, directionsRenderer, markerArray, map);
    // })

    calcRoute(directionsService, directionsRenderer, markerArray, map);
    // p.then(
    //   console.log("stepPoint is " + stepPoints)
    //   // transitionTo(EV, stepPoints[100])
    //   );
    // moveCarAlongPolyline(EV, stepPoints);
    
    
    // console.log(stepPoints)

    google.maps.event.addListener(map, 'click', (event) => {
      var clickedPos = {lat: event.latLng.lat(), lng: event.latLng.lng()};
      console.log(clickedPos);
      transitionTo(EV, clickedPos);
    })

    // for (let i=0; i<stations.length; i++){
    //   var station = new google.maps.Marker({
    //     position: stations[i],
    //     map: map,
    //     icon: image
    //   });
    // }

    // console.log(stepPoints)

}
  


function calcRoute(directionsService, directionsRenderer, markerArray, map) {

  // for (let i=0; i < markerArray.length; i++){
  //   markerArray[i].setMap(null);
  // }

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

  // directionsService.route(request, (result, status) => {
  //   if (status == google.maps.DirectionsStatus.OK){
  //     directionsRenderer.setDirections(result);
  //     // showSteps(result, markerArray, map);

  //   }else{
  //     directionsRenderer.setDirections({routes: []});
  //     map.setCenter(mumbai);
  //   }
  // })

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
        
        collectStepPointsOnPolyline(polyline);

        // EV = new google.maps.Marker({
        //   position: stepPoints[0],
        //   map: map,
        //   icon: car
        // });
        
        moveCarAlongPolyline(EV, stepPoints);

        // console.log(EV.position.lat(), EV.position.lng())
        // console.log(stepPoints[2].lat(), stepPoints[2].lng())

    }else{
      // directionsRenderer.setDirections({routes: []});
      // map.setCenter(mumbai);
      window.alert('Directions request failed due to ' + status);
    }
  })
}

var i = 0
var deltaLat
var deltaLng
// function transitionTo(marker, pos){
//   // console.log(" pos is " + pos)
//   i = 0
//   deltaLat = (pos.lat() - marker.position.lat())/numDeltas;
//   deltaLng = (pos.lng() - marker.position.lng())/numDeltas;
//   // moveMarker(deltaLat, deltaLng, 0, marker);
//   moveMarker(marker);
  
// }

function transition(marker, from, to){
  i = 0;
  deltaLat = (from.lat() - to.lat()) / numDeltas;
  deltaLng = (from.lng() - to.lat()) / numDeltas;
  moveMarker(marker, from, to);

}

// function moveMarker(deltaLat, deltaLng, steps, marker){
//   var newLat = marker.position.lat() + deltaLat;
//   var newLng = marker.position.lng() + deltaLng;
//   var latLng = new google.maps.LatLng(newLat, newLng);
//   marker.setPosition(latLng);
//   if (steps < numDeltas){
//     // setTimeout(moveMarker, delay, deltaLat, deltaLng, steps+1, marker); 
//     moveMarker(deltaLat, deltaLng, steps+1, marker);
//   }
// }

// function moveMarker(marker){
//   var newLat = marker.position.lat() + deltaLat;
//   var newLng = marker.position.lng() + deltaLng;
//   var latLng = new google.maps.LatLng(newLat, newLng);
//   marker.setPosition(latLng);
//   if (i != numDeltas){
//     i++;
//     setTimeout(moveMarker, delay)
//   }
// }

function moveMarker(marker, from, to){
  var newLat = from.lat() + deltaLat;
  var newLng = from.lng() + deltaLng;
  var latLng = new google.maps.LatLng(newLat, newLng);
  marker.setPosition(latLng);
  if (i != numDeltas){
    i++;
    setTimeout(moveMarker, delay)
  }
}

// function showSteps(directionResult, markerArray, map){
//   const route = directionResult.routes[0].legs[0];

//   for (let i=0; i < route.steps.length; i++){
      
//       var marker = new google.maps.Marker({
//         position: route.steps[i].start_point,
//         map: map,
//         icon: image
//       });
//       markerArray[i] = marker;

    
//   }
// }

function collectStepPointsOnPolyline(polyline){
  var i=1;
  var length = google.maps.geometry.spherical.computeLength(polyline.getPath());
  // console.log(console.log(length));
  var remainingDist = length;
  const step = 5
 
  // console.log(polyline.GetPointAtDistance(1000));
  addPoint(map, polyline.getPath().getAt(0))
  // console.log(polyline.getPath().getAt(0).lat)
  while (remainingDist > 0)
  {
    
    addPoint(map, polyline.GetPointAtDistance(step*i))
    // console.log(pointOnPath)
    remainingDist -= step;
    i++;
    
    
  }
  // put markers at the end
  addPoint(map, polyline.getPath().getAt(polyline.getPath().getLength()-1))
  polyline.setMap(map);
}

function addPoint(map, latlng){
    if (latlng){
      temp = new google.maps.LatLng(latlng.lat(), latlng.lng())
      // temp = {lat: latlng.lat(), lng: latlng.lng()};
      stepPoints.push(temp)
      // console.log(latlng)
      // var marker = new google.maps.Marker({
      //   position:temp,
      //   map:map,
      //   });
    }
}

var j

function myloop(){
  setTimeout(() => {
    // transitionTo(EV, stepPoints[j])

    EV.setPosition(stepPoints[j]);
    map.center = EV.position;
    
    if (j === 300){
      speedInv = 300;
    }else if (j === 320){
      speedInv = 10;
    }

    j++;
    if (j<stepPoints.length){
      myloop()
    }
  }, speedInv)
}

function moveCarAlongPolyline(){
  // console.log(stepPoints.length)
  // for (let i = 0; i < stepPoints.length; i++){
  //   var newmarker = new google.maps.Marker({
  //     position:stepPoints[i],
  //     map:map,
  //     icon: image
  //     });
    // console.log(stepPoints[i]);
    // transitionTo(marker, stepPoints[i]);

    // setTimeout(() => {
      // var newmarker = new google.maps.Marker({
      //   position:stepPoints[i],
      //   map:map,
      //   icon: image
      //   });

    //   marker.setPosition(stepPoints[i])
    // }, 10000)

    // marker.setPosition(stepPoints[i])
    

  // }
//   transitionTo(marker, stepPoints[1])
//   transitionTo(marker, stepPoints[2])

  EV = new google.maps.Marker({
    position: stepPoints[0],
    map: map,
    icon: car
  });

  j = 1
  myloop()
  
}

window.initMap = initMap;


// lat: 21.024397037754834, lng: 73.16520064671518

// lat: 22.45304931650903, lng: 73.7218414952326}

// {lat: 24.027780730132566, lng: 73.9415680577326}

// {lat: 25.067069830570134, lng: 74.6227204014826}

// lat: 26.49159671907655, lng: 75.3478180577326}

// lat: 27.684869973344256, lng: 76.4903961827326}



