const MongoClient = require('mongodb').MongoClient
const { StatusCodes } = require('http-status-codes')

const url = process.env.DB_CONN || 'mongodb://localhost:27017/tasks-db'
const dbName = process.env.DB || 'tasks'
const client = new MongoClient(url, { useUnifiedTopology: true })
let cachedDB

async function connect () {
  try {
    await client.connect()
    console.log('MongoDB Connected OK', url)
    return client.db(dbName)
  } catch (err) {
    console.log(err)
  }
}

module.exports.connectToDatabase = async function connectToDatabase () {
  if (cachedDB) {
    console.log('=> using cached database instance')
    return Promise.resolve(cachedDB)
  }
  try {
    const db = await connect()
    cachedDB = db
    return cachedDB
  } catch (error) {
    console.log('Error in database connection', error)
    throw new Error({ statusCode: StatusCodes.INTERNAL_SERVER_ERROR })
  }
}
