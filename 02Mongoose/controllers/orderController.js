const Order = require("../models/order");
const User = require("../models/user");

const addOrder = async (req, res) => {
  const order = req.body;
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    const items = user.cart.items;

    const newOrder = new Order({
      address: order.address,
      items: items,
      userId: id,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order registered successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

const findOrderById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findOne({
      _id: userId,
    });

    res.status(201).json({
      message: "User find successfully",
      user: user,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

module.exports = { addOrder, findOrderById };
