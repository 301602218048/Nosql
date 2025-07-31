const User = require("../models/user");
const { ObjectId } = require("mongodb");
const getDb = require("../config/connectDB").getDb;

const addCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.body;

    const db = getDb();

    const DBuser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user._id) });

    if (!DBuser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const index = DBuser.cart?.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index !== -1) {
      const updatedCartItems = DBuser.cart?.items.map((item) => {
        if (item.productId.toString() === productId) {
          return { ...item, quantity: item.quantity + 1 };
        } else {
          return item;
        }
      });

      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { "cart.items": updatedCartItems } }
        );

      res.json({
        msg: "Product quantity increased in cart",
        userId: user._id,
        cart: updatedCartItems,
        index: index,
      });
    } else {
      const updatedCartItems = [
        ...(DBuser.cart?.items || []),
        { productId: new ObjectId(productId), quantity: 1 },
      ];

      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { "cart.items": updatedCartItems } }
        );

      res.json({
        msg: "New product added to cart",
        userId: user._id,
        cart: updatedCartItems,
        index: -1,
      });
    }
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

const findCartById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User cart fetched successfully", user: user.cart.items });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};

const deleteCartitem = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.body;

    const db = getDb();

    const DBuser = await db
      .collection("users")
      .findOne({ _id: new ObjectId(user._id) });

    if (!DBuser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const index = DBuser.cart?.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index !== -1) {
      const updatedCartItems = DBuser.cart?.items.filter((item) => {
        if (item.productId.toString() !== productId) {
          return item;
        }
      });

      await db
        .collection("users")
        .updateOne(
          { _id: new ObjectId(user._id) },
          { $set: { "cart.items": updatedCartItems } }
        );

      res.json({
        msg: "Product deleted",
        cart: updatedCartItems,
        index: index,
      });
    } else {
      res.json({
        msg: "no product ",
      });
    }
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

module.exports = { addCart, findCartById, deleteCartitem };
