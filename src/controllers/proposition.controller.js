const Proposition = require("../models/proposition_model");
const User = require("../models/user_model");
const Company = require("../models/company_model");
const Mission = require("../models/mission_model");
const { findById } = require("../models/mission_model");
const CreatePropositionMail = require("../config/mail/templates/createProposition");
const HandlePropositionMail = require("../config/mail/templates/handleProposition");

// Créé une nouvelle proposition à destination d'un utilisateur Freelance
exports.createProposition = async (req, res) => {
  const { user, mission } = req.body;

  const dbUser = await User.findById(user);
  if (dbUser.company) {
    return res.status(401).send({
      message:
        "Cet utilisateur ne peut pas être la cible d'une proposition car ce n'est pas un freelancer",
    });
  }

  const currentMission = await Mission.findById(mission).populate("company");
  if (currentMission.status == "Confirmed") {
    return res.status(400).send({
      message:
        "Cette mission a déjà été accepté par un Freelance. Il n'est plus possible de la proposer à d'autres Freelance",
    });
  }

  const currentPropositions = await Proposition.find({
    mission: currentMission,
  });

  if (currentPropositions.length >= 3) {
    return res.status(401).send({
      message:
        "Cette mission possède déjà 3 propositions à des Freelances, veuillez supprimer l'une des propositions ou attendre la réponse d'un des Freelances",
    });
  }

  const currentUserProposition = currentPropositions.filter(
    (p) => p.user.toString() == user && p.mission.toString() == mission
  );

  if (currentUserProposition.length > 0) {
    return res.status(401).send({
      message: "Cet utilisateur a déjà une proposition pour cette mission",
    });
  }

  const newProposition = new Proposition({
    company: currentMission.company,
    user: dbUser._id,
    mission: currentMission._id,
    status: "En attente",
  });

  newProposition
    .save()
    .then((data) => {
      CreatePropositionMail(dbUser.email, currentMission);
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

// Acceptation ou refus de la proposition par le Freelance
exports.handleProposition = async (req, res) => {
  const { mission, accepted } = req.body;

  const currentUser = await User.findById(req.userToken.userID);
  const currentMission = await Mission.findById(mission).populate("company");
  const companyRecruiter = await User.findOne({ company: mission.company });

  if (!accepted) {
    return Proposition.deleteOne({
      user: req.userToken.userID,
      mission,
    })
      .then((data) => {
        HandlePropositionMail(
          companyRecruiter.email,
          currentUser.firstname,
          currentMission.title,
          false
        );
        res.status(200).send(data);
      })
      .catch((err) => res.status(400).send(err));
  }

  const currentPropositions = await Proposition.find({
    mission,
  });

  if (!currentPropositions.some((p) => p.user._id == req.userToken.userID)) {
    return res.status(404).send({
      message:
        "Vous ne pouvez pas accepter une mission qui ne vous pas été proposé",
    });
  }

  if (currentPropositions.some((p) => p.status == "Accepted")) {
    return res.status(400).send({
      message:
        "Cette proposition n'est plus disponible car elle a déjà été accepté par un Freelance",
    });
  }

  const proposition = currentPropositions.map(async (p) => {
    p.status = p.user == req.userToken.userID ? "Accepted" : "Rejected";
    await Proposition.findByIdAndUpdate(p._id, p);
    if (p.user == req.userToken.userID) {
      return p;
    }
  });

  currentMission.status = "Confirmed";
  await Mission.findByIdAndUpdate(currentMission._id, currentMission);

  HandlePropositionMail(
    companyRecruiter.email,
    currentUser.firstname,
    currentMission.title,
    true
  );

  return res.status(200).send(proposition);
};
