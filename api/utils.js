const db = require(`${__dirname}/../db/connection`)
const format = require("pg-format")

exports.checkCategoryExists = (table, column, value) => {
    return db.query(format('SELECT * FROM %I WHERE %I = $1;', table, column), [value])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Not Found"})
            }
        })
}

exports.getValidParams = (table, column) => {
    return db.query(format(`SELECT DISTINCT %I FROM %I;`, column, table))
        .then(({ rows }) => rows.map(row => row[column]))
}

// exports.checkPageQueryValid = (topic, limit, p) => {
//     return 
//         .then(({ rows }) => {
//             if (!rows.length) {
//                 return Promise.reject({ status: 404, msg: "Not Found"})
//             }
//         })
// }