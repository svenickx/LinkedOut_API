const Skill = require("../models/skill_model");

// Créé une nouvelle compétence
exports.createSkill = async (req, res) => {
  const newSkill = new Skill(req.body);

  newSkill
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};
