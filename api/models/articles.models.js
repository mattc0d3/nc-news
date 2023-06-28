const db = require(`${__dirname}/../../db/connection`)

exports.selectArticles = () => {
    return db.query(`SELECT articles.article_id,
                    title,
                    topic,
                    articles.author,
                    articles.created_at,
                    articles.votes,
                    COUNT(comments.article_id) AS comment_count 
                    FROM articles 
                    LEFT JOIN comments ON articles.article_id = comments.article_id 
                    GROUP BY articles.article_id
                    ORDER BY articles.created_at DESC`)
        .then(({ rows }) => rows)
}

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.article_id,
    title,
    topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    articles.body,
    COUNT(comments.article_id) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id 
    GROUP BY articles.article_id
    HAVING articles.article_id = $1`, [article_id])
        .then(({ rows }) => rows[0])
}

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC`, [article_id])
        .then(({ rows }) => rows)
}

exports.insertCommentByArticleId = (article_id, username, body) => {
    return db.query(`
        INSERT INTO comments
        (article_id, author, body)
        VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body]
        ).then(({ rows }) => rows[0])
}

exports.updateArticleById = (article_id, newVotes) => {
    return db.query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING * `, [newVotes, article_id])
        .then(({ rows }) => rows[0])
}
