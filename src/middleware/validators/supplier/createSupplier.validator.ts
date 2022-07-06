import Joi from 'joi';

const createSupplierSchema = Joi.object({
    name: Joi.string().required().max(250),
    description: Joi.string().required().max(1000),
    mobileNumber: Joi.string().max(20),
    telephoneNumber: Joi.string().max(20),
    country:Joi.string().max(50),
    city:Joi.string().max(100),
    zipCode:Joi.string().max(10),
    street:Joi.string().max(200),
    building:Joi.string().max(200),
});

export default createSupplierSchema;