const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 9000;
const app = express();

//middleware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.845tn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("westerntour");
        const packageCollection = database.collection("allPackage");
        const bookingCollection = database.collection("bookForm");
        const travellerCollection = database.collection("traveler");

        //use post api
        app.post('/bookingpackage', async (req, res) => {
            const service = req.body;
            const result = await bookingCollection.insertOne(service);
            console.log('hitting database', result);
            // console.log(`A document was inserted with the _id: ${ result.insertedId } `);
            res.json(result);
        });

        app.get('/myorders', async (req, res) => {
            const cursor = bookingCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

        //delete
        app.delete('/myorders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const deletePackage = await bookingCollection.deleteOne(query);
            // console.log('delete from database ',  deletePackage);
            console.log('delete from database');
            res.json(deletePackage);
        })

        app.post('/tourpackage', async (req, res) => {
            const service = req.body;
            const result = await packageCollection.insertOne(service);
            console.log('hitting database', result);
            // console.log(`A document was inserted with the _id: ${ result.insertedId } `);
            res.json(result);
        });
        app.get('/tourpackage', async (req, res) => {
            const cursor = packageCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });
        app.get('/tourpackage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await packageCollection.findOne(query);
            res.json(service);
        });

        app.get('/traveler', async (req, res) => {
            const cursor = travellerCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        });

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('mongodb is running');
});

app.listen(port, () => {
    console.log('local host start', port);
})