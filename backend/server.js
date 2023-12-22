const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000;

const uri = "mongodb+srv://ahmet:68MEBY4GC5bTZ98B@cluster0.4caye.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.use(express.json());
app.use(cors());

app.post('/saveScore', async (req, res) => {
    const { username, score } = req.body;

    try {
        await client.connect();
        const scoresCollection = client.db("codewatchers").collection("scores");
        await scoresCollection.insertOne({ username, score });
        res.status(201).json({ message: "Score added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding score" });
    } finally {
        await client.close();
    }
});

app.get('/getScores', async (req, res) => {
    try {
        await client.connect();
        const scoresCollection = client.db("codewatchers").collection("scores");
        const scores = await scoresCollection.find().sort({ score: 1 }).limit(10).toArray();
        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting scores" });
    } finally {
        await client.close();
    }
});
app.get('/getLowestScore', async (req, res) => {
    try {
        await client.connect();
        const scoresCollection = client.db("codewatchers").collection("scores");
        const scores = await scoresCollection.find().sort({ score: 1 }).limit(1).toArray();
        res.json(scores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error getting scores" });
    } finally {
        await client.close();
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
