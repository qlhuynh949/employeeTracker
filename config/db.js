const { createConnection } = require('mysql2')

const connection = createConnection({
  host: 'localhost',
  port: 3306,
  user: 'Account',
  password: 'Fight!Me1',
  database: 'employees_db'
})

module.exports = connection