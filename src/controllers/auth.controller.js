const User = require("../models/user_model");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");

exports.register = (req, res) => {
  const { firstname, lastname, email, address, city, zipCode, phoneNumber } =
    req.body;
  const hash = bcrypt.hashSync(req.body.password, saltRounds);

  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hash,
    address,
    city,
    zipCode,
    phoneNumber,
  });

  newUser
    .save()
    .then((data) => res.send(data))
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
