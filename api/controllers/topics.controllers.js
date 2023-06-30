const { selectTopics, insertTopic } = require(`${__dirname}/../models/topics.models`)

exports.getTopics = (req, res, next) => {
    selectTopics().then(topics => {
        res.status(200).send({ topics })
    })
    .catch(next)
} 

exports.postTopic = (req, res, next) => {
    const { slug, description } = req.body
    insertTopic(slug, description).then(postedTopic => {
        res.status(201).send({ postedTopic })
    })
    .catch(next)
}