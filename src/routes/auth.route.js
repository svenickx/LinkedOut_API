const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
// const verifyAdmin = require("../middlewares/verifyAdmin");
// const verifyToken = require("../middlewares/verifyToken");
const verifyRegister = require("../middlewares/verifyRegister");
const verifyLogin = require("../middlewares/verifyLogin");

router.post(
  "/freelanceRegister",
  verifyRegister,
  authController.freelanceRegister
);
// router.post("/recruiterRegister", verifyRegister, authController.register);
// router.post("/companyCreation", verifyRegister, authController.register);

router.post("/login", verifyLogin, authController.login);
// router.get("/getUser", verifyToken, authController.getUser);
// router.get(
//   "/getAllUsers",
//   [verifyToken, verifyAdmin],
//   authController.getAllUsers
// );
// router.put("/updateUserById", authController.updateUserById);

module.exports = router;
