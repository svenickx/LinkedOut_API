const Joi = require("joi");

const companyCreationSchema = Joi.object({
  name: Joi.string().pattern(new RegExp("[A-zÀ-ú]")).min(2).max(50).required(),
  status: Joi.string()
    .pattern(new RegExp("[A-zÀ-ú]"))
    .min(1)
    .max(10)
    .uppercase()
    .required(),
  siret: Joi.string().pattern(new RegExp("[0-9]")).min(1).max(15).required(),
  address: Joi.string().alphanum().min(3).max(100).required(),
});

module.exports = companyCreationSchema;
