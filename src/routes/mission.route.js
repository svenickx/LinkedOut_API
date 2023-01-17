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

module.exports = router;
