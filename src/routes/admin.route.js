const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const hasToken = require("../middlewares/hasToken");
const isAdmin = require("../middlewares/isAdmin");

// User
router.delete("/deleteUser", hasToken, isAdmin, adminController.deleteUser);
router.put("/updateUser", hasToken, isAdmin, adminController.updateUser);
router.get("/getUsers", hasToken, isAdmin, adminController.getUsers);

// Retourne un freelance avec toutes ses missions
router.get(
  "/getFreelanceMissions",
  hasToken,
  isAdmin,
  adminController.getFreelanceMissions
);

module.exports = router;
