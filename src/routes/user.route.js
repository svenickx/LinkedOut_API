const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/getFreelances", userController.getFreelances);

module.exports = router;
