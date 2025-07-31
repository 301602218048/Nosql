const express = require("express");
const { addCart, deleteCartItem } = require("../controllers/cartController");

const router = express.Router();

router.post("/addCart/:id", addCart);
router.delete("/deleteCartItem/:id", deleteCartItem);
// router.get("/getCart/:id", findCartById);

module.exports = router;
