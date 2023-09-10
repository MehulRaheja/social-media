import Joi, { ObjectSchema } from 'joi';

const emailSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    'string.base': 'Field must be valid',
    'string.email': 'Field must be valid',
    'string.required': 'Field must be valid'
  })
});

const passwordSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(4).max(8).messages({
    'string.base': 'password must be type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'password is a required field'
  }),
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Password should match',
    'any.required': 'Confirm Password is a required field'
  })
});

export { emailSchema, passwordSchema };
