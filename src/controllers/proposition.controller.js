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

  if (!dbUser) {
    return res.status(401).send({
      message: "L'utilisateur est introuvable",
    });
  }

  if (dbUser.company) {
    return res.status(401).send({
      message:
        "Cet utilisateur ne peut pas être la cible d'une proposition car ce n'est pas un Freelance",
    });
  }

  const currentMission = await Mission.findById(mission).populate("company");
  if (currentMission.status == "Confirmed") {
    return res.status(400).send({
      message:
        "Cette mission a déjà été accepté par un Freelance. Il n'est plus possible de la proposer à d'autres Freelances",
    });
  }

  const currentPropositions = await Proposition.find({
    mission: currentMission,
    status: "En attente",
  });

  if (currentPropositions.length >= 3) {
    return res.status(401).send({
      message:
        "Cette mission possède déjà 3 propositions en attente à des Freelances, veuillez supprimer l'une des propositions ou attendre la réponse d'un des Freelances",
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
    return Proposition.updateOne(
      {
        user: req.userToken.userID,
        mission,
      },
      { status: "Refusé" }
    )
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

  if (currentPropositions.length <= 0) {
    return res
      .status(404)
      .send({ message: "Aucune proposition n'a été trouvé" });
  }

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

  currentMission.status = "En cours";
  await Mission.findByIdAndUpdate(currentMission._id, currentMission);

  HandlePropositionMail(
    companyRecruiter.email,
    currentUser.firstname,
    currentMission.title,
    true
  );

  return res.status(200).send(proposition);
};

// Récupère les propositions de l'utilisateur actuellement connecté
exports.getCurrentUserPropositions = async (req, res) => {
  Proposition.find({ user: req.userToken.userID })
    .populate("company")
    .populate([
      { path: "mission", populate: [{ path: "job" }, { path: "skills" }] },
    ])
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: "Aucune proposition trouvée" });
      }
      res.status(200).send(data);
    })
    .catch((err) => res.status(400).send(err));
};

// Récupère les propositions de l'utilisateur actuellement connecté
exports.getCurrentCompanyPropositions = async (req, res) => {
  const companyMissions = await Mission.find({ company: req.companyID });

  if (companyMissions.length <= 0) {
    return res.status(404).send({
      message:
        "Aucune propositions à récupérer car l'entreprise n'a pas de mission",
    });
  }

  const propositions = await Proposition.find({
    mission: { $in: companyMissions.map((m) => m._id) },
  })
    .populate("company")
    .populate("user")
    .populate([
      { path: "mission", populate: [{ path: "job" }, { path: "skills" }] },
    ]);

  if (propositions.length <= 0) {
    return res.status(404).send({
      message: "Aucune proposition pour les missions récupérées",
    });
  }

  res.status(200).send(propositions);
};
