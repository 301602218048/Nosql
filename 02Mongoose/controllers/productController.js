const Product = require("../models/product");

const addProduct = async (req, res) => {
  const product = req.body;

  try {
    const newProduct = new Product({
      title: product.title,
      price: product.price,
      description: product.description,
      image: product.image,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product registered successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

const findProductById = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findOne({
      _id: productId,
    });

    res.status(201).json({
      message: "Product find successfully",
      product: product,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

const deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.deleteOne({
      _id: productId,
    });

    res.status(201).json({
      message: "Product deleted successfully",
      product: product,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const product = req.body;

  try {
    const newProduct = await Product.updateOne(
      {
        _id: productId,
      },
      { $set: { price: product.price } }
    );

    res.status(201).json({
      message: "Product updated successfully",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error",
      error: error.message,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const product = await Product.find();

    res.status(201).json({
      message: "Product find successfully",
      product: product,
    });
  } catch (error) {
    res.status(201).json({
      message: "Error",
      error: error,
    });
  }
};

module.exports = {
  addProduct,
  findProductById,
  deleteProduct,
  updateProduct,
  getAllProduct,
};
