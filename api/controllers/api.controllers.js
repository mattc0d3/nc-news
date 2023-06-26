const endpoints = require(`${__dirname}/../../endpoints`)

exports.getEndpoints = (req, res) => {
    res.status(200).send({ endpoints })
}