const Joi = require("joi");

const registerSchema = Joi.object({
  firstname: Joi.string().alphanum().min(3).max(30).required(),
  lastname: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  address: Joi.string().min(3).max(100).required(),
  city: Joi.string().min(3).max(100).required(),
  zipCode: Joi.number(),
  phoneNumber: Joi.string().min(4).max(100).required(),
});

module.exports = registerSchema;
