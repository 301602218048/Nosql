const { v4: uuidv4 } = require("uuid");
const cashfreeService = require("../services/cashfreeService");
const mongoose = require("mongoose");
const Orders = require("../models/order");
const User = require("../models/user");

const initiatePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const email = req.user.email;
    const orderId = uuidv4();
    const amount = 100.0;

    await Orders.create(
      [
        {
          orderId,
          amount,
          status: "PENDING",
          userId,
        },
      ],
      { session }
    );

    const paymentSessionId = await cashfreeService.createOrder(
      orderId,
      amount,
      "INR",
      userId,
      email
    );

    if (!paymentSessionId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({ msg: "Failed to get Session Id" });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ paymentSessionId, orderId });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Payment initiation failed:", error.message);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
};

const getOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const orderId = req.params.orderId;

    const orderStatus = await cashfreeService.getPaymentStatus(orderId);

    const order = await Orders.findOne({ orderId }).session(session);
    if (!order) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = orderStatus;
    await order.save({ session });

    if (orderStatus === "Success") {
      await User.updateOne(
        { _id: order.userId },
        { $set: { isPremiumUser: true } },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ msg: "This is your order status", order, orderStatus });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log("Fetching OrderStatus Failed", error.message);
    res.status(500).json({ error: "Failed to fetch order status" });
  }
};

module.exports = { initiatePayment, getOrderStatus };
