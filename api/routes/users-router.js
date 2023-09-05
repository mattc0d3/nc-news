const usersRouter = require('express').Router();
const { getUsers, getUserByUsername, getCommentsByUsername } = require(`${__dirname}/../controllers/users.controllers`)

usersRouter.get('/', getUsers)

usersRouter.get('/:username', getUserByUsername)

usersRouter.get('/:username/comments', getCommentsByUsername)

module.exports = usersRouter