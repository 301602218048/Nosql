const Users = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "Email already exists", success: false });
    }

    const saltRounds = 10;
    const hashpass = await bcrypt.hash(password, saltRounds);

    await Users.create({
      name,
      email,
      password: hashpass,
    });

    res.status(201).json({ msg: "Signed up successfully", success: true });
  } catch (error) {
    console.error("Add user failed:", error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found", success: false });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res
        .status(400)
        .json({ msg: "Password is incorrect", success: false });
    }

    const token = jwt.sign(
      { userId: user._id, premium: user.isPremiumUser, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res
      .status(200)
      .json({ msg: "Logged in successfully", success: true, token });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ msg: error.message, success: false });
  }
};

module.exports = {
  addUser,
  userLogin,
};
