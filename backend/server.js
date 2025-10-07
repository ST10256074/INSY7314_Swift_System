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
const PORT = 8443;  
const HTTP_PORT = 8080;  
const app = express();

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

// Configure CORS for frontend communication
app.use(cors({
    origin: ['http://localhost:3000', 'https://localhost:3000'], // React dev server
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Test middleware
// app.use((req,res,next) => {
//     req.body.name = "Easy";
//     req.body.password = "12345";
//     next();
// });

//Force HTTPS use
app.use((req, res, next) => {
    if (req.protocol !== 'https') {
        return res.redirect('https://' + req.headers.host + req.url);
    }
    next();
});

// app.use((req,res,next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "*");
//     res.header("Access-Control-Allow-Methods", "*");
//     next();

// });


app.use("/user", users);
app.route("/user", users);
app.use("/payments", payments);
app.route("/payments", payments);

// let server = https.createServer(options, app);
// console.log(PORT);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});

// Optional: Start HTTP server to redirect to HTTPS
http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers.host.replace(`:${HTTP_PORT}`, `:${PORT}`) + req.url });
    res.end();
}).listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT} and redirecting to HTTPS`);
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// console.log("Server is running on port", PORT);

// let server = https.createServer(options, app)
// server.listen(PORT)
// console.log(PORT);
// server.listen(PORT);

