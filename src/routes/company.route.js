const express = require("express");
const router = express.Router();
const companyController = require("../controllers/company.controller");
const hasToken = require("../middlewares/hasToken");
const isAdmin = require("../middlewares/isAdmin");

// Récupère toutes les entreprises
router.get(
  "/getAllCompanies",
  hasToken,
  isAdmin,
  companyController.getAllCompanies
);

// Recherche d'entreprises
router.get("/search", companyController.search);

router.post("/companyCreation", companyController.companyCreation);

module.exports = router;
