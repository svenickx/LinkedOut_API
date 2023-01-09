const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.get("/getFreelances", verifyAdmin, userController.getFreelances);

module.exports = router;
