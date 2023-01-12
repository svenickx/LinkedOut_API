const User = require("../models/user_model");
const Freelance = require("../models/freelance_model");
const Skill = require("../models/skill_model");
const Company = require("../models/company_model");
const Job = require("../models/job_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

// Inscription d'un utilisateur en Freelance
exports.freelanceRegister = async (req, res) => {
  const dbSkills = await Skill.find({ name: { $in: req.body.skills } });
  const skillIDs = dbSkills.map((s) => s.id);

  const dbJobs = await Job.find({ name: { $in: req.body.jobs } });
  const jobIDs = dbJobs.map((j) => j.id);

  const newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, saltRounds);

  const newFreelance = new Freelance(req.body);
  newFreelance.skills = skillIDs;
  newFreelance.jobs = jobIDs;

  newUser
    .save()
    .then((data) => {
      newFreelance.user = data._id;
      newFreelance
        .save()
        .then(res.status(200).send({ message: { newUser, newFreelance } }))
        .catch(res.status(400).send());
    })
    .catch((err) => res.status(400).send(err));
};

// Inscription d'un utilisateur lié à une entreprise
exports.recruiterRegister = async (req, res) => {
  const company = await Company.findOne({ name: req.body.companyName });
  if (!company) {
    return res.status(404).send({
      message: `${companyName} not found, please create company first`,
    });
  }

  const newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, saltRounds);
  newUser.company = company._id;

  newUser
    .save()
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

// Connexion
exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      message: "Aucun utilisateur trouvé",
    });
  }

  let passwordValid = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordValid) {
    return res.status(401).send();
  }

  let token = jwt.sign(
    { userID: user._id, isAdmin: user.isAdmin },
    process.env.PRIVATEKEY
  );
  res.send({
    token: token,
    message: "User Logged",
  });
};
