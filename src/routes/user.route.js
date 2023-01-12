const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken");

router.get("/getFreelances", userController.getFreelances);
router.get("/search", userController.search);
router.put("/updateProfile", verifyToken, userController.updateProfile);
router.put("/changePassword", verifyToken, userController.changePassword);
router.post("/resetPassword", userController.resetPassword);

module.exports = router;
