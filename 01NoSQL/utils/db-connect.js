const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_URI;

let _db;

const mongoConnect = async (callback) => {
  try {
    const client = await MongoClient.connect(uri);
    console.log("Db connected!");
    _db = client.db();
    callback();
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
};

const getDb = () => {
  if (_db) return _db;
  throw "No database found";
};

module.exports = { mongoConnect, getDb };
