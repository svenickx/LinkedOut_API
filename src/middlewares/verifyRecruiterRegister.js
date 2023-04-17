const recruiterRegisterSchema = require("./validators/recruiterRegisterValidator");

const verifyRecruiterRegister = (req, res, next) => {
  delete req.body.skills;
  delete req.body.jobs;
  delete req.body.yearlyExperience;
  delete req.body.price;

  const { error } = recruiterRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message:
        "Les informations saisies pour l'inscription ne sont pas conformes",
    });
  }

  next();
};

module.exports = verifyRecruiterRegister;
