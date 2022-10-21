const dbOpts = { apiVersion: '2012-08-10' }
if (process.env.JEST_WORKER_ID || process.env.NODE_ENV === 'development') {
  dbOpts.endpoint = 'localhost:8001'
  dbOpts.sslEnabled = false
  dbOpts.region = 'local-env'
}

module.exports.connect = function connect (AWS) {
  return new AWS.DynamoDB.DocumentClient(dbOpts)
}
