import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';
import checkAuth from "../check-auth.js";
import { encrypt, decrypt } from "../utils/encryption.js";

const router = express.Router();
router.use(checkAuth);

/**
 * Submits a new international payment application
 * Validates input data, encrypts sensitive information, and stores in database
 * POST /payments/submit (requires authentication)
 */
router.post('/submit', async (req, res) => {

    // Whitelist allowed fields
    const allowedFields = ["recipientName", "accountNumber", "swiftCode", "amount", "currency", "paymentProvider"];
    Object.keys(req.body).forEach(key => {
        if (!allowedFields.includes(key)) {
            delete req.body[key];
        }
    });

    // Regex patterns for input validation
    const recipientNameRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;
    const accountNumberRegex = /^\d{6,20}$/;
    const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const currencyRegex = /^[A-Z]{3}$/;
    const paymentProviderRegex = /^[a-zA-Z0-9 .,'-]{2,50}$/;

    try {
        const {
            recipientName,
            accountNumber,
            swiftCode,
            amount,
            currency,
            paymentProvider
        } = req.body;

        // Validate required fields
        if (!recipientName || !accountNumber || !swiftCode || !amount || !currency || !paymentProvider) {
            return res.status(400).json({ 
                message: 'All fields are required: recipientName, accountNumber, swiftCode, amount, currency, paymentProvider' 
            });
        }

        // Regex validation for each field
        if (!recipientNameRegex.test(recipientName)) {
            return res.status(400).json({ message: 'Invalid recipient name format.' });
        }
        if (!accountNumberRegex.test(accountNumber)) {
            return res.status(400).json({ message: 'Invalid account number format.' });
        }
        if (!swiftCodeRegex.test(swiftCode.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid SWIFT code format.' });
        }
        if (!amountRegex.test(amount)) {
            return res.status(400).json({ message: 'Invalid amount format.' });
        }
        if (!currencyRegex.test(currency.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid currency format.' });
        }
        if (!paymentProviderRegex.test(paymentProvider)) {
            return res.status(400).json({ message: 'Invalid payment provider format.' });
        }

        // Encrypt all sensitive data before storing
        const encryptedRecipientName = await encrypt(recipientName.trim());
        const encryptedAccountNumber = await encrypt(accountNumber.trim());
        const encryptedSwiftCode = await encrypt(swiftCode.toUpperCase().trim());
        const encryptedAmount = await encrypt(amount.toString());
        const encryptedCurrency = await encrypt(currency.toUpperCase().trim());
        const encryptedPaymentProvider = await encrypt(paymentProvider.trim());

        // Create payment application
        const paymentApplication = {
            recipientName: encryptedRecipientName,
            accountNumber: encryptedAccountNumber,
            swiftCode: encryptedSwiftCode,
            amount: encryptedAmount,
            currency: encryptedCurrency,
            paymentProvider: encryptedPaymentProvider,
            submittedBy: req.user.id,
            submittedByName: req.user.name,
            status: 'pending', // pending, approved, rejected
            submittedAt: new Date(),
            reviewedAt: null,
            reviewedBy: null,
            reviewerName: null,
            reviewComments: null
        };

        let collection = await db.collection("payment_applications");
        let result = await collection.insertOne(paymentApplication);

        res.status(201).json({ 
            message: 'Payment application submitted successfully', 
            applicationId: result.insertedId,
            application: paymentApplication 
        });

    } catch (error) {
        console.error("Payment submission error:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Retrieves all payment applications for employee review
 * Decrypts sensitive data and returns sorted by submission date
 * GET /payments/all (requires authentication - employee access)
 */
router.get('/all', async (req, res) => {
    try {
        let collection = await db.collection("payment_applications");
        let applications = await collection.find({}).sort({ submittedAt: -1 }).toArray();

        // Decrypt sensitive data for response
        const decryptedApplications = await Promise.all(applications.map(async (app) => {
            try {
                const decryptedAmount = await decrypt(app.amount);
                return {
                    ...app,
                    recipientName: await decrypt(app.recipientName) || 'Unknown Recipient',
                    accountNumber: await decrypt(app.accountNumber) || 'Unknown Account',
                    swiftCode: await decrypt(app.swiftCode) || 'Unknown SWIFT',
                    amount: decryptedAmount ? parseFloat(decryptedAmount) : 0,
                    currency: await decrypt(app.currency) || 'USD',
                    paymentProvider: await decrypt(app.paymentProvider) || 'Unknown Provider'
                };
            } catch (error) {
                console.error(`Error decrypting application ${app._id}:`, error);
                // Return the application with default values if decryption fails
                return {
                    ...app,
                    recipientName: 'Decryption Error',
                    accountNumber: 'Decryption Error',
                    swiftCode: 'Decryption Error',
                    amount: 0,
                    currency: 'USD',
                    paymentProvider: 'Decryption Error'
                };
            }
        }));

        res.status(200).json({ 
            message: 'Payment applications retrieved successfully',
            applications: decryptedApplications
        });

    } catch (error) {
        console.error("Error retrieving applications:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Retrieves payment applications submitted by the current user
 * Filters by user ID from JWT token and decrypts sensitive data
 * GET /payments/my-applications (requires authentication)
 */
router.get('/my-applications', async (req, res) => {
    try {
        let collection = await db.collection("payment_applications");
        let applications = await collection.find({ 
            submittedBy: req.user.id 
        }).sort({ submittedAt: -1 }).toArray();

        // Decrypt sensitive data for response
        const decryptedApplications = await Promise.all(applications.map(async (app) => {
            try {
                const decryptedAmount = await decrypt(app.amount);
                return {
                    ...app,
                    recipientName: await decrypt(app.recipientName) || 'Unknown Recipient',
                    accountNumber: await decrypt(app.accountNumber) || 'Unknown Account',
                    swiftCode: await decrypt(app.swiftCode) || 'Unknown SWIFT',
                    amount: decryptedAmount ? parseFloat(decryptedAmount) : 0,
                    currency: await decrypt(app.currency) || 'USD',
                    paymentProvider: await decrypt(app.paymentProvider) || 'Unknown Provider'
                };
            } catch (error) {
                console.error(`Error decrypting application ${app._id}:`, error);
                return {
                    ...app,
                    recipientName: 'Decryption Error',
                    accountNumber: 'Decryption Error',
                    swiftCode: 'Decryption Error',
                    amount: 0,
                    currency: 'USD',
                    paymentProvider: 'Decryption Error'
                };
            }
        }));

        res.status(200).json({ 
            message: 'Your payment applications retrieved successfully',
            applications: decryptedApplications
        });

    } catch (error) {
        console.error("Error retrieving user applications:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Retrieves a specific payment application by its MongoDB ObjectId
 * Validates ID format, finds application, and decrypts sensitive data
 * GET /payments/:id (requires authentication)
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        let collection = await db.collection("payment_applications");
        let application = await collection.findOne({ _id: new ObjectId(id) });

        if (!application) {
            return res.status(404).json({ message: 'Payment application not found' });
        }

        // Decrypt sensitive data for response
        let decryptedApplication;
        try {
            const decryptedAmount = await decrypt(application.amount);
            decryptedApplication = {
                ...application,
                recipientName: await decrypt(application.recipientName) || 'Unknown Recipient',
                accountNumber: await decrypt(application.accountNumber) || 'Unknown Account',
                swiftCode: await decrypt(application.swiftCode) || 'Unknown SWIFT',
                amount: decryptedAmount ? parseFloat(decryptedAmount) : 0,
                currency: await decrypt(application.currency) || 'USD',
                paymentProvider: await decrypt(application.paymentProvider) || 'Unknown Provider'
            };
        } catch (error) {
            console.error(`Error decrypting application ${application._id}:`, error);
            decryptedApplication = {
                ...application,
                recipientName: 'Decryption Error',
                accountNumber: 'Decryption Error',
                swiftCode: 'Decryption Error',
                amount: 0,
                currency: 'USD',
                paymentProvider: 'Decryption Error'
            };
        }

        res.status(200).json({ 
            message: 'Payment application retrieved successfully',
            application: decryptedApplication
        });

    } catch (error) {
        console.error("Error retrieving application:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Reviews a payment application (approve/reject) - employee functionality
 * Updates application status, adds reviewer info and comments
 * PATCH /payments/review/:id (requires authentication - employee access)
 */
router.patch('/review/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comments } = req.body;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        if (!status || !['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Status must be either "approved" or "rejected"' });
        }

        let collection = await db.collection("payment_applications");
        
        // Check if application exists and is pending
        let application = await collection.findOne({ _id: new ObjectId(id) });
        
        if (!application) {
            return res.status(404).json({ message: 'Payment application not found' });
        }

        if (application.status !== 'pending') {
            return res.status(400).json({ 
                message: `Application has already been ${application.status}` 
            });
        }

        // Update application
        const updateData = {
            status: status,
            reviewedAt: new Date(),
            reviewedBy: req.user.id,
            reviewerName: req.user.name,
            reviewComments: comments || null
        };

        let result = await collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(400).json({ message: 'Failed to update application' });
        }

        // Get updated application to return
        let updatedApplication = await collection.findOne({ _id: new ObjectId(id) });

        // Decrypt sensitive data for response
        let decryptedApplication;
        try {
            const decryptedAmount = await decrypt(updatedApplication.amount);
            decryptedApplication = {
                ...updatedApplication,
                recipientName: await decrypt(updatedApplication.recipientName) || 'Unknown Recipient',
                accountNumber: await decrypt(updatedApplication.accountNumber) || 'Unknown Account',
                swiftCode: await decrypt(updatedApplication.swiftCode) || 'Unknown SWIFT',
                amount: decryptedAmount ? parseFloat(decryptedAmount) : 0,
                currency: await decrypt(updatedApplication.currency) || 'USD',
                paymentProvider: await decrypt(updatedApplication.paymentProvider) || 'Unknown Provider'
            };
        } catch (error) {
            console.error(`Error decrypting updated application ${updatedApplication._id}:`, error);
            decryptedApplication = {
                ...updatedApplication,
                recipientName: 'Decryption Error',
                accountNumber: 'Decryption Error',
                swiftCode: 'Decryption Error',
                amount: 0,
                currency: 'USD',
                paymentProvider: 'Decryption Error'
            };
        }

        res.status(200).json({ 
            message: `Payment application ${status} successfully`,
            application: decryptedApplication
        });

    } catch (error) {
        console.error("Error reviewing application:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

/**
 * Retrieves payment applications filtered by status
 * Validates status parameter and returns matching applications with decrypted data
 * GET /payments/status/:status (requires authentication)
 */
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected' });
        }

        let collection = await db.collection("payment_applications");
        // Use parameterized query to prevent injection attacks
        const sanitizedStatus = status.toString();
        let applications = await collection.find({ status: { $eq: sanitizedStatus } }).sort({ submittedAt: -1 }).toArray();

        // Decrypt sensitive data for response
        const decryptedApplications = await Promise.all(applications.map(async (app) => {
            try {
                const decryptedAmount = await decrypt(app.amount);
                return {
                    ...app,
                    recipientName: await decrypt(app.recipientName) || 'Unknown Recipient',
                    accountNumber: await decrypt(app.accountNumber) || 'Unknown Account',
                    swiftCode: await decrypt(app.swiftCode) || 'Unknown SWIFT',
                    amount: decryptedAmount ? parseFloat(decryptedAmount) : 0,
                    currency: await decrypt(app.currency) || 'USD',
                    paymentProvider: await decrypt(app.paymentProvider) || 'Unknown Provider'
                };
            } catch (error) {
                console.error(`Error decrypting application ${app._id}:`, error);
                return {
                    ...app,
                    recipientName: 'Decryption Error',
                    accountNumber: 'Decryption Error',
                    swiftCode: 'Decryption Error',
                    amount: 0,
                    currency: 'USD',
                    paymentProvider: 'Decryption Error'
                };
            }
        }));

        res.status(200).json({ 
            message: `${status} payment applications retrieved successfully`,
            applications: decryptedApplications
        });

    } catch (error) {
        console.error("Error retrieving applications by status:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;