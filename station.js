```
When the program gets executed, station objects will be created locally, by fetching data from the database
These objs will be manipulated internally.
```

class Station {
    constructor(stationid, lat, lng, numOfPorts){
        this.stationid = stationid;
        this.lat = lat;
        this.lng = lng;
        this.numOfPorts = numOfPorts;
        
    }

}