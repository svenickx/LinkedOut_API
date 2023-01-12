const User = require("../models/user_model");

const verifyCompany = async (req, res, next) => {
  const user = await User.findById(req.userToken.userID);

  if (!user.company && !req.userToken.isAdmin) {
    return res.status(401).send({
      message: `Only a Company's member is allowed to perform this action`,
    });
  }

  next();
};

module.exports = verifyCompany;
