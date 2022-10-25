require('dotenv').config()
const jwt = require('jsonwebtoken')
const jwtSecretKey = process.env.JWT_SECRET_KEY
const data = {
  userId: 20
}

const token = jwt.sign(data, jwtSecretKey)
console.log(token)
