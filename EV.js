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
        this.atStation = false;
        this.waitingTime = 0;
        this.chargingRate = 5;
        
        
    }
  
    updateLocation(loc){
        this.loc = loc;
        this.lat = loc.lat();
        this.lng = loc.lng();
    }
  
    discharge(dist, time){
      var instaSpeed = (dist*18)/(time*5); // in kmph
      // var k = 1 // const of proportionality

  
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
      if (time != Infinity){
        this.currCharge -= this.k * powerDischarge * (time / 3600) * 500; 
      }
        
      
      this.stateOfCharge = this.currCharge/this.batteryCapacity;
  
      console.log("Speed: " + instaSpeed + " | SOC: " + this.stateOfCharge + " | time: " + time/1000);

      display_details.innerHTML = `Speed: ${instaSpeed.toFixed(2)} kmph  <br>  Charge Percentage: ${(this.stateOfCharge * 100).toFixed(2)}%`;
      
      
    }
  
    getChargingTime(){
      // 1% unit per 5 secs
      var perc_completed = parseInt((this.stateOfCharge * 100).toFixed(2));
      
      var time = (100 - perc_completed) * this.chargingRate;
      console.log(time)
      return time

    }
  }