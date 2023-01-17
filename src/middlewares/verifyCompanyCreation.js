const companyCreationSchema = require("./validators/companyCreationValidator");

const verifyCompanyCreation = (req, res, next) => {
  const { error } = companyCreationSchema.validate(req.body);

  if (error) {
    return res.status(400).send({
      message:
        "Les informations saisies pour la création d'entreprise ne sont pas conformes",
    });
  }

  next();
};

module.exports = verifyCompanyCreation;
