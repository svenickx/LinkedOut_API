const User = require("../models/user_model");
const Proposition = require("../models/proposition_model");
const Company = require("../models/company_model");

//#region Gestion des utilisateurs

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
  const limit = 10;
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

//#endregion

//#region Autres

// Récupère les missions du freelance passé en paramètre (via email ou id)
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

//#endregion
