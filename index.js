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

    }
    finally {
        
    }
}

run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(port);