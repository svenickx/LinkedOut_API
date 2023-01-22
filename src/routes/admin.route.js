const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const hasToken = require("../middlewares/hasToken");
const isAdmin = require("../middlewares/isAdmin");

// User
router.delete("/deleteUser", hasToken, isAdmin, adminController.deleteUser);
router.put("/updateUser", hasToken, isAdmin, adminController.updateUser);
router.get("/getUsers", hasToken, isAdmin, adminController.getUsers);

// Skill
router.post("/createSkill", hasToken, isAdmin, adminController.createSkill);
router.put("/updateSkill", hasToken, isAdmin, adminController.updateSkill);
router.delete("/deleteSkill", hasToken, isAdmin, adminController.deleteSkill);
router.get("/getSkills", hasToken, isAdmin, adminController.getSkills);

// Job
router.post("/createJob", hasToken, isAdmin, adminController.createJob);
router.put("/updateJob", hasToken, isAdmin, adminController.updateJob);
router.delete("/deleteJob", hasToken, isAdmin, adminController.deleteJob);
router.get("/getJobs", hasToken, isAdmin, adminController.getJobs);

// Retourne un freelance avec toutes ses missions
router.get(
  "/getFreelanceMissions",
  hasToken,
  isAdmin,
  adminController.getFreelanceMissions
);

// Récupère toutes les entreprises
router.get(
  "/getAllCompanies",
  hasToken,
  isAdmin,
  adminController.getAllCompanies
);

module.exports = router;
