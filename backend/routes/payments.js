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

        // Validate amount is positive 
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            return res.status(400).json({ message: 'Amount must be a positive number' });
        }

        // Validate SWIFT code format 
        // validation - 8 or 11 characters
        const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
        if (!swiftRegex.test(swiftCode.toUpperCase())) {
            return res.status(400).json({ message: 'Invalid SWIFT code format' });
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
            return {
                ...app,
                recipientName: await decrypt(app.recipientName),
                accountNumber: await decrypt(app.accountNumber),
                swiftCode: await decrypt(app.swiftCode),
                amount: parseFloat(await decrypt(app.amount)),
                currency: await decrypt(app.currency),
                paymentProvider: await decrypt(app.paymentProvider)
            };
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
            return {
                ...app,
                recipientName: await decrypt(app.recipientName),
                accountNumber: await decrypt(app.accountNumber),
                swiftCode: await decrypt(app.swiftCode),
                amount: parseFloat(await decrypt(app.amount)),
                currency: await decrypt(app.currency),
                paymentProvider: await decrypt(app.paymentProvider)
            };
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
        const decryptedApplication = {
            ...application,
            recipientName: await decrypt(application.recipientName),
            accountNumber: await decrypt(application.accountNumber),
            swiftCode: await decrypt(application.swiftCode),
            amount: parseFloat(await decrypt(application.amount)),
            currency: await decrypt(application.currency),
            paymentProvider: await decrypt(application.paymentProvider)
        };

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
        const decryptedApplication = {
            ...updatedApplication,
            recipientName: await decrypt(updatedApplication.recipientName),
            accountNumber: await decrypt(updatedApplication.accountNumber),
            swiftCode: await decrypt(updatedApplication.swiftCode),
            amount: parseFloat(await decrypt(updatedApplication.amount)),
            currency: await decrypt(updatedApplication.currency),
            paymentProvider: await decrypt(updatedApplication.paymentProvider)
        };

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
        let applications = await collection.find({ status: status }).sort({ submittedAt: -1 }).toArray();

        // Decrypt sensitive data for response
        const decryptedApplications = await Promise.all(applications.map(async (app) => {
            return {
                ...app,
                recipientName: await decrypt(app.recipientName),
                accountNumber: await decrypt(app.accountNumber),
                swiftCode: await decrypt(app.swiftCode),
                amount: parseFloat(await decrypt(app.amount)),
                currency: await decrypt(app.currency),
                paymentProvider: await decrypt(app.paymentProvider)
            };
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