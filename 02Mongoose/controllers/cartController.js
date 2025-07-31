const User = require("../models/user");

const addCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.body._id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const updatedUser = await user.addToCart(productId);

    res.json({
      msg: "Product added to cart",
      cart: updatedUser.cart.items,
    });
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

module.exports = addCart;
