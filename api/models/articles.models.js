const db = require(`${__dirname}/../../db/connection`)

exports.selectArticles = () => {
    return db.query(`SELECT articles.article_id,
                            title,
                            topic,
                            author,
                            created_at,
                            votes
                            FROM articles`)
        .then(({ rows }) => rows)
}