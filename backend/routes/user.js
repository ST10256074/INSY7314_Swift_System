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

        if (!name || !password) {
            return res.status(400).send('Name and password are required');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newDocument = {
            name: name,
            password: hashedPassword
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

    const token = jwt.sign({ id: result._id, name: result.name }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ id: result._id, name: result.name });
    res.status(200).json({ message: 'Authentication successful', token });
    console.log(token);
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});



export default router;

