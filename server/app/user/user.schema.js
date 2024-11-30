// import { object, string, number, date, InferType } from 'yup';

const yup = require('yup');

const createUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string()
    .required()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'Password must contain at least one letter, one number and one special character'
    )
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const updateSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
      'Password must contain at least one letter, one number and one special character'
  ),
  organizationId: yup.number().required()
});


module.exports = {
    createUserSchema,
   loginSchema,
   updateSchema
}
