const usersRouter = require('express').Router();
const { getUsers } = require(`${__dirname}/../controllers/users.controllers`)

usersRouter.get('/', getUsers)

module.exports = usersRouter