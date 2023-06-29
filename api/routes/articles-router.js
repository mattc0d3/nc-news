const articlesRouter = require('express').Router()
const { getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require(`${__dirname}/../controllers/articles.controllers`)

articlesRouter.get('/', getArticles)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

module.exports = articlesRouter