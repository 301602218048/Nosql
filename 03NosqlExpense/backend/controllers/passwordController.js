const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");
const path = require("path");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendResetLink = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "Email not found", success: false });
    }

    const id = uuidv4();
    await ForgotPasswordRequest.create(
      [
        {
          _id: id,
          isActive: true,
          userId: user._id,
        },
      ],
      { session }
    );

    const link = `http://15.207.115.51:3000/password/resetpassword/${id}`;

    const msg = {
      to: email,
      from: "abhinav.sharma29032000@gmail.com",
      subject: "Reset Password Link",
      text: "Click on the link to reset your password.",
      html: `<strong>Click on the below link to reset your password.</strong><a href="${link}">${link}</a>`,
    };
    await sgMail.send(msg);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ msg: "Email with reset link sent", success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

const resetPass = async (req, res) => {
  try {
    const id = req.params.id;
    const forgotpassrequest = await ForgotPasswordRequest.findById(id);

    if (!forgotpassrequest || forgotpassrequest.isActive !== true) {
      return res
        .status(404)
        .json({ msg: "Forgot password request not found", success: false });
    }

    res.sendFile(
      path.join(__dirname, "..", "..", "frontend", "html", "reset.html")
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

const updatePass = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const id = req.params.id;
    const { newPassword } = req.body;

    const forgotpassrequest = await ForgotPasswordRequest.findById(id).session(
      session
    );

    if (!forgotpassrequest || forgotpassrequest.isActive !== true) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ msg: "Invalid or expired link", success: false });
    }

    forgotpassrequest.isActive = false;
    await forgotpassrequest.save({ session });

    const user = await User.findById(forgotpassrequest.userId).session(session);

    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ msg: "Password successfully updated", success: true });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = {
  sendResetLink,
  resetPass,
  updatePass,
};
