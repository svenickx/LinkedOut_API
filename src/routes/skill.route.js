const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skill.controller");
const verifyToken = require("../middlewares/verifyToken");
const verifyAdmin = require("../middlewares/verifyAdmin");

router.post(
  "/createSkill",
  verifyToken,
  verifyAdmin,
  skillController.createSkill
);

module.exports = router;
