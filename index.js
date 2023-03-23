// Initialize and add the map

const loc = {lat: 19.239229392086635, lng: 72.8391563609109};
const loc2 = {lat: 19.244189125784448, lng: 72.8640486262227};
var numDeltas = 100;
var delay = 10;
const image = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
var stepPoints = []
var map;
var EVmarker;
var polyline;
// const stations = [{lat: 21.024397037754834, lng: 73.16520064671518}, {lat: 22.45304931650903, lng: 73.7218414952326}, {lat: 24.027780730132566, lng: 73.9415680577326},{lat: 25.067069830570134, lng: 74.6227204014826}, {lat: 26.49159671907655, lng: 75.3478180577326}, {lat: 27.684869973344256, lng: 76.4903961827326}];
const car = "http://maps.google.com/mapfiles/ms/micons/cabs.png";
var EV;
var geocoder;
var service;
const mumbai = {lat: 19.0760, lng: 72.8777}
// var speedInv = 10;

// function initMap() {

//     // const mumbai = {lat: 19.0760, lng: 72.8777}

//     const markerArray = []
    
//     var options = {
//       center: loc2,
//       zoom: 15,
//       mapTypeId: google.maps.MapTypeId.ROADMAP  

//     };
   
//     map = new google.maps.Map(document.getElementById("map"), options);

//     var directionsService = new google.maps.DirectionsService();

//     var directionsRenderer = new google.maps.DirectionsRenderer();

//     geocoder = new google.maps.Geocoder();
//     service = new google.maps.DistanceMatrixService();

//     directionsRenderer.setMap(map)

//     // === A method which returns a google.maps.LatLng of a point a given distance along the path ===
//     // === Returns null if the path is shorter than the specified distance ===
//     google.maps.Polyline.prototype.GetPointAtDistance = function(metres) {
//       // some awkward special cases
//       if (metres == 0) return this.getPath().getAt(0);
//       if (metres < 0) return null;
//       if (this.getPath().getLength() < 2) return null;
//       var dist=0;
//       var olddist=0;
//       for (var i=1; (i < this.getPath().getLength() && dist < metres); i++) {
//         olddist = dist;
//         dist += google.maps.geometry.spherical.computeDistanceBetween(
//                   this.getPath().getAt(i),
//                   this.getPath().getAt(i-1)
//                 );
//       }
//       if (dist < metres) {
//         return null;
//       }
//       var p1= this.getPath().getAt(i-2);
//       var p2= this.getPath().getAt(i-1);
//       var m = (metres-olddist)/(dist-olddist);
//       return new google.maps.LatLng( p1.lat() + (p2.lat()-p1.lat())*m, p1.lng() + (p2.lng()-p1.lng())*m);
//     }


//     // EV = new google.maps.Marker({
//     //   position: loc,
//     //   map: map,
//     //   icon: car
//     // });


//     // Info Window
//     // const detailWindow = new google.maps.InfoWindow({
//     //   content: `<h3>EV</h3>`
//     // });

//     // EV.addListener("mouseover", () => {
//     //   detailWindow.open(map, EV);
//     // })

//     // let p = new Promise(calcRoute => {
//     //   calcRoute(directionsService, directionsRenderer, markerArray, map);
//     // })

//     // calcRoute(directionsService, directionsRenderer, markerArray, map);
//     // p.then(
//     //   console.log("stepPoint is " + stepPoints)
//     //   // transitionTo(EV, stepPoints[100])
//     //   );
//     // moveCarAlongPolyline(EV, stepPoints);
    
    
//     // console.log(stepPoints)

//     // for (let i=0; i<stations.length; i++){
//     //   var station = new google.maps.Marker({
//     //     position: stations[i],
//     //     map: map,
//     //     icon: image
//     //   });
//     // }

//     // console.log(stepPoints)

// }

function initMap(){
  const map = new google.maps.Map(document.getElementById("map"), {
    center: mumbai,
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const startLoc = document.getElementById("pac-start-loc");
  const endLoc = document.getElementById("pac-end-loc");
  const startBox = new google.maps.places.SearchBox(startLoc);
  const endBox = new google.maps.places.SearchBox(endLoc);

  const start_btn = document.getElementById("start-btn");
  start_btn.addEventListener("click", () => {
    console.log("clicked");
  });

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.

  map.addListener("bounds_changed", () => {
    startBox.setBounds(map.getBounds());
  });

  map.addListener("bounds_changed", () => {
    endBox.setBounds(map.getBounds());
  });

  

  let startMarkers = [];
  let endMarkers = []
  let bounds = new google.maps.LatLngBounds();

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  startBox.addListener("places_changed", () => {
    const places = startBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    startMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    startMarkers = [];

    // For each place, get the icon, name and location.
    // const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      startMarkers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        // console.log(place.geometry.viewport);
        // console.log(place.geometry.location);
        bounds.union(place.geometry.viewport);
      } else {
        // console.log()
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });


  endBox.addListener("places_changed", () => {
    const places = endBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    endMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    endMarkers = [];

    // For each place, get the icon, name and location.
    // const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      endMarkers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        // console.log(place.geometry.viewport);
        // console.log(place.geometry.location);
        bounds.union(place.geometry.viewport);
      } else {
        // console.log()
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
  


function calcRoute(directionsService, directionsRenderer, markerArray, map) {

  // for (let i=0; i < markerArray.length; i++){
  //   markerArray[i].setMap(null);
  // }

  var request = {
    origin: loc2,
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
        
        moveCarAlongPolyline();

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

// function transition(marker, from, to){
//   i = 0;
//   deltaLat = (from.lat() - to.lat()) / numDeltas;
//   deltaLng = (from.lng() - to.lat()) / numDeltas;
//   moveMarker(marker, from, to);

// }

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

// function moveMarker(marker, from, to){
//   var newLat = from.lat() + deltaLat;
//   var newLng = from.lng() + deltaLng;
//   var latLng = new google.maps.LatLng(newLat, newLng);
//   marker.setPosition(latLng);
//   if (i != numDeltas){
//     i++;
//     setTimeout(moveMarker, delay)
//   }
// }

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

const stepDist = 5; // in meters

function collectStepPointsOnPolyline(polyline){
  var i=1;
  var length = google.maps.geometry.spherical.computeLength(polyline.getPath());
  // console.log(console.log(length));
  var remainingDist = length;
 
  // console.log(polyline.GetPointAtDistance(1000));
  addPoint(map, polyline.getPath().getAt(0))
  // console.log(polyline.getPath().getAt(0).lat)
  while (remainingDist > 0)
  {
    
    addPoint(map, polyline.GetPointAtDistance(stepDist*i))
    // console.log(pointOnPath)
    remainingDist -= stepDist;
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
const avgDist = 25  // in meters

function moveEVloop(time){
  // console.log(timed)
  setTimeout(() => {
    // transitionTo(EV, stepPoints[j])

    if (EV.currCharge <= 0){
      alert("RAN OUT OF CHARGE!!!");
      return
    }

    EVmarker.setPosition(stepPoints[j]);
    EV.updateLocation(stepPoints[j]);
    EV.discharge(stepDist, time/1000);
    // console.log(EV.currCharge)

    // console.log(EV.lat, EV.lng)

    // map.center = EVmarker.position;

    j++;
    if (j<stepPoints.length){
      
      if ( j % (avgDist/stepDist) === 0){
        console.log('take speed again')
        if (j - 1 + (avgDist/stepDist) < stepPoints.length){
          getTravelTime2(stepPoints[j-1], stepPoints[j - 1 + (avgDist/stepDist)])
            .then(newtime => moveEVloop(newtime/(avgDist/stepDist)))
        }else{
          getTravelTime2(stepPoints[j-1], stepPoints[stepPoints.length - 1])
            .then(newtime => moveEVloop(newtime/(stepPoints.length - j - 1)))
        }
        // console.log(j, time)
        
      }else{
        moveEVloop(time)
      }
    }
  }, time)
}

function moveCarAlongPolyline(){
  EVmarker = new google.maps.Marker({
    position: stepPoints[0],
    map: map,
    icon: car
  });

  EV = new EVobj(stepPoints[0], 1000, 1000)
  // console.log(stepPoints.length)
  j = 0;
  getTravelTime2(stepPoints[0], stepPoints[avgDist/stepDist])
    .then(time => {
      // console.log(time);
      moveEVloop(time/(avgDist/stepDist));
    })
  
  
}

function getTravelTime2(start, end){
  var request = {
    origins: [start],
    destinations: [end],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  return service.getDistanceMatrix(request).then(response => 
    // var dist = response.rows[0].elements[0].distance.text;
    // var dur = response.rows[0].elements[0].duration;

    // console.log("dist: " + dist + ", dur: " + dur.text);
    // console.log(dur)
    response.rows[0].elements[0].duration.value * 1000);

  // var speed = getSpeed(loc) is in kmph and stepDist is in meters
  // delay_in_ms = (stepDist/speed) * (18000/5)
}


class EVobj{
  constructor(loc, batteryCapacity, currCharge ){
      this.lat = loc.lat();
      this.lng = loc.lng();
      this.batteryCapacity = batteryCapacity;
      this.currCharge = currCharge;
      this.stateOfCharge = this.currCharge/this.batteryCapacity;
      
  }

  updateLocation(loc){
    this.lat = loc.lat();
    this.lng = loc.lng();
  }

  discharge(dist, time){
    var instaSpeed = (dist*18)/(time*5); // in kmph
    var k = 1 // const of proportionality
    var powerDischargeMap = {
      0: 0.01,
      5: 0.5,
      10: 0.1,
      15: 0.15,
      20: 0.2,
      25: 0.25,
      30: 0.3,
      35: 0.35,
      40: 0.4,
      45: 0.45,
      50: 0.5,
      55: 0.55,
      60: 0.6,
      65: 0.65,
      70: 0.7,
      75: 0.75,
      80: 0.8,
      85: 0.85,
      90: 0.9
    };
    

    var reducedSpeed = instaSpeed - (instaSpeed % 5);
    // console.log(instaSpeed, reducedSpeed);
    var powerDischarge = powerDischargeMap[reducedSpeed];
    this.currCharge -= k * powerDischarge * (dist /1000) / (time / 3600);
    this.stateOfCharge = this.currCharge/this.batteryCapacity;

    console.log("Speed: " + instaSpeed + " | State of Charge: " + this.stateOfCharge);
    
    
  }
}

// window.initMap = initMap;





