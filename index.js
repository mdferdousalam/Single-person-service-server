const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        // users finding api
        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query)
            const users = await cursor.toArray()
            res.send(users)
        })


        // user creating api 
        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user);
            const result = await userCollection.insertOne(user)
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