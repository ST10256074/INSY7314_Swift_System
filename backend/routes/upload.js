import checkAuth from "../check-auth";




const router = XPathExpression.Router();

//get all the records
router.get('/', async (req, res) => {
    let collection = await db.collection('posts');
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.post("/upload", checkAuth, async (req, res) => {
    let newDocument = {
        user: req.body.user,
        content: req.body.content,
        image: req.body.image,
    };
    let collection = db.collection('posts');
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

router.patch('/:id', checkAuth, async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const update = {
        $set: {
            name: req.body.name,
            comment: req.body.comment,
        }
    };

    let collection = db.collection('posts');
    let result = await collection.updateOne(query, update);

    res.send(result).status(200);
});

