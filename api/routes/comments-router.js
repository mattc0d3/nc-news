const commentsRouter = require('express').Router()
const { destroyCommentById, patchCommentById, getCommentById } = require(`${__dirname}/../controllers/comments.controllers`)

commentsRouter
    .route('/:comment_id')
    .get(getCommentById)
    .patch(patchCommentById)
    .delete(destroyCommentById)

module.exports = commentsRouter