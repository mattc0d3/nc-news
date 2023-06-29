const commentsRouter = require('express').Router()
const { destroyCommentById } = require(`${__dirname}/../controllers/comments.controllers`)

commentsRouter.delete('/:comment_id', destroyCommentById)

module.exports = commentsRouter