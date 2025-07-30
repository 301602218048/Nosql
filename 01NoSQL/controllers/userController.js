const User = require("../models/user");

const addUser = async (req, res) => {
  const user = req.body;

  const newUser = new User(user.name, user.email, user.phone, user.imageUrl);

  newUser
    .save()
    .then((res) => {
      const userId = res.insertedId;
      return User.findById(userId);
    })
    .then((user) => {
      console.log(" Found user by ID:", user);
      res.json({ msg: "User ADDED", user: user });
    })
    .catch((err) => {
      console.error(" Error during DB operation:", err);
    });
};

const findUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User fetched successfully", user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};
module.exports = { addUser, findUserById };
