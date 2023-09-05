const { checkCategoryExists } = require("../utils")

const { selectUsers, selectUserByUsername, selectCommentsByUsername } = require(`${__dirname}/../models/users.models`)

exports.getUsers = (req, res, next) => {
    selectUsers().then(users => {
        res.status(200).send({ users })
    })
    .catch(next)
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    const promises = [checkCategoryExists('users', 'username', username), selectUserByUsername(username)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            const user = resolvedPromises[1]
            res.status(200).send({ user })
    })
    .catch(next)
}

exports.getCommentsByUsername = (req, res, next) => {
    const { username } = req.params
    const promises = [checkCategoryExists('users', 'username', username), selectCommentsByUsername(username)]

    Promise.all(promises)
        .then(resolvedPromises => {
            const comments = resolvedPromises[1]
            res.status(200).send({ comments })
    })
    .catch(next)
}