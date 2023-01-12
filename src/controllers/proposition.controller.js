const Proposition = require("../models/proposition_model");
const User = require("../models/user_model");
const Company = require("../models/company_model");
const Mission = require("../models/mission_model");
const { findById } = require("../models/mission_model");

// Créé une nouvelle proposition à destination d'un utilisateur Freelance
exports.createProposition = async (req, res) => {
  const { company, user, mission } = req.body;

  const dbUser = await User.findById(user);
  if (dbUser.company) {
    return res.status(401).send({
      message:
        "This user cannot be the target of a proposition because he his not a freelancer",
    });
  }

  const dbCompany = await Company.findById(company);
  const dbMission = await Mission.findById(mission);

  const currentPropositions = await Proposition.find({
    mission: dbMission,
  });

  if (currentPropositions.length >= 3) {
    return res.status(401).send({
      message:
        "Already 3 propositions existing, please delete a proposition or wait for freelancers' response",
    });
  }

  const currentUserProposition = currentPropositions.filter(
    (p) => p.user.toString() == user && p.mission.toString() == mission
  );

  if (currentUserProposition.length > 0) {
    return res.status(401).send({
      message: "This user has already a proposition for this mission",
    });
  }

  const newProposition = new Proposition({
    company: dbCompany._id,
    user: dbUser._id,
    mission: dbMission._id,
    status: "En attente",
  });

  newProposition
    .save()
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

// Acceptation ou refus de la proposition faite à un Freelance par une entreprise
exports.handleProposition = async (req, res) => {
  const { mission, accepted } = req.body;

  if (!accepted) {
    return Proposition.deleteOne({
      user: req.userToken.userID,
      mission,
    })
      .then((data) => res.status(200).send(data))
      .catch((err) => res.status(400).send(err));
  }

  const currentPropositions = await Proposition.find({
    mission,
  });

  const isAlreadyAccepted = currentPropositions.some(
    (p) => p.status == "Accepted"
  );
  if (isAlreadyAccepted) {
    return res
      .status(401)
      .send({ message: "The proposition has already been accepted" });
  }

  const proposition = currentPropositions.map((p) => {
    p.status = p.user == req.userToken.userID ? "Accepted" : "Rejected";
    Proposition.findByIdAndUpdate(p._id, p);
    if (p.user == req.userToken.userID) {
      return p;
    }
  });

  return res.status(200).send(proposition);
};
