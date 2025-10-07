import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import ExpressBrute from 'express-brute';

// const router = express.Router

// var store = new ExpressBrute.MemoryStore();
// var bruteforce = new ExpressBrute(store);

// SignUp

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("signup")
    try {
        console.log(req.body);
        let name = req.body.name;
        let password = req.body.password;

        // Username: 3-16 chars, letters, numbers, underscores only
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        // Password: min 6 chars, at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

        if (!name || !password) {
            return res.status(400).send('Name and password are required');
        }

        if (!usernameRegex.test(name)) {
            return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send('Password must be at least 6 characters and contain at least one letter and one number');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDocument = {
            name: name,
            password: hashedPassword,
            userType: "User"
        };

        let collection = await db.collection("users");
        let result = await collection.insertOne(newDocument);

        console.log(password);
        console.log(hashedPassword);
        res.status(201).json({ message: 'User created successfully', result });
    }
    catch (error) {
        console.error("signup error:", error);  
        res.status(500).send('Internal server error');
    }
});

//login
router.post('/login', async (req, res) => {
    const user = req.body.name;
    const password = req.body.password;

    console.log(user);

    try{
    let collection = await db.collection("users");
    let result = await collection.findOne({ name: user });

    if (!result) {
        return res.status(401).send('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(password, result.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid username or password');
    }

    const token = jwt.sign({ 
        id: result._id, 
        name: result.name, 
        userType: result.userType 
    }, 'your_jwt_secret', { expiresIn: '1h' });
    
    res.status(200).json({ 
        message: 'Authentication successful', 
        token: token,
        user: { 
            id: result._id, 
            name: result.name, 
            userType: result.userType 
        }
    });
    console.log(token);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});



export default router;