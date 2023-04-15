  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";

// // const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
// // const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
  import {getDatabase, set, get, update, remove, ref, child} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration

var trying = 500;

  const firebaseConfig = {
    apiKey: "AIzaSyBU5j8j4nj7pVgjWudrXEuF5_MGtcCAHhE",
    authDomain: "ev-route-planner-e5faf.firebaseapp.com",
    databaseURL: "https://ev-route-planner-e5faf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "ev-route-planner-e5faf",
    storageBucket: "ev-route-planner-e5faf.appspot.com",
    messagingSenderId: "832520156313",
    appId: "1:832520156313:web:e755b9d04b0e0542867408"
  };



  // Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();
// const db = getFirestore();

// const stations_collection = db.collection('stations_collection');

const dbref = ref(db);

function insertStation(station){
    set(ref(db, "Stations/" + station.id),{
        id: station.id,
        Place: station.place,
        lat: station.lat,
        lng: station.lng,
        waitingTime: station.waitingTime
    })
    .then(() => {
        alert("Station Data entered succesfully");
    })
    .catch((error) => {
        alert(error);
    })
}

function calcStationId(curr_lat, curr_lng){
    
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

async function getWaitingTime(station_id){
   
    var wt = await get(child(dbref, "Stations/" + station_id))
        .then((snapshot) => {
            if (snapshot.exists()){
                // console.log(snapshot.val().waitingTime);
                return snapshot.val().waitingTime;
            }else{
                return 0
            }
        })
        .catch((error) => {
            alert(error);
        })

    return wt
    
}

function updateWaitingTime(station_id, newWaitingTime){
    update(ref(db,  "Stations/" + station_id), {waitingTime: newWaitingTime})
        .then(() => {
            alert("Waiting time updated succesfully")
        })
        .catch((error) => {
            alert(error);
        })

}


// var latt = 99.01;
// var lngg = 98.76;


// var station = {id:"99,01|98,76", place: "Shantivan", lat: latt, lng: lngg, waitingTime: 4};

// const recharge_btn = document.getElementById("recharge-btn");

// recharge_btn.addEventListener("click", () => {
// // insertStation(station);
//     getWaitingTime("99,01|98,7")
//     .then((wt) => console.log(wt))
    
    
// })
