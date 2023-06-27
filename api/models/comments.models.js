const db = require(`${__dirname}/../../db/connection`)

exports.deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
}