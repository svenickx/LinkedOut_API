const freelanceRegisterSchema = require("./validators/freelanceRegisterValidator");

const verifyFreelanceRegister = (req, res, next) => {
  delete req.body.companyName;
  const { error } = freelanceRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message:
        "Les informations saisies pour l'inscription ne sont pas conformes",
    });
  }

  next();
};

module.exports = verifyFreelanceRegister;
