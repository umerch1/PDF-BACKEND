const Joi = require("joi");

const adminSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
  admin: Joi.boolean().required(),
});

module.exports = {
  adminSchema,
};
