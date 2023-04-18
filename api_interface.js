const baseURL = "http://localhost:8080/"

async function stationExists(stat_id){
  const data = await fetch(baseURL + "exists/" + stat_id, 
    {
        method: 'GET'
    });

    // console.log(data);
    const info = await data.json()
    return info.exists;
    
}

async function deleteStation(stat_id){
  const response = await fetch(baseURL + "delete/" + stat_id, 
  {
    method: 'DELETE'
  })

  // console.log(response);
}

async function getWaitingTime(stat_id){
    const data = await fetch(baseURL + "read/" + stat_id, 
    {
        method: 'GET'
    });

    // console.log(data);
    const info = await data.json()
    if(info.waitingTime){
        return info.waitingTime
    }else{
        return 0
    }
    
    // res.send(data);
}

async function updateWaitingTime(stat_id){
  var chargingTime = EV.getChargingTime();

  var currWaitingTime = await getWaitingTime(stat_id);

  const curr_timestamp = Date.now()/1000

  if (currWaitingTime < curr_timestamp){
    var new_waiting_time = chargingTime + curr_timestamp;
  }else{
    new_waiting_time = chargingTime + currWaitingTime;
  }

//  curr_stat.waitingTime = new_waiting_time - curr_timestamp;
 EV.waitingTime = new_waiting_time - curr_timestamp;

  const res = await fetch(baseURL + 'update/' + stat_id, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      
      waitingTime: new_waiting_time
    })
  })
}

async function addStation(station){
  
  const res = await fetch(baseURL + 'create', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: station.id,
      name: station.name,
      lat: station.lat,
      lng: station.lng,
      waitingTime: Date.now()/1000 + station.waitingTime
    })
  })
}