const TaskModel = require('../models/task-model')
const InternalServerError = require('../errors/InternalServerError')
const ValidationError = require('../errors/ValidationError')
const { VALID_STATUS } = require('../util/status')
// const { v4: uuid } = require('uuid')
// const ValidationError = require('../errors/ValidationError')

class TaskService {
  constructor ({ db }) {
    this.db = db
    this.taskModel = new TaskModel({ db })
  }

  async getTaskById ({ taskId }) {
    try {
      console.log(`getting task by id ${taskId}`)
      const task = await this.taskModel.get({ taskId })
      console.log(`task by id ${taskId}`, task)
      return task
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async getTasks ({ page = 1, limit = 20, lastId }) {
    try {
      page = Number(page)
      limit = Number(limit)
      console.log(`getting task page ${page} ${limit} ${lastId}`)
      const tasks = await this.taskModel.list({ page, limit, lastId })
      console.log('tasks response', tasks)
      return tasks
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async createTask ({ title, description, status }) {
    if (!title) {
      throw new ValidationError('title is required')
    }
    if (!status) {
      throw new ValidationError('status is required')
    }
    if (VALID_STATUS.indexOf(status) === -1) {
      throw new ValidationError('invalid status')
    }
    const newTask = {
      title,
      description,
      status
    }
    try {
      const result = await this.taskModel.create(newTask)
      if (result && result.insertedId) {
        newTask._id = result.insertedId
      }
      return newTask
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async updateTask ({ id, title, description, status }) {
    if (status && VALID_STATUS.indexOf(status) === -1) {
      throw new ValidationError('invalid status')
    }
    try {
      const result = await this.taskModel.updateTask({ id, title, description, status })
      console.log(result)
      if (result && result.ok) {
        return { updated: true }
      }
      throw InternalServerError(`couldn\`t update task with id ${id}`, result)
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async deleteTask ({ taskId }) {
    try {
      console.log(`deletting task by id ${taskId}`)
      const result = await this.taskModel.deleteTask({ taskId })
      return { deleted: result && result.deletedCount === 1 }
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }
}

module.exports = TaskService
