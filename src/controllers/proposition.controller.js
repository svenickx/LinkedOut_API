const Proposition = require("../models/proposition_model");
const User = require("../models/user_model");
const Mission = require("../models/mission_model");

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

  let currentPropositions = await Proposition.find({
    mission: currentMission,
    $or: [{ status: "Pending" }, { status: "Refused" }],
  });

  const isAlreadyProposed = currentPropositions.some((p) => p.user._id == user);
  if (isAlreadyProposed) {
    return res.status(401).send({
      message:
        "Le Freelance a déjà une proposition lié à cette mission (En attente ou refusé)",
    });
  }

  currentPropositions = currentPropositions.filter(
    (p) => p.status == "Pending"
  );

  if (currentPropositions.length >= 3) {
    return res.status(401).send({
      message:
        "Cette mission possède déjà 3 propositions en attente à des Freelances, veuillez supprimer l'une des propositions ou attendre la réponse d'un des Freelances",
    });
  }

  const newProposition = new Proposition({
    company: currentMission.company,
    user: dbUser._id,
    mission: currentMission._id,
    status: "Pending",
  });

  newProposition
    .save()
    .then((data) => {
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
    return Proposition.findOneAndUpdate(
      {
        user: req.userToken.userID,
        mission,
        status: "Pending",
      },
      { status: "Refused" },
      { new: true }
    )
      .populate("company")
      .populate("user")
      .populate("mission")
      .then((data) => {
        if (!data) {
          return res.status(404).send({
            message: "La proprosition n'existe pas ou n'est plus disponible",
          });
        }

        // HandlePropositionMail(
        //   companyRecruiter.email,
        //   currentUser.firstname,
        //   currentMission.title,
        //   false
        // );
        res.status(200).send(data);
      })
      .catch((err) => res.status(400).send(err));
  }

  const currentPropositions = await Proposition.find({
    mission,
  });

  if (currentPropositions.length <= 0) {
    return res.status(404).send({
      message: "La proprosition n'existe pas ou n'est plus disponible",
    });
  }

  if (!currentPropositions.some((p) => p.user._id == req.userToken.userID)) {
    return res.status(404).send({
      message:
        "Vous ne pouvez pas accepter une mission qui ne vous pas été proposé",
    });
  }

  if (
    currentPropositions.some(
      (p) => p.status != "Pending" && p.user._id == req.userToken.userID
    )
  ) {
    return res.status(400).send({
      message: "Vous avez déjà répondu à cette proposition",
    });
  }

  if (currentPropositions.some((p) => p.status == "Accepted")) {
    return res.status(400).send({
      message:
        "Cette proposition n'est plus disponible car elle a déjà été accepté par un Freelance",
    });
  }

  const proposition = currentPropositions.map(async (p) => {
    p.status = p.user == req.userToken.userID ? "Accepted" : "Refused";
    await Proposition.findByIdAndUpdate(p._id, p);
    if (p.user == req.userToken.userID) {
      return p;
    }
  });

  currentMission.status = "Confirmed";
  await Mission.findByIdAndUpdate(currentMission._id, currentMission);

  // HandlePropositionMail(
  //   companyRecruiter.email,
  //   currentUser.firstname,
  //   currentMission.title,
  //   true
  // );

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
