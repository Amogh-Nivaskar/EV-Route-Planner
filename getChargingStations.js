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

  // console.log(dist);

    

  // console.log("start min heap testing");
  // minHeap.heappush(10, 's1');
  // minHeap.heappush(9, 's2');
  // minHeap.heappush(8, 's3');
  // minHeap.heappush(1, 's4');
  // minHeap.heappush(0, 's5');

  // console.log(minHeap.h)

  // while (minHeap.length() > 0){
  //   var temp = minHeap.heappop();
  //   console.log(temp)
  // }


  // var d = getHaversineDist(mumbai, delhi);
  // console.log(d);
  
  
  getShortestPath(startStation, endStation)

}

function getShortestPath(startStation, endStation){
  currStation = startStation;
  visited.add(currStation.name)

  getStationsWithinMaxRange(currStation);
  // console.log(REACHED)
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
  // console.log(status);
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // console.log("in extract stations, status == OK")
    stations = [];
    // console.log(results)
    // console.log(clickedPos);
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      if (!visited.has(place.name)){
        var loc = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng())
        // var marker = new google.maps.Marker({
        // position: loc,
        // map:map,
        // icon: stationIcon2
        // });
        // console.log(place.name + ': ' + place.geometry.location.lat() + ', ' + place.geometry.location.lng());
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
      loop(currStation);
    }
    
    
    // console.log(station.name)

    // getTravelTime(clickedPos, stations[0])
    //   .then(time => {
    //     console.log(time/60)
    //   })

  }
}

function loop(srcStation){
  // console.log('in loop')
  getTravelTime(srcStation.loc, stations[index])
    .then(time => {
      // console.log(index)
      // if (stations[index] === endStation){
      //   console.log("end stat found")
      // }
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
        loop(srcStation);
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
                icon:stationIcon
                });
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
    // var dist = response.rows[0].elements[0].distance.text;
    // var dur = response.rows[0].elements[0].duration;

    // console.log("dist: " + dist + ", dur: " + dur.text);
    // console.log(dur)
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
    // var val = temp[DUR]

    var index = 0;

    var leftIndex = 2 * index + 1;
    var rightIndex = 2 * index + 2;

    while (leftIndex < this.h.length){
      var minIndex = index;

      if (this.h[leftIndex][DUR] < this.h[minIndex][DUR]){
        minIndex = leftIndex;
      }
      // console.log(this.h[rightIndex]);
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

