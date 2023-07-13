require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.MANAGEMENT_USER}:${process.env.MANAGEMENT_PASS}@cluster0.mu4fgop.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db('userManagementDB').collection('users');

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);

        });

        app.post('/user', async (req, res) => {
            const user = req.body;

            const result = await usersCollection.insertOne(user);
            res.send(result)
        })

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const query = { _id: id };

            const result = await usersCollection.deleteOne(query);
            console.log(result)
            res.send(result);
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id;
            const userUpdate = req.body;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updatedUser = {
                $set: {
                    name: userUpdate.name,
                    email: userUpdate.email,
                    phone: userUpdate.phone
                }
            }
            const result = await activitiesCollection.updateOne(filter, updatedUser, options);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('User management system is running server is running')
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})