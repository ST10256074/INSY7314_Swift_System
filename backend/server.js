import https from "https";
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';
import users from "./routes/user.js";
import payments from "./routes/payments.js";    
import express from "express";
import cors from "cors";
import {execPath} from "process";

// Configure environment variables
dotenv.config();

// Set the Port
// const express = require('express');
const PORT = 8443;  
const HTTP_PORT = 8080;  
const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

//Prevent Clickjacking
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

// Configure CORS for frontend communication
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3000',
    'https://localhost:3001',
    'http://localhost:8080',
    'https://localhost:8443'
];

const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", users);
app.route("/user", users);
app.use("/payments", payments);
app.route("/payments", payments);


app.get('/', (req, res) => {
  res.send('SWIFT PAYMENT SYSTEM - Backend Server is running');
})

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
});

// Start HTTP server for development
http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`HTTP Server running on port ${HTTP_PORT}`);
});

