const { checkCategoryExists } = require("../utils")

const { selectUsers, selectUserByUsername } = require(`${__dirname}/../models/users.models`)

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
            user = resolvedPromises[1]
            res.status(200).send({ user })
    })
    .catch(next)
}