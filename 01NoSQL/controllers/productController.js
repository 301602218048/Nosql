const Product = require("../models/product");

const addProduct = async (req, res) => {
  try {
    const { title, price, desc, imageUrl, userId } = req.body;

    const newProduct = new Product(title, price, desc, imageUrl, userId);
    const result = await newProduct.save();

    const insertedProduct = await Product.findById(result.insertedId);

    res.json({ msg: "Product Added", product: insertedProduct });
  } catch (err) {
    console.error(" Error during DB operation:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

const findProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product fetched successfully", product });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Internal server error", error: err.message });
  }
};
module.exports = { addProduct, findProductById };
