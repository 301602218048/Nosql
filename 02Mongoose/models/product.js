const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productModel);

module.exports = Product;
