const registerSchema = require("./validators/registerValidator");

const verifyRegister = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      message: "Informations incorrect",
    });
  }

  next();
};

module.exports = verifyRegister;
