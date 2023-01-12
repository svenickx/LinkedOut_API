const Mission = require("../models/mission_model");
const Job = require("../models/job_model");
const Skill = require("../models/skill_model");

// Créé une nouvelle mission
exports.createMission = async (req, res) => {
  const dbJob = await Job.findOne({ name: req.body.job });
  const dbSkills = await Skill.find({ name: { $in: req.body.skills } });
  const skillIDs = dbSkills.map((s) => s.id);

  const newMission = new Mission(req.body);
  newMission.job = dbJob._id;
  newMission.skills = skillIDs;

  newMission
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

// Met à jour une mission existante
exports.updateMission = async (req, res) => {
  const dbSkills = await Skill.find({ name: { $in: req.body.skills } });
  const skillIDs = dbSkills.map((s) => s.id);
  const dbJob = await Job.findOne({ name: req.body.job });

  const mission = new Mission(req.body);
  mission.skills = skillIDs;
  mission.job = dbJob._id;

  const missionUpdated = await Mission.findByIdAndUpdate(mission._id, mission, {
    new: true,
  });

  res.status(200).send(missionUpdated);
};
