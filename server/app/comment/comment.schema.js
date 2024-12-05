// import { object, string, number, date, InferType } from 'yup';

const yup = require('yup');


const createCommentSchema = yup.object({
  text: yup.string().required(),
  taskId: yup.number().required(),
});

const updateCommentSchema = yup.object({
  text: yup.string(),
  taskId: yup.number(),
}).test('at-least-one-field', 'At least one field must be provided', value => {
  return value.text !== undefined ||
    value.taskId !== undefined 
});


module.exports = {
   createCommentSchema,
   updateCommentSchema
}
