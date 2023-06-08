var express = require("express");
var router = express.Router();

var ObjectId = require('mongodb').ObjectId;

// require mongodb
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://vehde_admin:Rug6ZzAzUPgKpObN@cluster0.i6ezqez.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

/* routers. */
router.get("/", async (req, res, next) => {
  const hosts = await hostCollection.find({}).toArray();
  res.status(200).json(hosts);
});

// load host collection from mongodb
const hostCollection = client.db("vehde").collection("host");
const carListingCollection = client.db("vehde").collection("carListing");

// GET all hosts
router.get("/all", async (req, res) => {
  res.send("Nothing");
});

// create a new host
router.post("/create", async (req, res) => {
  const host = req.body;
  const result = await hostCollection.insertOne(host);
  res.json(result);
});

// login a host using email or phone number
router.post("/login", async (req, res) => {
  const host = req.body;

  // check if email or phone number is matched
  const result = await hostCollection.findOne({
    $or: [{ email: host.emailOrPhone }, { phone: host.emailOrPhone }],
  });
  if (result) {
    res.json(result);
  } else {
    res.json({ message: "No host found" });
  }
});

// create car listing
router.post("/listing", async (req, res) => {
  const listing = req.body;
  const result = await carListingCollection.insertOne(listing);
  res.json(result);
});

// get all car listings
router.get("/listing", async (req, res) => {
  const listings = await carListingCollection.find({}).toArray();
  res.status(200).json(listings);
});

// delete a car from listing
router.delete("/listing", async (req, res) => {
  const id = req.body.id;
 
//   delete the car from listing
const result = await carListingCollection.deleteOne({ _id: new ObjectId(id) });
res.json(result);
});

module.exports = router;
