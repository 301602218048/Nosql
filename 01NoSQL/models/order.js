const getDb = require("../utils/db-connect").getDb;
const { ObjectId } = require("mongodb");

class Order {
  constructor(items, userId, address) {
    this.items = items;
    this.userId = new ObjectId(userId);
    this.address = address;
  }

  save() {
    const db = getDb();
    return db
      .collection("orders")
      .insertOne(this)
      .then((res) => {
        console.log("Inserted Order:", res.insertedId);
        return res;
      });
  }

  static findById(orderId) {
    const db = getDb();
    return db
      .collection("orders")
      .findOne({ _id: new ObjectId(orderId) })
      .then((order) => {
        if (!order) {
          throw new Error("Product not found");
        }
        return order;
      });
  }
}

module.exports = Order;
