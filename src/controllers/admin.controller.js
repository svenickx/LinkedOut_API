const User = require("../models/user_model");
const Skill = require("../models/skill_model");
const Job = require("../models/job_model");
const Proposition = require("../models/proposition_model");
const Mission = require("../models/mission_model");

exports.deleteUser = async (req, res) => {
  User.findByIdAndDelete(req.body.user)
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ message: "Aucun utilisateur trouvé avec cet ID" });
      }
      res.status(200).send({ message: "L'utilisateur a bien été supprimé" });
    })
    .catch((err) => res.status(400).send(err));
};
exports.updateUser = async (req, res) => {
  User.findByIdAndUpdate(req.body.user, req.body, { new: true })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};
exports.getUsers = async (req, res) => {
  const limit = 3;
  const skip = req.query.page * limit;
  User.find({}, {}, { skip, limit })
    .then((data) => {
      if (data.length <= 0) {
        return res
          .status(404)
          .send({ message: "Aucun utilisateur trouvé à cette page" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

// Créé une nouvelle compétence
exports.createSkill = async (req, res) => {
  const newSkill = new Skill(req.body);

  newSkill
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};
// Modifie une compétence
exports.updateSkill = async (req, res) => {
  Skill.findOneAndUpdate(
    { name: req.body.name },
    { name: req.body.newName },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `La compétence ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};
// Supprime une compétence
exports.deleteSkill = async (req, res) => {
  Skill.findOneAndDelete({ name: req.body.name })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `La compétence ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send({ message: "la compétence a bien été supprimé" });
    })
    .catch((err) => res.status(400).send(err));
};
// Récupère des compétences
exports.getSkills = async (req, res) => {
  const limit = 3;
  const skip = req.query.page * limit;
  Skill.find({}, {}, { skip, limit })
    .then((data) => {
      if (data.length <= 0) {
        return res
          .status(404)
          .send({ message: "Aucune compétence trouvée à cette page" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

// Créé un nouveau métier
exports.createJob = async (req, res) => {
  const newJob = new Job(req.body);

  newJob
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};
// Modifie une métier
exports.updateJob = async (req, res) => {
  Job.findOneAndUpdate(
    { name: req.body.name },
    { name: req.body.newName },
    { new: true }
  )
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `Le métier ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};
// Supprime une métier
exports.deleteJob = async (req, res) => {
  Job.findOneAndDelete({ name: req.body.name })
    .then((data) => {
      if (!data) {
        return res.status(404).send({
          message: `La métier ${req.body.name} n'a pas été trouvé`,
        });
      }
      res.status(200).send({ message: "le métier a bien été supprimé" });
    })
    .catch((err) => res.status(400).send(err));
};
// Récupère des métiers
exports.getJobs = async (req, res) => {
  const limit = 3;
  const skip = req.query.page * limit;
  Job.find({}, {}, { skip, limit })
    .then((data) => {
      if (data.length <= 0) {
        return res
          .status(404)
          .send({ message: "Aucun métier trouvé à cette page" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

exports.getFreelanceMissions = async (req, res) => {
  let user;
  if (req.query.userID) {
    user = await User.findById(req.query.userID);
  } else {
    user = await User.findOne({ email: req.query.userEmail });
  }

  if (!user) {
    return res.status(404).send({ message: "Aucun utilisateur trouvé" });
  }

  const propositions = await Proposition.find({ user: user._id })
    .populate([
      { path: "mission", populate: [{ path: "job" }, { path: "skills" }] },
    ])
    .populate("company");

  res.status(200).send({ user, propositions });
};
