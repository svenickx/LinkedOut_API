const Mission = require("../models/mission_model");
const Proposition = require("../models/proposition_model");
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
  newMission.status = "Pending";

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

exports.getPendingCompanyMissions = async (req, res) => {
  try {
    let missions = await Mission.find({
      company: req.companyID,
      status: "Pending",
    })
      .populate("company")
      .populate("job")
      .populate("skills");

    if (missions.length < 0) {
      return res.status(200).send(missions);
    }

    let propositions = await Proposition.find({
      mission: { $in: missions.map((m) => m._id) },
      company: req.companyID,
    });

    if (propositions.length < 1) {
      return res.status(200).send(missions);
    }

    // Retire les missions qui ont 3 propositions
    const missionMaxProposed = [];
    const propositionsCount = propositions.reduce(
      (prev, curr) => ((prev[curr.mission] = ++prev[curr.mission] || 1), prev)
    );
    for (const key in propositionsCount) {
      if (propositionsCount[key] >= 3) {
        missionMaxProposed.push(key);
      }
    }

    missions = missions.filter(
      (m) => !missionMaxProposed.some((id) => m._id.equals(id))
    );

    if (!req.params.userID) {
      return res.status(200).send(missions);
    }

    propositions = propositions.filter((p) => p.user == req.params.userID);
    propositions = propositions.map((p) => p.mission._id);
    // Retire les missions qui ont déjà été proposé à l'utilisateur
    missions = missions.filter(
      (m) => !propositions.some((p) => p.equals(m._id))
    );
    return res.status(200).send(missions);
  } catch (err) {
    console.error(err);
  }
};

exports.getFreelanceMission = async (req, res) => {
  Mission.find({ user: req.userToken.userID })
    .populate("company")
    .populate("job")
    .populate("skills")
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Aucune mission trouvée" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};
