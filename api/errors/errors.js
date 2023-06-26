exports.handlePsqlErrors = (err, req, res, next) => {
    if (err.code) {
        res.status(400).send({ msg: "Bad Request"})
    } else next(err)
}

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.msg) {
        res.status(err.status).send({ msg: err.msg })
    } else next(err)
}

exports.handleInternalErrors = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal Error"})
}