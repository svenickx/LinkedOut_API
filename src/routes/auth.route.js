const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const verifyFreelanceRegister = require("../middlewares/verifyFreelanceRegister");
const verifyRecruiterRegister = require("../middlewares/verifyRecruiterRegister");
const verifyLogin = require("../middlewares/verifyLogin");
const isNotLogged = require("../middlewares/isNotLogged");

router.post("/login", isNotLogged, verifyLogin, authController.login);

router.post(
  "/freelanceRegister",
  isNotLogged,
  verifyFreelanceRegister,
  authController.freelanceRegister
);
router.post(
  "/recruiterRegister",
  isNotLogged,
  verifyRecruiterRegister,
  authController.recruiterRegister
);
router.post("/companyCreation", authController.companyCreation);

module.exports = router;
