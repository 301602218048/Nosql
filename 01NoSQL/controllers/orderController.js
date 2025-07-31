const Order = require("../models/order");
const User = require("../models/user");
const { ObjectId } = require("mongodb");

const getDb = require("../config/connectDB").getDb;

const addOrder = async (req, res) => {
  const order = req.body;
  const userId = req.params.id;

  const user = await User.findById(userId);

  const db = getDb();

  const items = user.cart.items;

  const newOrder = new Order(items, userId, order.address);

  newOrder
    .save()
    .then((res) => {
      const orderId = res.insertedId;
      return Order.findById(orderId);
    })
    .then((order) => {
      console.log(" Found order by ID:", order);
      res.json({ msg: "order ADDED", order: order });
    })
    .catch((err) => {
      console.error(" Error during DB operation:", err);
    });

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(userId) }, { $set: { "cart.items": [] } });
};

const findOrderById = async (req, res) => {
  try {
    const userId = req.params.id;

    const db = getDb();

    const order = await db
      .collection("orders")
      .findOne({ userId: new ObjectId(userId) });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.json({ msg: "Order fetched successfully", order });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};
module.exports = { addOrder, findOrderById };
