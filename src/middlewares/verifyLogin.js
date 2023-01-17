const loginSchema = require("./validators/loginValidator");

const verifyLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message:
        "Les informations saisies pour la connexion ne sont pas conformes",
    });
  }

  next();
};

module.exports = verifyLogin;
