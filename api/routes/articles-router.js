const articlesRouter = require('express').Router()
const { getArticles, postArticle, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchArticleById, destroyArticleById, getArticlesByAuthor } = require(`${__dirname}/../controllers/articles.controllers`)

articlesRouter
    .route('/')
    .get(getArticles)
    .post(postArticle)

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(destroyArticleById)

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId)

articlesRouter
    .route('/authors/:author')
    .get(getArticlesByAuthor)

module.exports = articlesRouter