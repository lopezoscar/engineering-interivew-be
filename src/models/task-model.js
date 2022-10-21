const mongodb = require('mongodb')

class TaskModel {
  constructor ({ db }) {
    this.db = db
  }

  async get ({ taskId, filter = {} }) {
    if (!taskId) {
      return new Error('taskId is required')
    }
    const task = await this.db.collection('tasks').findOne({ _id: mongodb.ObjectId(taskId) }, filter)
    return task
  }

  async list ({ page, limit, lastId, filter = {} }) {
    let query = {}
    if (lastId) {
      query = { _id: { $gt: mongodb.ObjectId(lastId) } }
    }

    const skip = lastId ? 0 : (page - 1) * limit
    const tasks = await this.db.collection('tasks').find(query, filter).skip(skip).limit(limit).toArray()
    return tasks
  }

  create (newTask) {
    return this.db.collection('tasks').insertOne(newTask)
  }

  deleteTask ({ taskId }) {
    const query = { _id: mongodb.ObjectId(taskId) }
    return this.db.collection('tasks').remove(query)
  }

  updateTask ({ id, title, description, status }) {
    const query = {
      _id: mongodb.ObjectId(id)
    }
    const update = {
      $set: {}
    }
    if (title) {
      update.$set.title = title
    }
    if (description) {
      update.$set.description = description
    }
    if (description === '') {
      update.$set.description = description
    }
    if (status) {
      update.$set.status = status
    }
    return this.db.collection('tasks').findOneAndUpdate(query, update)
  }
}

module.exports = TaskModel
