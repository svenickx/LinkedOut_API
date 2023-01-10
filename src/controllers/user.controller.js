const Freelance = require("../models/freelance_model");
const User = require("../models/user_model");
const Skill = require("../models/skill_model");

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
