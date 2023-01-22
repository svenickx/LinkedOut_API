const Mission = require("../models/mission_model");
const Job = require("../models/job_model");
const Skill = require("../models/skill_model");

// Créé une nouvelle mission
exports.createMission = async (req, res) => {
  const dbJob = await Job.findOne({ name: req.body.job });
  const dbSkills = await Skill.find({ name: { $in: req.body.skills } });

  const newMission = new Mission(req.body);
  if (dbJob) {
    newMission.job = dbJob._id;
  }
  if (dbSkills) {
    newMission.skills = dbSkills.map((s) => s.id);
  }
  newMission.company = req.companyID;
  newMission.status = "En attente";

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

// supprime une mission existante
exports.deleteMission = async (req, res) => {
  Mission.findByIdAndDelete(req.body.mission)
    .then((data) => {
      if (!data) {
        return res
          .status(400)
          .send({ message: "Aucune mission correspondante trouvée" });
      }
      res.status(200).send({ message: "Mission supprimée" });
    })
    .catch((err) => res.status(400).send(err));
};

exports.getCurrentCompanyMissions = async (req, res) => {
  Mission.find({ company: req.companyID })
    .populate("company")
    .populate("job")
    .populate("skills")
    .then((data) => {
      if (!data) {
        return res
          .status(404)
          .send({ message: "Aucune mission trouvée pour votre entreprise" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};
