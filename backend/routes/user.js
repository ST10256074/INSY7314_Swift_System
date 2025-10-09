import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { scrypt, randomFill, createCipheriv, createDecipheriv } from 'crypto';
import checkAuth from "../check-auth.js";
// import ExpressBrute from 'express-brute';

// const router = express.Router

// var store = new ExpressBrute.MemoryStore();
// var bruteforce = new ExpressBrute(store);

// Encryption configuration
const ALGORITHM = 'aes-192-cbc';
const PASSWORD = process.env.ENCRYPTION_KEY || 'default-password-for-key-derivation';
const SALT = 'salt'; // In production, use a random salt per encryption
const KEY_LENGTH = 24; // 24 bytes for AES-192
const IV_LENGTH = 16; // For AES, this is always 16

// Helper function to derive key using scrypt
function deriveKey() {
    return new Promise((resolve, reject) => {
        scrypt(PASSWORD, SALT, KEY_LENGTH, (err, key) => {
            if (err) reject(err);
            else resolve(key);
        });
    });
}

// Encryption function
async function encrypt(text) {
    if (!text) return text;
    try {
        const key = await deriveKey();
        
        return new Promise((resolve, reject) => {
            randomFill(new Uint8Array(IV_LENGTH), (err, iv) => {
                if (err) {
                    reject(new Error('IV generation failed'));
                    return;
                }

                try {
                    const cipher = createCipheriv(ALGORITHM, key, iv);
                    let encrypted = cipher.update(text, 'utf8', 'hex');
                    encrypted += cipher.final('hex');
                    
                    // Return IV + encrypted data
                    resolve(Buffer.from(iv).toString('hex') + ':' + encrypted);
                } catch (error) {
                    reject(new Error('Encryption failed: ' + error.message));
                }
            });
        });
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
}

// Decryption function
async function decrypt(encryptedText) {
    if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
    try {
        const key = await deriveKey();
        const textParts = encryptedText.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedData = textParts.join(':');
        
        const decipher = createDecipheriv(ALGORITHM, key, iv);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
}

// SignUp

const router = express.Router();

router.post("/signup", async (req, res) => {
    console.log("signup")
    try {
        console.log(req.body);
        let username = req.body.username;
        let full_name = req.body.full_name;
        let accountNumber = req.body.accountNumber;
        let IDNumber = req.body.IDNumber;
        let password = req.body.password;

        // Username: 3-16 chars, letters, numbers, underscores only
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        // Password: min 6 chars, at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;
        // ID Number: 13 digits for South African ID
        const idNumberRegex = /^\d{13}$/;

        if (!username || !full_name || !accountNumber || !IDNumber || !password) {
            return res.status(400).send('All fields (username, full name, account number, ID number, password) are required');
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
        }

        if (!passwordRegex.test(password)) {
            return res.status(400).send('Password must be at least 6 characters and contain at least one letter and one number');
        }

        if (!idNumberRegex.test(IDNumber)) {
            return res.status(400).send('ID Number must be exactly 13 digits');
        }

        if (!accountNumber.trim()) {
            return res.status(400).send('Account number cannot be empty');
        }

        // Check if username already exists
        let userCollection = await db.collection("users");
        const existingUser = await userCollection.findOne({ username: username });
        
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Encrypt sensitive data before storing
        const encryptedAccountNumber = await encrypt(accountNumber);
        const encryptedIDNumber = await encrypt(IDNumber);
        const encryptedFullName = await encrypt(full_name);

        const newDocument = {
            username: username, // Username is not encrypted as it's used for login
            full_name: encryptedFullName,
            accountNumber: encryptedAccountNumber,
            IDNumber: encryptedIDNumber,
            password: hashedPassword,
            userType: "User"
        };

        let result = await userCollection.insertOne(newDocument);

        console.log(password);
        console.log(hashedPassword);
        res.status(201).json({ message: 'User created successfully', result });
    }
    catch (error) {
        console.error("signup error:", error);  
        res.status(500).send('Internal server error');
    }
});

// Get current user's account info
router.get('/profile', checkAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        if (!userId) {
            return res.status(401).json({ message: 'User ID required' });
        }

        let userCollection = await db.collection("users");
        let user = await userCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Decrypt sensitive data for response
        const decryptedFullName = await decrypt(user.full_name);
        const decryptedAccountNumber = await decrypt(user.accountNumber);
        const decryptedIDNumber = await decrypt(user.IDNumber);

        res.status(200).json({
            message: 'User profile retrieved successfully',
            user: {
                id: user._id,
                username: user.username,
                full_name: decryptedFullName,
                accountNumber: decryptedAccountNumber,
                IDNumber: decryptedIDNumber,
                userType: user.userType
            }
        });

    } catch (error) {
        console.error("Profile retrieval error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//login
router.post('/login', async (req, res) => {
    const user = req.body.name;
    const password = req.body.password;

    console.log(user);

    try{
    let userCollection = await db.collection("users");
    let result = await userCollection.findOne({ username: user });

    if (!result) {
        return res.status(401).send('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(password, result.password);

    if (!isPasswordValid) {
        return res.status(401).send('Invalid username or password');
    }

    // Decrypt sensitive data for response
    const decryptedFullName = await decrypt(result.full_name);

    const token = jwt.sign({ 
        id: result._id, 
        username: result.username,
        full_name: decryptedFullName,
        userType: result.userType 
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
        message: 'Authentication successful', 
        token: token,
        user: { 
            id: result._id, 
            username: result.username,
            full_name: decryptedFullName,
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