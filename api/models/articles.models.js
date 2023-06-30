const db = require(`${__dirname}/../../db/connection`)
const format = require("pg-format")
const { getValidParams } = require(`${__dirname}/../utils`)

exports.selectArticles = (topic = null, sort_by = "created_at", order = "DESC", limit = 10, p = 1, total_count = "false") => {
    const validTopicsPromise = getValidParams('topics', 'slug')
    const validSortBy = ["article_id", "title", "topic", "author", "body", "created_at", "article_img_url"]
    const validOrder = ["ASC", "DESC"]
    const validTotalCount = ["true", "false"]
    order = order.toUpperCase()
    const offset = (p - 1) * limit
    
    return Promise.all([validTopicsPromise]).then(([validTopics]) => {

        if ((topic && !validTopics.includes(topic))
        || !validSortBy.includes(sort_by)
        || !validOrder.includes(order)
        || !validTotalCount.includes(total_count)) {
            return Promise.reject({ status: 400, msg: "Bad Request" })
        }

        let dbQuery = `SELECT articles.article_id,
                        title,
                        topic,
                        articles.author,
                        articles.created_at,
                        articles.votes,
                        COUNT(comments.article_id) AS comment_count 
                        FROM articles 
                        LEFT JOIN comments ON articles.article_id = comments.article_id 
                        GROUP BY articles.article_id `
    
        
        if (topic) dbQuery += `HAVING topic = '${topic}' `
        dbQuery += `ORDER BY articles.${sort_by} ${order} LIMIT ${limit} OFFSET ${offset}`
        return db.query(dbQuery).then(({ rows }) => rows)
    })
}

exports.insertArticle = (author, title, body, topic, article_img_url) => {
    const values = [author, title, body, topic]
    let valuesToInsert = "$1, $2, $3, $4"
    let columnValues = "author, title, body, topic"

    if (article_img_url) {
        values.push(article_img_url)
        valuesToInsert += ", $5"
        columnValues += ", article_img_url"
    }

    return db.query(format(`
        INSERT INTO articles 
        (${columnValues}) 
        VALUES (${valuesToInsert}) 
        RETURNING article_id`), values)
        .then(({ rows }) => rows[0])
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

exports.selectCommentsByArticleId = (article_id, limit = 10, p = 1) => {
    console.log(limit, "<<<<<<<<<< limit in model")
    const offset = (p - 1) * limit
    return db.query(`
        SELECT * FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3`, [article_id, limit, offset])
        .then(({ rows }) => {
            console.log(rows, "<<<<<<< rows in models")
            return rows})
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
