const Freelance = require("../models/freelance_model");
const User = require("../models/user_model");
const Skill = require("../models/skill_model");
const Job = require("../models/job_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Retourne les Freelances selon les paramètres par défaut ou passé dans la requêtes
exports.getFreelances = async (req, res) => {
  const { minPrice, maxPrice, s, minExp, maxExp } = req.query;

  const filters = [
    { dailyPrice: { $gte: minPrice ?? 0 } },
    { dailyPrice: { $lte: maxPrice ?? 9999 } },
    { yearlyExperience: { $gt: minExp ?? 0 } },
    { yearlyExperience: { $lt: maxExp ?? 50 } },
  ];
  let skillIDs = [];
  if (s) {
    const skillsSearch = s.split(",");
    const dbSkills = await Skill.find({ name: { $in: skillsSearch } });
    skillIDs = dbSkills.map((s) => s.id);

    filters.push({ skills: { $all: skillIDs } });
  }

  const allFreelances = await Freelance.find({
    $and: filters,
  })
    .populate("user")
    .populate("skills")
    .populate("jobs");

  res.status(200).send(allFreelances);
};

// Retourne les Freelances qui match la recherche passé en paramètre
exports.search = async (req, res) => {
  const { s } = req.query;
  const keyWords = s.split(" ");

  try {
    const dbSkills = await Skill.find({ name: { $in: keyWords } });
    const dbJobs = await Job.find({ name: { $in: keyWords } });

    let searchOption =
      dbSkills.length > 0 ? { skills: { $in: dbSkills.map((s) => s.id) } } : {};

    searchOption =
      dbJobs.length > 0
        ? { ...searchOption, jobs: { $in: dbJobs.map((j) => j.id) } }
        : { ...searchOption };

    let freelances = await Freelance.find({ $or: [{ ...searchOption }] })
      .populate("jobs")
      .populate("skills")
      .populate("user");

    // Au cas où certains freelances n'auraient plus d'utilisateur affilié
    freelances = freelances.filter((fr) => fr.user);

    // calcul un score en fonction des paramètres recherchés
    freelances.forEach((fr) => {
      fr.searchScore = 0;
      if (keyWords.includes(fr.user.city)) {
        fr.searchScore++;
      }
      if (keyWords.includes(fr.user.zipCode)) {
        fr.searchScore++;
      }
      if (
        keyWords.includes(fr.user.firstname) ||
        keyWords.includes(fr.user.lastname)
      ) {
        fr.searchScore++;
      }
    });

    // trie en fonction de la pertinence de la recherche et des résultats trouvés
    freelances.sort((a, b) => b.searchScore - a.searchScore);

    if (
      dbSkills.map((s) => s.id).length == 0 &&
      dbJobs.map((s) => s.id).length == 0
    ) {
      // filtre ceux qui n'ont pas eu de similitude avec la recherche
      freelances = freelances.filter((fr) => fr.searchScore > 0);
    }

    res.status(200).send(freelances);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Mise à jour du profil de l'utilisateur connecté
exports.updateProfile = async (req, res) => {
  const { firstname, lastname, email, address, city, zipCode, phoneNumber } =
    req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.userToken.userID,
      {
        firstname,
        lastname,
        email,
        address,
        city,
        zipCode,
        phoneNumber,
      },
      { new: true }
    );

    if (!user.company) {
      const { dailyPrice, yearlyExperience, skills, jobs } = req.body;

      const freelancer = await Freelance.findOne({ user: user._id });
      freelancer.dailyPrice = dailyPrice ?? freelancer.dailyPrice;
      freelancer.yearlyExperience =
        yearlyExperience ?? freelancer.yearlyExperience;
      if (skills) {
        const dbSkills = await Skill.find({ name: { $in: skills } });
        const skillIDs = dbSkills.map((s) => s.id);
        freelancer.skills = skillIDs;
      }
      if (jobs) {
        const dbJobs = await Job.find({ name: { $in: jobs } });
        const jobIDs = dbJobs.map((s) => s.id);
        freelancer.jobs = jobIDs;
      }

      const freelancerUpdated = await Freelance.updateOne(
        { user: user._id },
        freelancer,
        { new: true }
      );

      freelancerUpdated.user = user;
      return res.status(200).send(freelancerUpdated);
    }

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Changement du mot de passe de l'utilisateur connecté
exports.changePassword = async (req, res) => {
  try {
    const password = bcrypt.hashSync(req.body.newPassword, saltRounds);
    await User.updateOne({ id: req.userToken.userID }, { password });

    res.status(200).send({ passwordChanged: true });
  } catch (err) {
    res.status(400).send({ passwordChanged: false, err });
  }
};

// Change le mot de passe de l'utilisateur dont le mail est passé en body
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res
        .status(404)
        .send({ message: "Aucun utilisateur trouvé avec cet adresse email" });
    }

    let p = (Math.random() + 1).toString(36).substring(2);
    const password = bcrypt.hashSync(p, saltRounds);

    await User.findByIdAndUpdate(user._id, { password });

    ResetPasswordMail(user.email, p);
    res.status(200).send({
      message:
        "Le mot de passe a été reinitialisé, veuillez consulter votre boite mail",
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Récupère l'utilisateur connecté
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userToken.userID);
    if (!user) {
      res.status(404).send({ message: "Aucun utilisateur trouvé" });
      return;
    }
    delete user.password;
    const freelance = await Freelance.findOne({ user: user._id });
    if (!freelance) {
      res.status(200).send(user);
      return;
    }
    res.status(200).send({ user, freelance });
  } catch (err) {
    res.status(400).send(err);
  }
};

// Récupère l'utilisateur
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.query.id).populate("company");
    if (!user) {
      res.status(404).send({ message: "Aucun utilisateur trouvé" });
      return;
    }
    delete user.password;
    const freelance = await Freelance.findOne({ user: user._id })
      .populate("jobs")
      .populate("skills");
    if (!freelance) {
      res.status(200).send({ user });
      return;
    }
    res.status(200).send({ user, freelance });
  } catch (err) {
    res.status(400).send(err);
  }
};
