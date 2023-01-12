const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const verifyCompany = require("../middlewares/verifyCompany");
const verifyToken = require("../middlewares/verifyToken");

router.post(
  "/createMission",
  verifyToken,
  verifyCompany,
  missionController.createMission
);
router.put(
  "/updateMission",
  verifyToken,
  verifyCompany,
  missionController.updateMission
);

module.exports = router;
