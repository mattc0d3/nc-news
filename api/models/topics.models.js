const db = require(`${__dirname}/../../db/connection`)

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then(({ rows }) => rows)
}

exports.insertTopic = (slug, description) => {
    return db.query(`
        INSERT INTO TOPICS
        (slug, description)
        VALUES ($1, $2)
        RETURNING *`, [slug, description])
        .then(({ rows }) => rows[0])
}