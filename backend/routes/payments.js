import express from "express";
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';
// import { verify } from "jsonwebtoken";

const router = express.Router();
// router.use(verify)

// Submit a new payment application
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

        // Create payment application
        const paymentApplication = {
            recipientName: recipientName.trim(),
            accountNumber: accountNumber.trim(),
            swiftCode: swiftCode.toUpperCase().trim(),
            amount: parseFloat(amount),
            currency: currency.toUpperCase().trim(),
            paymentProvider: paymentProvider.trim(),
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

// Get all payment applications (employees)
router.get('/all', async (req, res) => {
    try {
        let collection = await db.collection("payment_applications");
        let applications = await collection.find({}).sort({ submittedAt: -1 }).toArray();

        res.status(200).json({ 
            message: 'Payment applications retrieved successfully',
            applications: applications
        });

    } catch (error) {
        console.error("Error retrieving applications:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get payment applications by user (clients)
router.get('/my-applications', async (req, res) => {
    try {
        let collection = await db.collection("payment_applications");
        let applications = await collection.find({ 
            submittedBy: req.user.id 
        }).sort({ submittedAt: -1 }).toArray();

        res.status(200).json({ 
            message: 'Your payment applications retrieved successfully',
            applications: applications
        });

    } catch (error) {
        console.error("Error retrieving user applications:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a specific payment by ID
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

        res.status(200).json({ 
            message: 'Payment application retrieved successfully',
            application: application
        });

    } catch (error) {
        console.error("Error retrieving application:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Review a payment application
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

        res.status(200).json({ 
            message: `Payment application ${status} successfully`,
            application: updatedApplication
        });

    } catch (error) {
        console.error("Error reviewing application:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get applications by status
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;

        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be pending, approved, or rejected' });
        }

        let collection = await db.collection("payment_applications");
        let applications = await collection.find({ status: status }).sort({ submittedAt: -1 }).toArray();

        res.status(200).json({ 
            message: `${status} payment applications retrieved successfully`,
            applications: applications
        });

    } catch (error) {
        console.error("Error retrieving applications by status:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;