const User = require("../models/user_model");

const isFreelance = (req, res, next) => {
  const user = User.findById(req.userToken.userID);

  if (user.company) {
    return res.status(401).send({
      message: `Seul un utilisateur Freelance peut effectuer cette action`,
    });
  }

  next();
};

module.exports = isFreelance;
