const express = require("express");
const {
  addCart,
  findCartById,
  deleteCartitem,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/addCart/:id", addCart);
router.get("/getCart/:id", findCartById);
router.delete("/deleteCartItem/:id", deleteCartitem);

module.exports = router;
