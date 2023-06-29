const apiRouter = require('express').Router();
const { getEndpoints } = require(`${__dirname}/../controllers/api.controllers`)
const topicsRouter = require(`${__dirname}/topics-router`)
const articlesRouter = require(`${__dirname}/articles-router`)
const commentsRouter = require(`${__dirname}/comments-router`)
const usersRouter = require(`${__dirname}/users-router`)

apiRouter.get('/', getEndpoints)

apiRouter.use('/topics', topicsRouter)

apiRouter.use('/articles', articlesRouter)

apiRouter.use('/comments', commentsRouter)

apiRouter.use('/users', usersRouter)

module.exports = apiRouter