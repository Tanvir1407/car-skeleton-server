const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e8f5x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
    try {
        await client.connect();
        const partsCollection = client.db("carSkeleton").collection("parts");
        const ordersCollection = client.db("carSkeleton").collection("orders");
        const userCollection = client.db("carSkeleton").collection("profile");
    
        app.get('/parts', async( req,res) => {
            const parts = await partsCollection.find().toArray();
            res.send(parts);
        });

        //get parts data by Id
        app.get('/parts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await partsCollection.findOne(query);
            res.send(result);
        })
      //get order data from purchase page
      app.post('/order', async(req, res) => {
        const order = req.body;
        const result = await ordersCollection.insertOne(order);
        res.send({result})
      })

      // get order by email
      app.get('/order', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const result = await ordersCollection.find(query).toArray();
        res.send(result);

      })
      //delete order 
      app.delete('/order/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }
        const result = await ordersCollection.deleteOne(query);
        res.send(result);
      })

      // update profile 
      app.put('/update/:email', async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email }
        const options = { upsert: true }
        console.log(user);
        if (user) {
          const updateDoc = {
            $set: user,
          };
          const result = await userCollection.updateOne(
            filter,
            updateDoc,
            options
          );
          res.send(result);
        }
        
      })
      //profile update
      app.put('/update/:id', async (req, res) => {
        const id = req.params.id;
        const profile = req.body;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
          $set: {
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
            address: profile.address,
            education: profile.education,
            linkedin: profile.linkedin,
          },
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);
        res.send(result);
      })
      //profile Id
      app.get('/update', async (req, res) => {
        const email = req.query.email;
        const query = { email: email }
        const result = await userCollection.find(query).toArray();
        res.send(result);
      })

    }
    finally {
        
    }
}

run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port);