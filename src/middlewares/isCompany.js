const User = require("../models/user_model");

const isCompany = async (req, res, next) => {
  const user = await User.findById(req.userToken.userID);

  if (!user.company && !req.userToken.isAdmin) {
    return res.status(401).send({
      message: `Seul le membre d'une entreprise peut effectuer cette action`,
    });
  }

  req.companyID = user.company;
  next();
};

module.exports = isCompany;
