const db = require(`${__dirname}/../../db/connection`)

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => rows)
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => rows[0])
}