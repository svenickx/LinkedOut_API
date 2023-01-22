const express = require("express");
const router = express.Router();
const missionController = require("../controllers/mission.controller");
const isCompany = require("../middlewares/isCompany");
const hasToken = require("../middlewares/hasToken");

router.post(
  "/createMission",
  hasToken,
  isCompany,
  missionController.createMission
);
router.put(
  "/updateMission",
  hasToken,
  isCompany,
  missionController.updateMission
);
router.delete(
  "/deleteMission",
  hasToken,
  isCompany,
  missionController.deleteMission
);
router.get(
  "/getCurrentCompanyMissions",
  hasToken,
  isCompany,
  missionController.getCurrentCompanyMissions
);

module.exports = router;
