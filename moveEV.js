var j
const avgDist = 25  // in meters
const car = "http://maps.google.com/mapfiles/ms/micons/cabs.png";
var EV;
var EVmarker;


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

function moveCarAlongPolyline(stepPoints){
  EVmarker = new google.maps.Marker({
    position: stepPoints[0],
    map: map,
    icon: customEVIcon
  });

  console.log(stepPoints)

  // EV = new EVobj(stepPoints[0], 1000, 1000)
  console.log(stepPoints.length)
  j = 0;
  getTravelTime2(stepPoints[j], stepPoints[avgDist/stepDist])
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

  return dirService.getDistanceMatrix(request).then(response => 
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
      this.loc = loc;
      this.lat = loc.lat();
      this.lng = loc.lng();
      this.batteryCapacity = batteryCapacity;
      this.currCharge = currCharge;
      this.stateOfCharge = this.currCharge/this.batteryCapacity;
      this.k = 1; // const of proportionality
      this.maxRange = this.k * this.batteryCapacity;
      
      
  }

  updateLocation(loc){
    this.lat = loc.lat();
    this.lng = loc.lng();
  }

  discharge(dist, time){
    var instaSpeed = (dist*18)/(time*5); // in kmph
    // var k = 1 // const of proportionality

    // Energy discharged at a particular speed per km
    // Energy discharged at a particular speed per hour
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
    

    var reducedSpeed = instaSpeed - (instaSpeed % 5);
    // console.log(instaSpeed, reducedSpeed);
    var powerDischarge = powerDischargeMap[reducedSpeed];
    // this.currCharge -= k * powerDischarge * (dist /1000) / (time / 3600);
    this.currCharge -= this.k * powerDischarge * (time / 3600);   
    this.stateOfCharge = this.currCharge/this.batteryCapacity;

    console.log("Speed: " + instaSpeed + " | State of Charge: " + this.stateOfCharge);
    
    
  }
}