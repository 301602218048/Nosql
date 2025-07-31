const express = require("express");
const {
  addProduct,
  findProductById,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getProduct/:id", findProductById);
router.delete("/deleteProduct/:id", deleteProduct);
router.patch("/updateProduct/:id", updateProduct);
router.get("/getAllProduct/:id", getAllProduct);

module.exports = router;
