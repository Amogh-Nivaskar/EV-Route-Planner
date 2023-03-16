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
var maxRange = 2500;
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
const LIMIT = 100;
var route = [];

// var route = [
//   {
//       "name": "Start Station",
//       "lat": 19.244183337429792,
//       "lng": 72.85576180006889,
//       "loc": {
//           "lat": 19.244183337429792,
//           "lng": 72.85576180006889
//       }
//   },
//   {
//       "name": "PUC",
//       "lat": 19.2334366,
//       "lng": 72.8569435,
//       "loc": {
//           "lat": 19.2334366,
//           "lng": 72.8569435
//       }
//   },
//   {
//       "name": "Indian oil petrol diesel & CNG",
//       "lat": 19.21589519999999,
//       "lng": 72.8510896,
//       "loc": {
//           "lat": 19.21589519999999,
//           "lng": 72.8510896
//       }
//   },
//   {
//       "name": "Gas Station",
//       "lat": 19.1955535,
//       "lng": 72.8470889,
//       "loc": {
//           "lat": 19.1955535,
//           "lng": 72.8470889
//       }
//   },
//   {
//       "name": "Petrol Pump",
//       "lat": 19.178655,
//       "lng": 72.8461804,
//       "loc": {
//           "lat": 19.178655,
//           "lng": 72.8461804
//       }
//   },
//   {
//       "name": "Hindustan Petroleum Petrol Pump",
//       "lat": 19.161513,
//       "lng": 72.85751909999999,
//       "loc": {
//           "lat": 19.161513,
//           "lng": 72.85751909999999
//       }
//   },
//   {
//       "name": "Super Gas Point",
//       "lat": 19.1549781,
//       "lng": 72.8355952,
//       "loc": {
//           "lat": 19.1549781,
//           "lng": 72.8355952
//       }
//   },
//   {
//       "name": "Hindustan Petroleum - Jogeshwari West",
//       "lat": 19.142671,
//       "lng": 72.8426391,
//       "loc": {
//           "lat": 19.142671,
//           "lng": 72.8426391
//       }
//   },
//   {
//       "name": "HP Petrol Pump",
//       "lat": 19.1279972,
//       "lng": 72.8321715,
//       "loc": {
//           "lat": 19.1279972,
//           "lng": 72.8321715
//       }
//   },
//   {
//       "name": "Lachmandas Service Station HP Petrol Pump",
//       "lat": 19.1078953,
//       "lng": 72.8401239,
//       "loc": {
//           "lat": 19.1078953,
//           "lng": 72.8401239
//       }
//   },
//   {
//       "name": "Bharat Petroleum Corporation ltd",
//       "lat": 19.0882759,
//       "lng": 72.8379808,
//       "loc": {
//           "lat": 19.0882759,
//           "lng": 72.8379808
//       }
//   },
//   {
//       "name": "End Station",
//       "lat": 19.068573185470793,
//       "lng": 72.84200154695927,
//       "loc": {
//           "lat": 19.068573185470793,
//           "lng": 72.84200154695927
//       }
//   }
// ]

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
  
  minHeap = new MinHeap();
  parentMap = new Map();
  dist = new Map();
  visited = new Set();  

  startStation = new Station("Start Station", sfit.lat(), sfit.lng());
  dist.set(startStation, 0);
  parentMap.set(startStation, null);
  endStation = new Station("End Station", bandra.lat(), bandra.lng());
  dist.set(endStation, Infinity);

  // startStation = new Station("Start Station", loc3.lat(), loc3.lng());
  // dist.set(startStation, 0);
  // parentMap.set(startStation, null);
  // endStation = new Station("End Station", loc5.lat(), loc5.lng());
  // dist.set(endStation, Infinity);

  map = new google.maps.Map(document.getElementById('map'), {
    center: sfit,
    zoom: 15
  });

  service = new google.maps.places.PlacesService(map);

  distMatrix = new google.maps.DistanceMatrixService();

  // google.maps.event.addListener(map, 'click', (event) => {
  //   clickedPos = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
  //   console.log(clickedPos.lat(), clickedPos.lng());
  //   var marker = new google.maps.Marker({
  //     position: clickedPos,
  //     map:map,
  //     });
  // })

  var marker = new google.maps.Marker({
    position: sfit,
    map:map,
    });

  var marker = new google.maps.Marker({
    position: bandra,
    map:map,
    });

  
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

  // polyline = new google.maps.Polyline({
  //   path: [],
  //   strokeColor: 'blue',
  //   strokeWeight: 3
  // });

  // for (var i=0; i < route.length; i++){
  //   var marker = new google.maps.Marker({
  //     position: route[i].loc,
  //     map:map,
  //     label: i.toString(),
  //     icon:stationIcon
  //     });
    
  //   if (i + 1 < route.length){
  //     calcRoute(directionsService, map, route[i].loc, route[i+1].loc);
  //   }
  // }

  
  getShortestPath(startStation, endStation);

}

function getShortestPath(startStation, endStation){
  currStation = startStation;
  visited.add(currStation.name)

  getStationsWithinMaxRange(currStation);
  
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

function extractStations(results, status) {
  console.log("in extract stations")
  
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
    stations = [];
    
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      if (!visited.has(place.name)){
        
        stations.push(new Station(place.name, place.geometry.location.lat(), place.geometry.location.lng()));
      }
      
    }

    if (getHaversineDist(currStation.loc, endStation.loc) <= maxRange){
      stations.push(endStation)
    }
    
    console.log(stations);
    if (stations.length === 0){
      console.log("--------NO STATIONS---------")
    }else{
      index = 0;
      loopOverStations(currStation);
    }
    

  }
}

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

            for (var i=0; i < route.length; i++){
              var marker = new google.maps.Marker({
                position: route[i].loc,
                map:map,
                label: i.toString(),
                icon:stationIcon
                });
              
              if (i + 1 < route.length){
                calcRoute(directionsService, map, route[i].loc, route[i+1].loc);
              }
            }
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

  return distMatrix.getDistanceMatrix(request).then(response => 
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
function calcRoute(directionsService, map, startLoc, endLoc) {

  var colours = ['red', 'blue', 'green', 'purple', 'black']
  colourIndex += 1
  delay += 1

  var request = {
    origin: startLoc,
    destination: endLoc,
    travelMode: google.maps.TravelMode.DRIVING,
    unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  var polyline = new google.maps.Polyline({
    path: [],
    strokeColor: colours[colourIndex % colours.length],
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
        
        collectStepPointsOnPolyline(polyline);

        // EV = new google.maps.Marker({
        //   position: stepPoints[0],
        //   map: map,
        //   icon: car
        // });
        
        // moveCarAlongPolyline(EVmarker, stepPoints);

        // console.log(EV.position.lat(), EV.position.lng())
        // console.log(stepPoints[2].lat(), stepPoints[2].lng())

    }else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT) {
      setTimeout(() => {
        calcRoute(directionsService, map, startLoc, endLoc);  
      }, 1000)
    }
    else{
      // directionsRenderer.setDirections({routes: []});
      // map.setCenter(mumbai);
      console.log(startLoc, endLoc)
      window.alert('Directions request failed due to ' + status);
    }
  })
}


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
      var marker = new google.maps.Marker({
        position:temp,
        map:map,
        });
    }
}
