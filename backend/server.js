import https from "https";
import http from 'http';
import fs from 'fs';
import users from "./routes/user.js";
import payments from "./routes/payments.js";    
import express from "express";
import cors from "cors";
import {execPath} from "process";

// Set the Port
// const express = require('express');
const PORT = 3000;
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//Test middleware
// app.use((req,res,next) => {
//     req.body.name = "Easy";
//     req.body.password = "12345";
//     next();
// });

app.use((req,res,next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();

});


app.use("/user", users);
app.route("/user", users);
app.use("/payments", payments);
app.route("/payments", payments);

// let server = https.createServer(options, app);
// console.log(PORT);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

console.log("Server is running on port", PORT);

let server = https.createServer(options, app)
// server.listen(PORT)
// console.log(PORT);
// server.listen(PORT);

