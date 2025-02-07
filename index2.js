const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://raysul:11102019%40Cse@@test1.rgboj.mongodb.net/?retryWrites=true&w=majority&appName=test1`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    //const userCollection = client.db("totTheMasterDB").collection("users");
    const userCollection1=client.db("bootCampdbFull").collection("categories");

    // Fetch all users
    app.get("/users", async (req, res) => {
      const query = userCollection.find();
      const result = await query.toArray();
      res.send(result);
    });

    // Fetch a user by Firebase uid
    app.get("/user/:uid", async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    // Add a new user to the collection
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Update user by id
    app.put("/user/:id", async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      console.log({ user });
      const updatedUser = {
        $set: {
          displayName: user.displayName,
          email: user.email,
          phone: user.phone,
          photoUrl: user.photoUrl,
          address: user.address,
          isAdmin: user.isAdmin,
          isBlocked: user.isBlocked,
        },
      };

      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
      res.send(result);
    });

    // Delete user by id
    app.delete("/user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });
    // Messages Section
    // Create message
    app.post("/messages", async (req, res) => {
      const { title, message, email } = req.body;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");

      const newMessage = {
        title,
        message,
        email,
        createdAt: new Date(),
      };

      const result = await messageCollection.insertOne(newMessage);
      res.send(result);
    });
    // Get all messages
    app.get("/messages", async (req, res) => {
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const messages = await messageCollection.find().toArray();
      res.send(messages);
    });
    // Get message by id
    app.get("/messages/:id", async (req, res) => {
      const id = req.params.id;
      const messageCollection = client
        .db("totTheMasterDB")
        .collection("messages");
      const message = await messageCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(message);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } finally {
    // await client.close(); // Commented out for persistent connection
  }
}
run().catch(console.error);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
