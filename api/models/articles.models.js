const db = require(`${__dirname}/../../db/connection`)

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 400, msg: "Bad Request"})
            }
            return rows[0]}
            )
}