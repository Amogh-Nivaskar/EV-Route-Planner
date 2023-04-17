class Station{
    constructor(name, lat, lng, waitingTime){
      this.id = Station.calcStationId(lat, lng);
      this.name = name;
      this.lat = lat;
      this.lng = lng;
      this.loc = new google.maps.LatLng(this.lat, this.lng);
      this.waitingTime = waitingTime;
    }

    static calcStationId(curr_lat, curr_lng){
    
        var id = "";
        var temp = curr_lat + '|' + curr_lng;
      
        for (var i=0; i < temp.length; i++){
            if (temp[i] == '.'){
                id += ',';
            }else{
                id += temp[i];
            }
        }
      
        return id
        
      }
  }