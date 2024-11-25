const app = require('./server-config.js');

const port = process.env.PORT || 5000;


const taskRouter = require('./app/task/task.route');
const userRouter = require('./app/user/user.route');
const organizationRouter = require('./app/organization/organization.route');
const projectRouter = require('./app/project/project.route');

app.use('/task', taskRouter);
app.use('/user', userRouter);
app.use('/organization', organizationRouter);
app.use('/project', projectRouter);


if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;