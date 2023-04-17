const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const hasToken = require("../middlewares/hasToken");
const isAdmin = require("../middlewares/isAdmin");

// Skill
router.post("/createSkill", hasToken, isAdmin, skillController.createSkill);
router.put("/updateSkill", hasToken, isAdmin, skillController.updateSkill);
router.delete("/deleteSkill", hasToken, isAdmin, skillController.deleteSkill);
router.get("/getSkills", skillController.getSkills);
router.get("/getAllSkills", skillController.getAllSkills);

module.exports = router;
