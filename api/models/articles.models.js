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
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "Article Not Found"})
            }
            return rows[0]}
            )
}