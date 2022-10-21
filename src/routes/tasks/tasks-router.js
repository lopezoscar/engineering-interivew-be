const Joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const TaskService = require('../../services/task-service')
const ValidationError = require('../../errors/ValidationError')
const errs = require('restify-errors')

function validate ({ schema, data }) {
  const { error } = schema.validate(data)
  if (error) {
    throw new ValidationError(error)
  }
}

class TaskRouter {
  constructor ({ db }) {
    this.db = db
    this.taskService = new TaskService({ db: this.db })
  }

  getTaskById () {
    const schema = Joi.object({
      id: Joi.string().required()
    })
    return async (req, res, next) => {
      try {
        validate({ schema, data: req.params })
        const task = await this.taskService.getTaskById({ taskId: req.params.id })
        console.log('req.params', req.params)
        return res.send(StatusCodes.OK, task)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new errs.BadRequestError(error.message))
        }
        return next(new errs.InternalServerError(error))
      }
    }
  }

  getTasks () {
    const schema = Joi.object({
      page: Joi.number(),
      limit: Joi.number().required(),
      lastId: Joi.string().optional().allow(null)
    })
    return async (req, res, next) => {
      try {
        console.log('req.params', req.params)
        validate({ schema, data: req.params })
        const tasks = await this.taskService.getTasks(req.params)
        return res.send(StatusCodes.OK, tasks)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new errs.BadRequestError(error.message))
        }
        return next(new errs.InternalServerError(error))
      }
    }
  }

  createTask () {
    const schema = Joi.object({
      title: Joi.string().max(250).required(),
      description: Joi.string().max(1000).allow(null).allow('').optional(),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED').required()
    })
    return async (req, res, next) => {
      try {
        validate({ schema, data: req.body })

        const { title, description, status } = req.body
        console.log('creating task', title, description, status)
        const task = await this.taskService.createTask({
          title, description, status
        })
        return res.send(StatusCodes.CREATED, task)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new errs.BadRequestError(error.message))
        }
        return next(new errs.InternalServerError(error))
      }
    }
  }

  updateTask () {
    const schema = Joi.object({
      id: Joi.string().required(),
      title: Joi.string().max(250).optional().allow(null),
      description: Joi.string().max(1000).allow(null).allow('').optional(),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE', 'ARCHIVED').optional().allow(null)
    })
    return async (req, res, next) => {
      try {
        validate({ schema, data: { ...req.body, ...req.params } })

        const { id } = req.params
        const { title, description, status } = req.body
        console.log(`update task ${id}`, title, description, status)
        const task = await this.taskService.updateTask({
          id, title, description, status
        })
        return res.send(StatusCodes.OK, task)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new errs.BadRequestError(error.message))
        }
        return next(new errs.InternalServerError(error))
      }
    }
  }

  deleteTask () {
    const schema = Joi.object({
      id: Joi.string().required()
    })
    return async (req, res, next) => {
      try {
        validate({ schema, data: req.params })
        const task = await this.taskService.deleteTask({ taskId: req.params.id })
        console.log('req.params', req.params)
        return res.send(StatusCodes.OK, task)
      } catch (error) {
        console.log(error)
        if (error instanceof ValidationError) {
          return next(new errs.BadRequestError(error.message))
        }
        return next(new errs.InternalServerError(error))
      }
    }
  }
}

module.exports = TaskRouter
