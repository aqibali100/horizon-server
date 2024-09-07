const Joi = require('joi');

const RegisterUser = Joi.object({
    name: Joi.string().trim().max(20).required().messages({
        'string.max': 'Name must be less than 20 characters',
        'string.empty': 'Name is required'
    }),
    email: Joi.string().email().trim().lowercase().required().messages({
        'string.email': 'Invalid email address',
        'string.empty': 'Email is required'
    }),
    password: Joi.string().min(8).max(20).required().messages({
        'string.min': 'Password must be at least 8 characters',
        'string.max': 'Password must be less than 20 characters',
        'string.empty': 'Password is required'
    }),
    phoneNumber: Joi.string()
        .pattern(/^[0-9]{10}$/, 'numbers')
        .required()
        .messages({
            'string.pattern.base': 'Phone number must be exactly 10 digits and only contain numbers',
            'string.empty': 'Phone number is required'
        })
});
module.exports = {
    RegisterUser
};
