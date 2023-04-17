const Skill = require("../models/skill_model");

//#region Gestion des compétences

exports.createSkill = async (req, res) => {
  const newSkill = new Skill(req.body);

  newSkill
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

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

exports.getSkills = async (req, res) => {
  const limit = 10;
  const skip = req.query.page * limit;
  Skill.find({}, {}, { skip, limit })
    .then((data) => {
      if (data.length <= 0) {
        return res
          .status(404)
          .send({ message: "Aucune compétence trouvée à cette page" });
      }
      res.status(200).send(data.map((d) => d.name));
    })
    .catch((err) => res.status(400).send(err));
};

exports.getAllSkills = async (req, res) => {
  Skill.find({})
    .then((data) => {
      if (data.length <= 0) {
        return res.status(404).send({ message: "Aucune compétence trouvée" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

//#endregion
