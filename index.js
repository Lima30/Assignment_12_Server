const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ldu2w.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // // console.log('database connected succesfully');
        // const database = client.db('online_shopHotel');
        // const productCollection = database.collection('products');
        // // const orderCollection = database.collection('orders');
        // const bookingsCollection = database.collection('bookings')
        // const usersCollection = database.collection('users');



        // console.log('database connected succesfully');
        const database = client.db('online_shop');
        const productCollection = database.collection('products');
        // const orderCollection = database.collection('orders');
        const bookingsCollection = database.collection('bookings')
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('review');

        //GET Products API'-Lima
        // get all service-Github
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });



        // ad service

        app.post("/addServices", async (req, res) => {
            const result = await productCollection.insertOne(req.body);
            res.send(result);
        });


        app.get('/Review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });


        app.post("/addReview", async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.send(result);
        });

        // // get all service
        // app.get("/allServices", async (req, res) => {
        //     const result = await productCollection.find({}).toArray();
        //     res.send(result);
        //     console.log(result);
        // });

        //Get Single Service -Lima
        // app.get('/products/:id', async (req, res) => {
        //     console.log(req.params.id);
        //     // const id = req.params.id;
        //     // console.log('getting specific service', id);
        //     // const query = { _id: ObjectId(id) };
        //     // const service = await productCollection.findOne(query);
        //     // res.json(service);

        //     const service = await productCollection
        //         .find({ _id: ObjectId(req.params.id) })
        //         .toArray();
        //     // res.send(service[0]);
        //     console.log(service);

        // })




        // get single product - Git hub
        app.get("/products/:id", async (req, res) => {
            // console.log(req.params.id);
            const result = await productCollection
                .find({ _id: ObjectId(req.params.id) })
                .toArray();
            res.send(result[0]);
            // res.send(result);
            // console.log(service);
        });


        // cofirm order
        app.post("/confirmOrder", async (req, res) => {
            const result = await bookingsCollection.insertOne(req.body);
            res.send(result);
            // console.log(result);
        });



        // my confirmOrder

        app.get("/myOrders/:email", async (req, res) => {
            const result = await bookingsCollection
                .find({ email: req.params.email })
                .toArray();
            res.send(result);
            // console.log(result);
        });

        /// delete order

        app.delete("/delteOrder/:id", async (req, res) => {
            const result = await bookingsCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
            // console.log(result);
        });

        // all order
        app.get("/allOrders", async (req, res) => {
            const result = await bookingsCollection.find({}).toArray();
            res.send(result);
        });

        app.put("/updateStatus/:id", (req, res) => {
            const id = req.params.id;
            const updatedStatus = req.body.status;
            const filter = { _id: ObjectId(id) };
            console.log(updatedStatus);
            bookingsCollection
                .updateOne(filter, {
                    $set: { status: updatedStatus },
                })
                .then((result) => {
                    res.send(result);
                });
        });

        // Add Orders API (maybe not working Lima)

        // app.post('/orders', async (req, res) => {
        //     const order = req.body;
        //     console.log('order', order);
        //     res.send('order processed');
        // })


        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })






        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log('put', user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);


        });















        // app.put('/users/admin', async (req, res) => {
        //     const user = req.body;
        //     console.log('put', user);
        //     const requester = req.decodedEmail;
        //     if (requester) {
        //         const requesterAccount = await usersCollection.findOne({ email: requester });
        //         if (requesterAccount.role === 'admin') {
        //             const filter = { email: user.email };
        //             const updateDoc = { $set: { role: 'admin' } };
        //             const result = await usersCollection.updateOne(filter, updateDoc);
        //             res.json(result);
        //         }
        //     }
        //     else {
        //         res.status(403).json({ message: 'you do not have access to make admin' })
        //     }

        // })


    }
    finally {
        //await client.close();
    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('room server is running');

});

app.get('/', (req, res) => {
    res.send('Running room server');
});

app.listen(port, () => {
    console.log('Running Room Server on port', port);
})