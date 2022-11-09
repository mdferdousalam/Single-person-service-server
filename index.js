const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kykmokn.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' });
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const userCollection = client.db('assignment11').collection('users');
        const servicesCollection = client.db('assignment11').collection('services');
        const quotationCollection = client.db('assignment11').collection('quotation');
        const reviewsCollection = client.db('assignment11').collection('reviews');

        // users finding api
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })


        // user creating API
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user)
            res.send(result)

        })

        // quotation API
        app.post('/quotations', async (req, res) => {
            const quotation = req.body
            const result = await quotationCollection.insertOne(quotation)
            res.send(result)
        })


        // review add API
        app.post('/addreview', async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review)
            res.send(result)
        })

        // all reviews get API
        app.get('/reviews/:id', async (req, res) => {

            const query = {}
            const cursor = reviewsCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })


        // services adding API
        app.post('/services', async (req, res) => {
            const service = req.body
            console.log(service);
            const result = await servicesCollection.insertOne(service)
            res.send(result)

        })

        // services finding API
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })


        // Limit services finding API 
        app.get('/serviceslimit', async (req, res) => {
            const query = {}
            const cursor = servicesCollection.find(query)
            const services = await cursor.limit(3).toArray()
            res.send(services)
        })

        // single service finding API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.findOne(query)
            res.send(result)
        })


    } catch (error) {

    }
    finally {

    }
}

run().catch(err => console.error(err));



app.get('/', (req, res) => {
    res.send('server is running')
})




app.listen(port, () => {
    console.log(`surver running on port: ${port}`)
    client.connect(err => {
        if (err) {
            console.log(err)
        } else {
            console.log('Connected to mongoDb')
            client.close();
        }
    })
})