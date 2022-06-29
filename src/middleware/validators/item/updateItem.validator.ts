import Joi from "joi";

const updateItemSchema = Joi.object({
  name: Joi.string().required().max(500),
  description: Joi.string().required().max(2500),
  isDraft:Joi.boolean(),
  categoryId:Joi.string()
});

export default updateItemSchema;
