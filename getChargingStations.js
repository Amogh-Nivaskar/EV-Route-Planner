var map;
var service;
var infowindow;
const stationIcon = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
var loc1 ;
var loc3;
var loc4;
var loc5;
var loc2; 
var sfit;
var bandra;
var maxRange;
var EVCap = 2500;
const stationIcon2 = "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/gas_station-71.png";
var minHeap;
var hashMap;
var dist;
var clickedPos;
var distMatrix;
var index;
var stations;
const DUR = 0;
const STAT = 1;
var visited;
var currStation;
var endStation;
var REACHED = false;
var LIMIT_EXCEEDED = false;
const LIMIT = 50;
var route = [];
var pathComputed = false;
const status_p = document.getElementById("status-p");

var customStationIcon;
var customEVIcon;
var mapp;
var computedStationsSet;

var dirService;
var directionsService;
var stepPoints = []



function initMap() {
  var borivali = new google.maps.LatLng(19.2293422, 72.8655691);
  const mumbai = new google.maps.LatLng(19.0760, 72.8777);
  const delhi = new google.maps.LatLng(28.7041, 77.1025);
  const malad = new google.maps.LatLng(19.1874, 72.8484);
  loc1 = new google.maps.LatLng(19.239229392086635, 72.8391563609109);
  loc2 = new google.maps.LatLng(19.244131974240652, 72.86437085161302)
  loc3 = new google.maps.LatLng(19.24003073124932, 72.83953421692038);
  loc4 = new google.maps.LatLng(19.240089394058824, 72.8401520629673);
  loc5 = new google.maps.LatLng(19.257765421690397, 72.86271064884816);
  sfit = new google.maps.LatLng(19.244183337429792, 72.85576180006889);
  bandra = new google.maps.LatLng(19.068573185470793, 72.84200154695927)
  
   

  // startStation = new Station("Start Station", sfit.lat(), sfit.lng());
  // dist.set(startStation, 0);
  // parentMap.set(startStation, null);
  // endStation = new Station("End Station", bandra.lat(), bandra.lng());
  // dist.set(endStation, Infinity);

  // startStation = new Station("Start Station", loc3.lat(), loc3.lng());
  // dist.set(startStation, 0);
  // parentMap.set(startStation, null);
  // endStation = new Station("End Station", loc5.lat(), loc5.lng());
  // dist.set(endStation, Infinity);

  var customStyle = [
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [
        { color: '#0000ff' }
      ]
    },
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [
        { visibility: 'on' }
      ]
    }
  ];

  customStationIcon =  {
    url: "icons/charging-station2.png",
    scaledSize: new google.maps.Size(30, 30), // size of your image
    origin: new google.maps.Point(0, 0), // origin point of your image
    anchor: new google.maps.Point(25, 50) // anchor point of your image (bottom center)
  };

  customEVIcon = {
    url: "icons/EV.png",
    scaledSize: new google.maps.Size(50, 50), // size of your image
    origin: new google.maps.Point(0, 0), // origin point of your image
    anchor: new google.maps.Point(25, 50) // anchor point of your image (bottom center)
  };
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: mumbai,
    zoom: 10,
  });

  const startLoc = document.getElementById("pac-start-loc");
  const endLoc = document.getElementById("pac-end-loc");
  const startBox = new google.maps.places.SearchBox(startLoc);
  const endBox = new google.maps.places.SearchBox(endLoc);
  


  map.addListener("bounds_changed", () => {
    startBox.setBounds(map.getBounds());
  });

  map.addListener("bounds_changed", () => {
    endBox.setBounds(map.getBounds());
  });

  

  let startMarkers = [];
  let endMarkers = []
  let bounds = new google.maps.LatLngBounds();
  var startLatLng;
  var endLatLng;

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

      // const icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25),
      // };

      // Create a marker for each place.
      startLatLng = place.geometry.location
      startMarkers.push(
        new google.maps.Marker({
          map,
          title: place.name,
          label: "S",
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

      // const icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25),
      // };

      endLatLng = place.geometry.location;
      // Create a marker for each place.
      endMarkers.push(
        new google.maps.Marker({
          map,
          label: "E",
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

  

  

  service = new google.maps.places.PlacesService(map);

  // distMatrix = new google.maps.DistanceMatrixService();

  // google.maps.event.addListener(map, 'click', (event) => {
  //   clickedPos = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
  //   console.log(clickedPos.lat(), clickedPos.lng());
  //   var marker = new google.maps.Marker({
  //     position: clickedPos,
  //     map:map,
  //     });
  // })

  // var marker = new google.maps.Marker({
  //   position: loc3,
  //   map:map,
  //   });

  // var marker = new google.maps.Marker({
  //   position: loc5,
  //   map:map,
  //   });

  
  directionsService = new google.maps.DirectionsService();

  var directionsRenderer = new google.maps.DirectionsRenderer();

  geocoder = new google.maps.Geocoder();
  dirService = new google.maps.DistanceMatrixService();

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

  const start_btn = document.getElementById("start-btn");
  start_btn.addEventListener("click", () => {

    if (startLatLng == null || endLatLng == null){
      alert("Enter both Start and End Locations");
    }else{
      minHeap = new MinHeap();
      parentMap = new Map();
      dist = new Map();
      visited = new Set();
      mapp = new Map()
      

      startStation = new Station("Start Station", startLatLng.lat(), startLatLng.lng());
      dist.set(startStation, 0);
      parentMap.set(startStation, null);
      mapp.set(startStation, []);
      endStation = new Station("End Station", endLatLng.lat(), endLatLng.lng());
      dist.set(endStation, Infinity);
      EV = new EVobj(startLatLng, EVCap, EVCap);
      maxRange = EV.maxRange;

      console.log(startStation);
      console.log(endStation);
      status_p.style.color = "yellow";
      status_p.innerText = "Loading Path ...";
      getShortestPath(startStation, endStation);
      
    }

  
    
  });

  const sim_btn = document.getElementById("sim-btn");
  sim_btn.addEventListener("click", () => {
    if (pathComputed == true){

      moveCarAlongPolyline(stepPoints);
    }else{
      alert("Compute path first");
    }
  })
  
  

}

function getShortestPath(startStation, endStation){
  currStation = startStation;
  visited.add(currStation.name)

  getStationsWithinMaxRange(currStation);
  
}

function getAvgSpeed(station1, station2){
  var request = {
    origins: [station1.loc],
    destinations: [station2.loc],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  return dirService.getDistanceMatrix(request).then((response, status) => {
    var obj = {dist: response.rows[0].elements[0].distance.value , dur: response.rows[0].elements[0].duration.value}
    return obj
  }
     );
    
}

function getStationsWithinMaxRange(station){
  console.log("in get stations")
  var request = {
    location: station.loc,
    radius: maxRange,
    type: ['gas_station']
  };
  service.nearbySearch(request, extractStations);
}

function isReachable(station){
  return getAvgSpeed(currStation, station)
            .then(result => {
        
              var instaSpeed = (result.dist * 18) / (result.dur * 5)
              var reducedSpeed = instaSpeed - (instaSpeed % 5);
              var powerDischargeMap = {
                0: 0.1,
                5: 5,
                10: 10,
                15: 15,
                20: 20,
                25: 25,
                30: 30,
                35: 35,
                40: 40,
                45: 45,
                50: 50,
                55: 55,
                60: 60,
                65: 65,
                70: 70,
                75: 75,
                80: 80,
                85: 85,
                90: 90
              };

              var powerDischarge = EV.k * powerDischargeMap[reducedSpeed] * (result.dur / 3600) ;
              if (station == endStation){
                if (powerDischarge <= EV.batteryCapacity){
                  return {canReach: true, dst: station};
          
                }
              }else{
                if (powerDischarge <= EV.batteryCapacity - 50){
                  return {canReach: true, dst: station};
          
                }
              }
              return {canReach: false, dst: station};

            
            })
            .catch(err => console.log("error is " + err))
}

function extractStations(results, status) {
  console.log("in extract stations")
  console.log(results, status);
  
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
    stations = [];
    var promises = []
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      var tempStat = new Station(place.name, place.geometry.location.lat(), place.geometry.location.lng())
    
      if (!visited.has(place.name) ){

        var promise = new Promise( (resolve, reject) =>{ 
          isReachable(tempStat)
          .then(res => {
            if (res.canReach == true){
              console.log("can reach")
              stations.push(res.dst);
            }else{
              console.log("cant reach")
            
            }
            resolve()
        });
        
      });
  
      promises.push(promise)
        
      }
      
    }

    Promise.all(promises)
      .then(() => {
    
    console.log(stations)

    console.log("in get dist")
    isReachable(endStation)
      .then((res) => {
        console.log("in end dst reachable?")
        if (res.canReach == true ){
          if (getHaversineDist(currStation.loc, endStation.loc) <= maxRange){
            stations.push(endStation)
          }
          
        }

        console.log(stations);
        if (stations.length == 0){
          console.log("--------NO STATIONS---------")
        }else{
          index = 0;
          console.log("entering loop")
          loopOverStations(currStation);
        }
      })
        
  })

  }else{
    alert("Can't Reach Destination");
    status_p.style.color = 'red';
    status_p.innerText = "Can't Reach Destination !!!";
    
  }
}

var tstat;

function loopOverStations(srcStation){
  
  getTravelTime(srcStation.loc, stations[index])
    .then(time => {
      if (dist.has(stations[index])){
        if (dist.get(srcStation) + time/60 < dist.get(stations[index])){
          
          dist.set(stations[index], dist.get(srcStation) + time/60);
          parentMap.set(stations[index], srcStation);
          if (stations[index] === endStation){
            console.log("end stat 1")
          }
        }
      }else{
        dist.set(stations[index], dist.get(srcStation) + time/60);
        parentMap.set(stations[index], srcStation);
        if (stations[index] === endStation){
          console.log("end stat 2")
        }
      }
      var val = dist.get(stations[index]) + getHaversineDist(endStation.loc, stations[index].loc);
      minHeap.heappush(val, stations[index]);
      index += 1;
      if(index < stations.length){
        loopOverStations(srcStation);
      }else{
        console.log("in else")
        if (REACHED === false && LIMIT_EXCEEDED === false && minHeap.length() > 0){
          var dur;
          currStation; 
          [dur, currStation] = minHeap.heappop();
          visited.add(currStation.name);

          if (currStation === endStation){
            console.log(parentMap);
            console.log("------REACHED DESTINATION------");
            REACHED = true;
            route = getRoute();

            console.log(route);

            var promises = [];
            for (var i=0; i < route.length; i++){
              if (i != 0 && i != route.length - 1){
                var marker = new google.maps.Marker({
                  position: route[i].loc,
                  map:map,
                  // label: i.toString(),
                  icon:customStationIcon
                  });
              }
              
              
              if (i + 1 < route.length){
                var promise = new Promise(function(resolve, reject) {
                  tstat = route[i+1]
                  calcRoute(directionsService, map, route[i], route[i+1], function(polyline, endstat) {
                      collectStepPointsOnPolyline(polyline, endstat);
                      resolve();
                  });
              });
              promises.push(promise);
              }
            }

            Promise.all(promises).then(function() {

              console.log(mapp)

              for (var i=0; i < route.length; i++){
                
                mapp.get(route[i]).forEach((loc) =>{
                    stepPoints.push(loc);
                })
              }

              console.log(stepPoints);
              pathComputed = true;
              status_p.style.color = "#00FF00";
              status_p.innerText = "Path Computed !!!";
              

          });

          return;
          }

          if (visited.size > LIMIT){
            console.log("----NOT REACHABLE----")
            LIMIT_EXCEEDED = true;
            return;
          }
          console.log("in else in if")
          getStationsWithinMaxRange(currStation);
        }else{
          console.log("------NOT REACHABLE 2------")
        }
      
      }
      
    })
}

function getRoute(){
  console.log("in get route")
  curr = endStation;
  var route = [];
  while (curr !== null){
    route.push(curr);
    curr = parentMap.get(curr);
  }
  return route.reverse()
}

function getTravelTime(start, end){
  var request = {
    origins: [start],
    destinations: [end],
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.METRIC,
    avoidHighways: false,
    avoidTolls: false,
  };

  return dirService.getDistanceMatrix(request).then(response => 
    response.rows[0].elements[0].duration.value );
}


function getHaversineDist(loc1, loc2){
  var lat1 = loc1.lat();
  var lon1 = loc1.lng();
  var lat2 = loc2.lat();
  var lon2 = loc2.lng();
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d * 1000; // in meters
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


class MinHeap{
  constructor(){
    this.h = [];
  }

  heappush(val, station){
    this.h.push([val, station]);

    var curr = this.h.length - 1;

    while (curr > 0){
      var parent = Math.floor((curr - 1) / 2);

      if (this.h[curr][DUR] < this.h[parent][DUR]){
        [this.h[curr], this.h[parent]] = [this.h[parent], this.h[curr]];

        curr = parent;
      }else{
        break;
      }
    }
  }

  heappop(){
    [this.h[0], this.h[this.h.length - 1]] = [this.h[this.h.length - 1], this.h[0]];
    var val;
    var station;
    [val, station] = this.h.pop();
    

    var index = 0;

    var leftIndex = 2 * index + 1;
    var rightIndex = 2 * index + 2;

    while (leftIndex < this.h.length){
      var minIndex = index;

      if (this.h[leftIndex][DUR] < this.h[minIndex][DUR]){
        minIndex = leftIndex;
      }
      
      if (rightIndex < this.h.length && this.h[rightIndex][DUR] < this.h[minIndex][DUR]){
        minIndex = rightIndex;
      }

      if (minIndex === index){
        break;
      }

      [this.h[index], this.h[minIndex]] = [this.h[minIndex], this.h[index]];

      index = minIndex;
      leftIndex = 2 * index + 1;
      rightIndex = 2 * index + 2;
    }

    return [val, station];
  }

  length(){
    return this.h.length;
  }
}

class Station{
  constructor(name, lat, lng){
    this.name = name;
    this.lat = lat;
    this.lng = lng;
    this.loc = new google.maps.LatLng(this.lat, this.lng);
  }
}


var colourIndex = -1


var delay = 0
function calcRoute(directionsService, map, startstat, endstat, callback) {
  
  var colours = ['red', 'blue', 'green', 'purple', 'black']
  colourIndex += 1
  delay += 1

  var request = {
    origin: startstat.loc,
    destination: endstat.loc,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }
  //colours[colourIndex % colours.length]
  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: "blue",
    strokeWeight: 4
  });


  directionsService.route(request, (response, status) => {
    if (status == google.maps.DirectionsStatus.OK){
      
      
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
        
        callback(polyline, endstat);

        return polyline


    }else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
      setTimeout(() => {
        calcRoute(directionsService, map, startstat, endstat, callback);  
      }, 1000)
    }
    else{
      console.log(startstat, endstat)
      window.alert('Directions request failed due to ' + status);
    }
  })
}


const stepDist = 5; // in meters

function collectStepPointsOnPolyline(polyline, endstat){

  mapp.set(endstat, [])
  var i=1;
  var length = google.maps.geometry.spherical.computeLength(polyline.getPath());
  
  var remainingDist = length;
 

  addPoint(map, polyline.getPath().getAt(0), endstat)

  while (remainingDist > 0)
  {
    addPoint(map, polyline.GetPointAtDistance(stepDist*i), endstat)
    
    remainingDist -= stepDist;
    i++;
  }
  // put markers at the end
  addPoint(map, polyline.getPath().getAt(polyline.getPath().getLength()-1), endstat)
  polyline.setMap(map);
}


function addPoint(map, latlng, endstat){
    if (latlng){
      temp = new google.maps.LatLng(latlng.lat(), latlng.lng())
      
      mapp.get(endstat).push(temp);
      // console.log(latlng)
      // var marker = new google.maps.Marker({
      //   position:temp,
      //   map:map,
      //   label: si.toString()
      //   });

    }
}
