const express = require('express')
const bodyParser = require('body-parser')
const { expressjwt: jwt } = require('express-jwt')

const TasksRouter = require('./src/routes/tasks/tasks-router')

function createRestServer ({ db }) {
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.disable('x-powered-by')

  app.use(jwt({
    secret: process.env.JWT_SECRET_KEY,
    algorithms: ['HS256']
  }))

  const taskRouter = new TasksRouter({ db })

  app.get('/tasks', taskRouter.getTasks())
  app.get('/tasks/:id', taskRouter.getTaskById())
  app.post('/tasks', taskRouter.createTask())
  app.patch('/tasks/:id', taskRouter.updateTask())
  app.delete('/tasks/:id', taskRouter.deleteTask())

  app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('Invalid token')
    } else {
      next(err)
    }
  })

  return app
}

module.exports = createRestServer
