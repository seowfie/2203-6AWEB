// This file is saved inside the 'api' folder.

const express = require("express");
const { MongoClient } = require("mongodb");
const dns = require("dns");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());

const CONNECTION_STRING = "mongodb://localhost:27017";
const DATABASENAME = "MyDb";
let database;

// Middleware instantiation
app.use((req, res, next) => {
  if (!database) {
    return res.status(503).json({ error: "Database not connected yet." });
  }
  next();
});

console.log("Starting API...");
console.log("Connecting to MongoDB...");

async function start() {
  try {
    // Create client with timeouts so you see errors quickly
    const client = new MongoClient(CONNECTION_STRING, {
      serverSelectionTimeoutMS: 10000, // 10s
      connectTimeoutMS: 10000,
    });

    await client.connect();

    database = client.db(DATABASENAME);
    console.log("Yay! Now connected to Cluster");

    app.listen(5038, () => {
      console.log("Server running on http://localhost:5038");
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

start();

// ==========================================
// PONY ROUTES (CRUD OPERATIONS)
// ==========================================

// 1. READ: Get all ponies
app.get("/api/ponies/GetPonies", async (req, res) => {
  try {
    const result = await database.collection("Ponies").find({}).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching ponies:", error);
    res.status(500).json({ error: "Failed to fetch ponies" });
  }
});

// 2. CREATE: Add a pony
app.post("/api/ponies/AddPony", multer().none(), async (req, res) => {
  try {
    // Generate an ID based on the document count (matching your original logic)
    const numOfDocs = await database.collection("Ponies").countDocuments();

    await database.collection("Ponies").insertOne({
      id: String(numOfDocs + 1),
      name: req.body.name,
      color: req.body.color,
      ponyType: req.body.ponyType,
      elementOfHarmony: req.body.elementOfHarmony
    });

    res.json("Pony Added Successfully");
  } catch (error) {
    console.error("Error adding pony:", error);
    res.status(500).json({ error: "Failed to add pony" });
  }
});

// 3. UPDATE: Edit a pony (The new required method!)
app.put("/api/ponies/UpdatePony", multer().none(), async (req, res) => {
  try {
    await database.collection("Ponies").updateOne(
      { id: req.body.id }, // Find the pony by its ID
      {
        $set: { // Update the 4 fields
          name: req.body.name,
          color: req.body.color,
          ponyType: req.body.ponyType,
          elementOfHarmony: req.body.elementOfHarmony
        }
      }
    );
    res.json("Pony Updated Successfully");
  } catch (error) {
    console.error("Error updating pony:", error);
    res.status(500).json({ error: "Failed to update pony" });
  }
});

// 4. DELETE: Remove a pony
app.delete("/api/ponies/DeletePony", async (req, res) => {
  try {
    await database.collection("Ponies").deleteOne({ id: req.query.id });
    res.json("Pony banished successfully!");
  } catch (error) {
    console.error("Error deleting pony:", error);
    res.status(500).json({ error: "Failed to delete pony" });
  }
});