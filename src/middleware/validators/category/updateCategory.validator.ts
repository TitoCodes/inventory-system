import Joi from 'joi';

const updateCategorySchema = Joi.object({
    name: Joi.string().required().max(250),
    description: Joi.string().required().max(1000)
});

export default updateCategorySchema;