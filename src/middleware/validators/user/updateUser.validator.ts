import Joi from "joi";

const updateUserSchema = Joi.object({
  firstName: Joi.string().required().max(750),
  middleName: Joi.string().required().max(750),
  lastName: Joi.string().required().max(750),
  email: Joi.string().email().required(),
  sex: Joi.string()
    .valid("M", "F")
    .required()
    .min(1)
    .max(1)
    .label("sex can only be `M` or `F` value"),
  birthDate: Joi.date().required(),
});

export default updateUserSchema;
