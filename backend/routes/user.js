import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import checkAuth from "../check-auth.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const router = express.Router();

/**
 * User registration endpoint
 * Validates input data, encrypts sensitive information, and creates new user account
 * POST /user/signup
 */
router.post("/signup", async (req, res) => {
    try {

                // Whitelist allowed fields
        const allowedFields = ["username", "full_name", "accountNumber", "IDNumber", "password"];
        Object.keys(req.body).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete req.body[key];
            }
        });

        // Regex patterns for input validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;
        const accountNumberRegex = /^\d{6,20}$/;
        const idNumberRegex = /^\d{13}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;


        let username = req.body.username;
        let full_name = req.body.full_name;
        let accountNumber = req.body.accountNumber;
        let IDNumber = req.body.IDNumber;
        let password = req.body.password;


        if (!username || !full_name || !accountNumber || !IDNumber || !password) {
            return res.status(400).send('All fields (username, full name, account number, ID number, password) are required');
        }

         if (!usernameRegex.test(username)) {
            return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
        }
        if (!fullNameRegex.test(full_name)) {
            return res.status(400).send('Full name contains invalid characters');
        }
        if (!accountNumberRegex.test(accountNumber)) {
            return res.status(400).send('Account number must be 6-20 digits');
        }
        if (!idNumberRegex.test(IDNumber)) {
            return res.status(400).send('ID Number must be exactly 13 digits');
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send('Password must be at least 6 characters and contain at least one letter and one number');
        }

        // Check if username already exists
        let userCollection = await db.collection("users");
        const existingUser = await userCollection.findOne({ username: { $eq: username.toString() } });
        
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        //salted and hashed 10 rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Encrypt sensitive data before storing
        const encryptedAccountNumber = await encrypt(accountNumber);
        const encryptedIDNumber = await encrypt(IDNumber);
        const encryptedFullName = await encrypt(full_name);

        const newDocument = {
            username: username.toString(), // Username is not encrypted as it's used for login but sanitized
            full_name: encryptedFullName,
            accountNumber: encryptedAccountNumber,
            IDNumber: encryptedIDNumber,
            password: hashedPassword,
            userType: "User"
        };

        let result = await userCollection.insertOne(newDocument);

        res.status(201).json({ message: 'User created successfully', result });
    }
    catch (error) {
        console.error("signup error:", error);  
        res.status(500).send('Internal server error');
    }
});

// Remove later
/**
 * Employee registration endpoint
 * Validates input data, encrypts sensitive information, and creates new employee account
 * POST /user/signup-employee
 */
router.post("/signup-employee", async (req, res) => {
    try {
        // Whitelist allowed fields
        const allowedFields = ["username", "full_name", "accountNumber", "IDNumber", "password"];
        Object.keys(req.body).forEach(key => {
            if (!allowedFields.includes(key)) {
                delete req.body[key];
            }
        });

        // Regex patterns for input validation
        const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        const fullNameRegex = /^[a-zA-Z .,'-]{2,50}$/;
        const accountNumberRegex = /^\d{6,20}$/;
        const idNumberRegex = /^\d{13}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

        let username = req.body.username;
        let full_name = req.body.full_name;
        let accountNumber = req.body.accountNumber;
        let IDNumber = req.body.IDNumber;
        let password = req.body.password;

        if (!username || !full_name || !accountNumber || !IDNumber || !password) {
            return res.status(400).send('All fields (username, full name, account number, ID number, password) are required');
        }

        if (!usernameRegex.test(username)) {
            return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
        }
        if (!fullNameRegex.test(full_name)) {
            return res.status(400).send('Full name contains invalid characters');
        }
        if (!accountNumberRegex.test(accountNumber)) {
            return res.status(400).send('Account number must be 6-20 digits');
        }
        if (!idNumberRegex.test(IDNumber)) {
            return res.status(400).send('ID Number must be exactly 13 digits');
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send('Password must be at least 6 characters and contain at least one letter and one number');
        }

        // Check if username already exists
        let userCollection = await db.collection("users");
        const existingUser = await userCollection.findOne({ username: { $eq: username.toString() } });
        
        if (existingUser) {
            return res.status(400).send('Username already exists');
        }

        //salted and hashed 10 rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Encrypt sensitive data before storing
        const encryptedAccountNumber = await encrypt(accountNumber);
        const encryptedIDNumber = await encrypt(IDNumber);
        const encryptedFullName = await encrypt(full_name);

        const newDocument = {
            username: username.toString(), // Username is not encrypted as it's used for login but sanitized
            full_name: encryptedFullName,
            accountNumber: encryptedAccountNumber,
            IDNumber: encryptedIDNumber,
            password: hashedPassword,
            userType: "Employee"
        };

        let result = await userCollection.insertOne(newDocument);

        res.status(201).json({ message: 'Employee created successfully', result });
    }
    catch (error) {
        console.error("employee signup error:", error);  
        res.status(500).send('Internal server error');
    }
});

/**
 * Retrieves authenticated user's profile information
 * Decrypts sensitive data before sending response
 * GET /user/profile (requires authentication)
 */
router.get('/profile', checkAuth, async (req, res) => {
    try {
        const userName = req.user.username;
        
        if (!userName) {
            return res.status(401).json({ message: 'Username required' });
        }

        let userCollection = await db.collection("users");
        let user = await userCollection.findOne({ username: { $eq: userName.toString() } });

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

/**
 * User authentication endpoint
 * Validates credentials, compares encrypted data, and generates JWT token
 * POST /user/login
 */
router.post('/login', async (req, res) => {

    // Whitelist allowed fields
    const allowedFields = ["name", "password", "accountNumber"];
    Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
            delete req.body[key];
        }
    });

    // Regex patterns for input validation
    const nameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/;

    const user = req.body.name;
    const accountNumber = req.body.accountNumber;
    const password = req.body.password;

    if (!user || !password) {
        return res.status(400).send('Username and password are required');
    }
    if (!nameRegex.test(user)) {
        return res.status(400).send('Username must be 3-16 characters and contain only letters, numbers, or underscores');
    }
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Password must be at least 6 characters and contain at least one letter and one number');
    }

    try{
    let userCollection = await db.collection("users");
    let result = await userCollection.findOne({ username: { $eq: user.toString() } });

    if (!result) {
        return res.status(401).send('Authentication failed');
    }

    // Decrypt and validate account number
    const decryptedAccountNumber = await decrypt(result.accountNumber);
    if (decryptedAccountNumber !== accountNumber) {
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
    }
    catch (error) {
        res.status(500).send('Internal server error');
    }
});

export default router;