// import { object, string, number, date, InferType } from 'yup';

const yup = require('yup');


const createCommentSchema = yup.object({
  text: yup.string().required(),
  taskId: yup.number().required(),
});

const updateCommentSchema = yup.object({
    text: yup.string(),
    taskId: yup.number(),
});


module.exports = {
   createCommentSchema,
   updateCommentSchema
}
