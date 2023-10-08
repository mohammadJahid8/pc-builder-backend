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
    await client.connect();

    const productsCollection = client.db("pcBuilder").collection("products");
    // const cpuCollection = client.db("pcBuilder").collection("cpu");

    console.log("connected to db");

    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await productsCollection.findOne(query);
      console.log(result);
      res.send(result);
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
