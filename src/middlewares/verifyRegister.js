const registerSchema = require("./validators/registerValidator");

const verifyRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  console.log(req.body);
  if (error) {
    return res.status(400).send({
      message: "Informations incorrect",
    });
  }

  // return res.status(200).send({
  //   message: "Validation passée avec succès",
  // });
  next();
};

module.exports = verifyRegister;
