const freelanceRegisterSchema = require("./validators/freelanceRegisterValidator");

const verifyFreelanceRegister = (req, res, next) => {
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
