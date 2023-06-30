const db = require(`${__dirname}/../../db/connection`)

exports.selectCommentById = (comment_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE comment_id = $1`, [comment_id])
        .then(({ rows }) => rows[0])
}

exports.deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
}

exports.updateCommentById = (comment_id, newVotes) => {
    return db.query(`
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *`, [newVotes, comment_id])
        .then(({ rows }) => rows[0])
}