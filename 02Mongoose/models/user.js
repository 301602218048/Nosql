const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    cart: {
      items: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addToCart = async function (productId) {
  const index = this.cart.items.findIndex(
    (item) => item.productId.toString() === productId.toString()
  );

  if (index !== -1) {
    this.cart.items[index].quantity += 1;
  } else {
    this.cart.items.push({
      productId,
      quantity: 1,
    });
  }

  return await this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
