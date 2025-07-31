const User = require("../models/user");

const addUser = async (req, res) => {
  const user = req.body;

  try {
    const newUser = new User({
      name: user.name,
      email: user.email,
      password: user.password,
      image: user.image,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

const findUserById = async (req, res) => {
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

module.exports = { addUser, findUserById };
