const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyRegister = require("../middlewares/verifyRegister");
const verifyLogin = require("../middlewares/verifyLogin");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.post("/login", verifyLogin, authController.login);

router.post(
  "/freelanceRegister",
  verifyRegister,
  authController.freelanceRegister
);
router.post("/recruiterRegister", authController.recruiterRegister);
router.post("/companyCreation", authController.companyCreation);

module.exports = router;
