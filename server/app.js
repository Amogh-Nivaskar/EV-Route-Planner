const express = require('express');
const app = express();
const admin = require('firebase-admin');
const credentials = require("./key.json");
const cors = require("cors");

admin.initializeApp({
    credential: admin.credential.cert(credentials)
});

const db = admin.firestore();

app.use(express.json())
// app.use(express.static('public'))
app.use(cors({
    origin: "http://localhost:5500",
}))

app.use(express.urlencoded({extended: true}));


app.post('/create', async (req, res) => {
    try{
        console.log(req.body);
        const id = req.body.id;
        const data = {
            id: req.body.id,
            name: req.body.name,
            lat: req.body.lat,
            lng: req.body.lng,
            waitingTime: req.body.waitingTime
        }

        const response = await db.collection("Stations").doc(id).set(data);

        res.send( response );
    }catch(error){
        res.send(error);
    }
    
})

app.get('/read/:id', async (req, res) => {
    try{
        const userRef = db.collection("Stations").doc(req.params.id);
        const response = await userRef.get();
        const wt = response.data().waitingTime;
        // console.log(wt);
        // if(wt){
        //     res.send(wt);
        // }else{
        //     res.send(0);
        // }
        res.send({"waitingTime": wt});
    }catch(error){
        res.send(error);    
    }
})

app.get('/exists/:id', async (req, res) => {
    try{
        const userRef = db.collection("Stations").doc(req.params.id);
        const response = await userRef.get();
        const data = response.data();
        // console.log(data);
        if(data){
            res.send({"exists" : true});
        }else{
            res.send({"exists" : false});
        }
    }catch(error){
        res.send(error);    
    }
})

app.post('/update/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const new_waiting_time = req.body.waitingTime;
        const response = await db.collection("Stations").doc(id).update({
            waitingTime: new_waiting_time
        });

        res.send(response);
    }catch(error){
        res.send(error);
    }
})

app.delete('/delete/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const response = await db.collection("Stations").doc(id).delete();
        console.log("deleted station")
        res.send(response);
    }catch(error){
        res.send(error);
    }
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}.`);
})