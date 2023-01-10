const User = require("../models/user_model");
const Freelance = require("../models/freelance_model");
const Skill = require("../models/skill_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const { message } = require("../middlewares/validators/registerValidator");

exports.freelanceRegister = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    address,
    city,
    zipCode,
    phoneNumber,
    dailyPrice,
    yearlyExperience,
    skills,
  } = req.body;

  const dbSkills = await Skill.find({ name: { $in: skills } });
  const skillIDs = dbSkills.map((s) => s.id);

  const newUser = new User({
    firstname,
    lastname,
    email,
    password: bcrypt.hashSync(req.body.password, saltRounds),
    address,
    city,
    zipCode,
    phoneNumber,
  });

  const newFreelance = new Freelance({
    dailyPrice,
    yearlyExperience,
    skills: skillIDs,
  });

  newUser
    .save()
    .then((data) => {
      newFreelance.user = data._id;
      newFreelance
        .save()
        .then(res.status(200).send({ message: { newUser, newFreelance } }));
    })
    .catch((err) => res.status(400).send(err));
};

exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: "Aucun utilisateur trouvé",
      });
    }

    console.log(req.body.password);
    let passwordValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordValid) {
      return res.status(401).send();
    }

    let token = jwt.sign(
      { userID: user._id, isAdmin: user.isAdmin },
      process.env.PRIVATEKEY
    );
    res.send({
      token: token,
      message: "User Logged",
    });
  });
};
