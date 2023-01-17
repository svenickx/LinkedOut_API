const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const hasToken = require("../middlewares/hasToken");

router.get("/getFreelances", userController.getFreelances);
router.get("/search", userController.search);
router.put("/updateProfile", hasToken, userController.updateProfile);
router.put("/changePassword", hasToken, userController.changePassword);
router.post("/resetPassword", hasToken, userController.resetPassword);

module.exports = router;
