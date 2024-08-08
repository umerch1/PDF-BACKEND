const Joi = require("joi");

const authSchema = Joi.object({
  name: Joi.string().lowercase(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  authSchema,
};
