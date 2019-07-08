const mysql = require('mysql')

const db = mysql.createConnection({
    host : 'chess-mysql.cmaf5ugscgcc.us-west-2.rds.amazonaws.com',
    user: 'group9',
    password : ' chess667',
    database : 'environment_project'
})

module.exports = db