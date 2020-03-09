const { createConnection } = require('mysql2')

const connection = createConnection({
  host: 'localhost',
  port: 3306,
  user: 'Account',
  password: 'Lite!River1',
  database: 'employees_db'
})

module.exports = connection