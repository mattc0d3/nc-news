const db = require(`${__dirname}/../../db/connection`)

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(({ rows }) => rows)
}

exports.selectUserByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1`, [username])
        .then(({ rows }) => rows[0])
}

exports.selectCommentsByUsername = (username) => {
    return db.query(`SELECT comments.body, 
    comments.votes, 
    comments.author, 
    comments.created_at, 
    comments.article_id,
    comments.comment_id,
    articles.author AS article_author, 
    articles.title AS article_title 
    FROM comments 
    JOIN articles ON articles.article_id = comments.article_id 
    WHERE comments.author = 'icellusedkars';`)
    .then(({ rows }) => rows)
}