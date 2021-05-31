const routeAuth = require('./auth')
const routeAuthors = require('./authors')
const routeBooks = require('./books')
const routeLoans = require('./loans')
const routeStudents = require('./students')
const routeUsers = require('./users')

module.exports = app => {
  routeAuth(app)
  routeAuthors(app)
  routeBooks(app)
  routeLoans(app)
  routeStudents(app)
  routeUsers(app)
}