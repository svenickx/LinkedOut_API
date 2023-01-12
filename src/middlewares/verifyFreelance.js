const User = require("../models/user_model");

const verifyFreelance = (req, res, next) => {
  const user = User.findById(req.userToken.userID);

  if (user.company) {
    return res.status(401).send({
      message: `Only a Freelancer is allowed to perform this action`,
    });
  }

  next();
};

module.exports = verifyFreelance;
