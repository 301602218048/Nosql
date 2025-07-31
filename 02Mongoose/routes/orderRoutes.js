const express = require("express");
const { addOrder, findOrderById } = require("../controllers/orderControllers");

const router = express.Router();

router.post("/addOrder/:id", addOrder);
router.get("/getOrder/:id", findOrderById);

module.exports = router;
