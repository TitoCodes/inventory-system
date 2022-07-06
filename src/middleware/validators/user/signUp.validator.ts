import Joi from "joi";

const signUpSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export default signUpSchema;
