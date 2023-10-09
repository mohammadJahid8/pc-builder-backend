const express = require("express");
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const client = new MongoClient(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.355hk05.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  }
);

async function run() {
  try {
    // await client.connect();

    const productsCollection = client.db("pcBuilder").collection("products");

    console.log("connected to db");

    app.get("/products", async (req, res) => {
      try {
        const { featured, ...otherFilters } = req.query;
        const filter = featured === "true" ? { featured: true } : otherFilters;

        const result = await productsCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.get("/products/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.findOne(query);

        if (result) {
          res.send(result);
        } else {
          res.status(404).send("Product not found");
        }
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });

    app.post("/products", async (req, res) => {
      try {
        const result = await productsCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
      }
    });
  } finally {
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Running");
});
app.listen(port, () => {
  console.log("PC Builder server listening to port", port);
});
