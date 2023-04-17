const User = require("../models/user_model");
const Proposition = require("../models/proposition_model");
const Company = require("../models/company_model");

// Récupère toutes les entreprises
exports.getAllCompanies = async (req, res) => {
  Company.find()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

// Recherche d'entreprises
exports.search = async (req, res) => {
  Company.find(
    { name: { $regex: req.query.name, $options: "i" } },
    {},
    { skip: 0, limit: 10 }
  )
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

// Création d'une entreprise
exports.companyCreation = async (req, res) => {
  const newCompany = new Company(req.body);

  newCompany
    .save()
    .then((data) => res.status(200).send({ data }))
    .catch((err) => res.status(400).send({ err }));
};
