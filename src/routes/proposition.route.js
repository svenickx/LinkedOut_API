const express = require("express");
const router = express.Router();
const propositionController = require("../controllers/proposition.controller");
const isCompany = require("../middlewares/isCompany");
const isFreelance = require("../middlewares/isFreelance");
const hasToken = require("../middlewares/hasToken");

router.post(
  "/createProposition",
  hasToken,
  isCompany,
  propositionController.createProposition
);
router.post(
  "/handleProposition",
  hasToken,
  isFreelance,
  propositionController.handleProposition
);
router.get(
  "/getCurrentUserPropositions",
  hasToken,
  isFreelance,
  propositionController.getCurrentUserPropositions
);
router.get(
  "/getCurrentCompanyPropositions",
  hasToken,
  isCompany,
  propositionController.getCurrentCompanyPropositions
);

module.exports = router;
