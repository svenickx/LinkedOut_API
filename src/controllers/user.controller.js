const Freelance = require("../models/freelance_model");
const User = require("../models/user_model");
const Skill = require("../models/skill_model");
const Job = require("../models/job_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Retourne les Freelances selon les paramètres par défaut ou passé dans la requêtes
exports.getFreelances = async (req, res) => {
  const { minPrice, maxPrice, s, minExp, maxExp } = req.query;

  const skillsSearch = s.split(",");
  const dbSkills = await Skill.find({ name: { $in: skillsSearch } });
  const skillIDs = dbSkills.map((s) => s.id);

  const allFreelances = await Freelance.find({
    $and: [
      { dailyPrice: { $gt: minPrice ?? 0 } },
      { dailyPrice: { $lt: maxPrice ?? 9999 } },
      { skills: { $in: skillIDs } },
      { yearlyExperience: { $gt: minExp ?? 0 } },
      { yearlyExperience: { $lt: maxExp ?? 50 } },
    ],
  })
    .populate("user")
    .populate("skills");

  res.status(200).send(allFreelances);
};

// Retourne les Freelances qui match la recherche passé en paramètre
exports.search = async (req, res) => {
  const { s } = req.query;

  const keyWords = s.split(" ");
  const dbSkills = await Skill.find({ name: { $in: keyWords } });
  const skillIDs = dbSkills.map((s) => s.id);

  try {
    let freelances = null;

    if (skillIDs.length > 0) {
      freelances = await Freelance.find({
        skills: { $in: skillIDs },
      })
        .populate("user")
        .populate("skills")
        .populate("jobs");
    } else {
      freelances = await Freelance.find()
        .populate("user")
        .populate("skills")
        .populate("jobs");
    }

    const freelancesFiltered = freelances.filter((fr) => {
      if (
        keyWords.includes(fr.user.city) ||
        keyWords.includes(fr.user.zipCode.toString()) ||
        keyWords.includes(fr.user.firstname) ||
        keyWords.includes(fr.user.lastname) ||
        keyWords.includes(fr.job.name)
      ) {
        return fr;
      }
    });

    res.status(200).send(freelancesFiltered);
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
    let p = (Math.random() + 1).toString(36).substring(2);
    const password = bcrypt.hashSync(p, saltRounds);

    await User.updateOne({ email: req.body.email }, { password });

    res.status(200).send({ newPassword: p });
  } catch (err) {
    res.status(400).send(err);
  }
};
