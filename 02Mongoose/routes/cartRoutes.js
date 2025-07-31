const express = require("express");
const addCart = require("../controllers/cartController");

const router = express.Router();

router.post("/addCart/:id", addCart);
// router.get("/getCart/:id", findCartById);

module.exports = router;
