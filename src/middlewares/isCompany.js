const User = require("../models/user_model");

const isCompany = async (req, res, next) => {
  const user = await User.findById(req.userToken.userID);

  if (!user) {
    return res.status(403).send({
      message: `Utilisateur non trouvé`,
    });
  }

  if (!user.company && !user.isAdmin) {
    return res.status(401).send({
      message: `Seul le membre d'une entreprise peut effectuer cette action`,
    });
  }

  req.companyID = user.company;
  next();
};

module.exports = isCompany;
