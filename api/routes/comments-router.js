const commentsRouter = require('express').Router()
const { destroyCommentById, patchCommentById } = require(`${__dirname}/../controllers/comments.controllers`)

commentsRouter
    .route('/:comment_id')
    .patch(patchCommentById)
    .delete(destroyCommentById)

module.exports = commentsRouter