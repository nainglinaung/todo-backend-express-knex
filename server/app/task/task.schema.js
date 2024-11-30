// import { object, string, number, date, InferType } from 'yup';

const yup = require('yup');

const createTaskSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),

});

const updateTaskSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  completed: yup.boolean()
});


module.exports = {
   createTaskSchema,
   updateTaskSchema
}
