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

  

//   [


//     {
//         "business_status": "OPERATIONAL",
//         "geometry": {
//             "location": {
//                 "lat": 19.2336829,
//                 "lng": 72.85685579999999
//             },
//             "viewport": {
//                 "south": 19.2323478697085,
//                 "west": 72.85554041970849,
//                 "north": 19.2350458302915,
//                 "east": 72.8582383802915
//             }
//         },
//         "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/charging_station-71.png",
//         "icon_background_color": "#909CE1",
//         "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/charging_pinlet",
//         "name": "Bharat Petroleum Corporation ltd",
//         "opening_hours": {
//             "open_now": true
//         }  
//     }
//   ]    

// {
//     "rows": [
//         {
//             "elements": [
//                 {
//                     "distance": {
//                         "text": "0.6 km",
//                         "value": 642
//                     },
//                     "duration": {
//                         "text": "3 mins",
//                         "value": 157
//                     },
//                     "duration_in_traffic": {
//                         "text": "5 mins",
//                         "value": 276
//                     },
//                     "status": "OK"
//                 }
//             ]
//         }
//     ],
//     "originAddresses": [
//         "Borivali West Skywalk, Shanti Nagar, Borivali West, Mumbai, Maharashtra 400092, India"
//     ],
//     "destinationAddresses": [
//         "6VM4+FQC, Pai Nagar, Borivali West, Mumbai, Maharashtra 400091, India"
//     ]
// }