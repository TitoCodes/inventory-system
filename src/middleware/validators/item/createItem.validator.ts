import Joi from "joi";

const createItemSchema = Joi.object({
  name: Joi.string().required().max(500),
  description: Joi.string().required().max(2500),
  categoryId:Joi.string(),
  isDraft:Joi.boolean()
});

export default createItemSchema;
