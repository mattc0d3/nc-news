const topicsRouter = require('express').Router();
const { getTopics } = require(`${__dirname}/../controllers/topics.controllers`)

topicsRouter.get('/', getTopics)

module.exports = topicsRouter