const AWS = require('aws-sdk')

AWS.config.update({
  accessKeyId: 'key',
  secretAccessKey: 'secret',
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

module.exports = AWS
