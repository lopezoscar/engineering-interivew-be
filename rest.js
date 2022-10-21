const restify = require('restify')
const TasksRouter = require('./src/routes/tasks/tasks-router')

function createRestServer ({ db }) {
  const server = restify.createServer()
  server.use(restify.queryParser())
  server.use(restify.jsonBodyParser({ mapParams: false }))

  const taskRouter = new TasksRouter({ db })

  server.get('/tasks', taskRouter.getTasks())
  server.get('/tasks/:id', taskRouter.getTaskById())
  server.post('/tasks', taskRouter.createTask())
  server.patch('/tasks/:id', taskRouter.updateTask())
  server.del('/tasks/:id', taskRouter.deleteTask())

  return server
}

module.exports = createRestServer
