const express = require("express");
const {
  addProduct,
  findProductById,
} = require("../controllers/productController");

const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getProduct/:id", findProductById);

module.exports = router;
