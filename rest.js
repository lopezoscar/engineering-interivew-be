const express = require('express')
const bodyParser = require('body-parser')

const TasksRouter = require('./src/routes/tasks/tasks-router')

function createRestServer ({ db }) {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.disable('x-powered-by')

  const taskRouter = new TasksRouter({ db })

  app.get('/tasks', taskRouter.getTasks())
  app.get('/tasks/:id', taskRouter.getTaskById())
  app.post('/tasks', taskRouter.createTask())
  app.patch('/tasks/:id', taskRouter.updateTask())
  app.delete('/tasks/:id', taskRouter.deleteTask())

  return app
}

module.exports = createRestServer
