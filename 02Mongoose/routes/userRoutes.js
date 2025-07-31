const express = require("express");
const { addUser, findUserById } = require("../controllers/userController");

const router = express.Router();

router.post("/addUser", addUser);
router.get("/getUser/:id", findUserById);

module.exports = router;
