import express from 'express';
import db from "../db/conn.js";
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    let collection = await db.collection('posts');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

// Create a new post
router.post('/upload', async (req, res) => {
    let newDocument = {
        user: req.body.user,
        title: req.body.title,
        Image: req.body.Image,
    };
    let collection = db.collection('posts');
    let result = await collection.insertOne(newDocument);
    res.send(result).status(201);
});

router.patch('/:id', async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates = {
        $set: {
            user: req.body.user,
            comment: req.body.comment
        }
    };
    let collection = db.collection('posts');
    let result = await collection.updateOne(
        query,
        updates
    );
    res.send(result).status(200);
});

router.get('/:id', async (req, res) => {
    let collection = await db.collection('posts');
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.findOne(query);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
});

router.delete('/:id', async (req, res) => {
    let collection = db.collection('posts');
    let query = { _id: new ObjectId(req.params.id) };
    let result = await collection.deleteOne(query);
    res.send(result).status(200);
});

// export default router;
export default router;