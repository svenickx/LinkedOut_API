const isAdmin = (req, res, next) => {
  if (!req.userToken.isAdmin) {
    return res.status(403).send({
      message: "Vous ne possédez pas les droits d'effectuer cette action",
    });
  }
  next();
};

module.exports = isAdmin;
