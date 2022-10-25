require('dotenv').config()
// centralize all microservices dependencies at the beginning
const createRestServer = require('./rest')
const { connectToDatabase } = require('./db')

async function startRestServer () {
  let db = null
  try {
    db = await connectToDatabase()
  } catch (err) {
    console.log('Error creating db connection', err)
  }

  try {
    const restServer = createRestServer({ db })
    restServer.listen(process.env.REST_SERVER_PORT, () => {
      console.log(restServer)
      console.log(`🚀 Server ready on port ${process.env.REST_SERVER_PORT}`)
    })
  } catch (err) {
    console.log('Error starting rest server', err)
  }
}

startRestServer()
