const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

//middleware
app.use(cors());
app.use(express.json());


//MongoDB database

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hxgse1v.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const servicesCollection = client.db('talesFromBanglaDB').collection('services');
        const bookingsCollection = client.db('talesFromBanglaDB').collection('bookings');


        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const bookings = req.body;
            const result = await bookingsCollection.insertOne(bookings);
            res.send(result);
        })

        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    userEmail: req.query.email
                }
            }
            const cursor = bookingsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/services', async (req, res) => {
            const addServices = req.body;
            const result = await servicesCollection.insertOne(addServices);
            res.send(result);
        })

        // app.get('/services/:email', async (req, res) => {
        //     let params = {};
        //     if (req.params.email) {
        //         params = {
        //             service_provider_email: req.params.email
        //         }
        //     }
        //     const cursor = servicesCollection.find(params);
        //     const result = await cursor.toArray();
        //     res.send(result);
        // })

        app.get('/services/myServices', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    service_provider_email: req.query.email
                }
            }
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) };
            const result = await servicesCollection.findOne(query);
            res.send(result);
        })

        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateServices = req.body;
            const services = {
                $set: {
                    service_name: updateServices.service_name,
                    service_image: updateServices.service_image,
                    service_provider_name: updateServices.service_provider_name,
                    service_provider_email: updateServices.service_provider_email,
                    service_provider_image: updateServices.service_provider_image,
                    service_price: updateServices.service_price,
                    service_area: updateServices.service_area,
                    service_description: updateServices.service_description
                }
            }

            const result = await servicesCollection.updateOne(filter, services, options);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Local Tours and Guides server is running');
})


app.listen(port, () => {
    console.log(`Local Tours and Guides server is running on port ${port}`);
})