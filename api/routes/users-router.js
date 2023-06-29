const usersRouter = require('express').Router();
const { getUsers, getUserByUsername } = require(`${__dirname}/../controllers/users.controllers`)

usersRouter.get('/', getUsers)

usersRouter.get('/:username', getUserByUsername)

module.exports = usersRouter