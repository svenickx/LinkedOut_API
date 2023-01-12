const express = require("express");
const router = express.Router();
const propositionController = require("../controllers/proposition.controller");
const verifyCompany = require("../middlewares/verifyCompany");
const verifyFreelance = require("../middlewares/verifyFreelance");
const verifyToken = require("../middlewares/verifyToken");

router.post(
  "/createProposition",
  verifyToken,
  verifyCompany,
  propositionController.createProposition
);
router.post(
  "/handleProposition",
  verifyToken,
  verifyFreelance,
  propositionController.handleProposition
);

module.exports = router;
