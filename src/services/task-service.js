const TaskModel = require('../models/task-model')
const InternalServerError = require('../errors/InternalServerError')
const ValidationError = require('../errors/ValidationError')
const NotFoundError = require('../errors/NotFoundError')
const { VALID_STATUS } = require('../util/status')

class TaskService {
  constructor ({ db }) {
    this.db = db
    this.taskModel = new TaskModel({ db })
  }

  async getTaskById ({ taskId, userId }) {
    let task = null
    try {
      console.log(`getting task by id ${taskId}`)
      task = await this.taskModel.get({ taskId })
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }

    if (!task) {
      throw new NotFoundError(`Task ${taskId} not found`)
    }

    if (userId && task.userId !== userId) {
      throw new ValidationError('this task doesn`t belong to this user')
    }
    console.log(`task by id ${taskId}`, task)
    return task
  }

  async getTasks ({ page = 1, limit = 20, lastId, userId }) {
    try {
      page = Number(page)
      limit = Number(limit)
      console.log(`getting task page ${page} ${limit} ${lastId} ${userId}`)
      const tasks = await this.taskModel.list({ page, limit, lastId, userId })
      console.log('tasks response', tasks)
      return tasks
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async createTask ({ title, description, status, userId }) {
    if (!title) {
      throw new ValidationError('title is required')
    }
    if (!status) {
      throw new ValidationError('status is required')
    }
    if (VALID_STATUS.indexOf(status) === -1) {
      throw new ValidationError('invalid status')
    }
    if (!userId) {
      throw new ValidationError('userId is required')
    }
    const newTask = {
      title,
      description,
      status,
      userId
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

  async updateTask ({ taskId, title, description, status, userId }) {
    if (status && VALID_STATUS.indexOf(status) === -1) {
      throw new ValidationError('invalid status')
    }

    await this.getTaskById({ taskId, userId })

    try {
      const result = await this.taskModel.updateTask({ id: taskId, title, description, status })
      console.log(result)
      if (result && result.ok) {
        return { updated: true }
      }
      throw InternalServerError(`couldn\`t update task with id ${taskId}`, result)
    } catch (error) {
      console.log(error)
      throw new InternalServerError(error)
    }
  }

  async deleteTask ({ taskId, userId }) {
    await this.getTaskById({ taskId, userId })

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
