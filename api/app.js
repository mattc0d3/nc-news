const express = require("express")
const app = express()
const { handlePsqlErrors, handleCustomErrors, handleInternalErrors} = require(`${__dirname}/errors/errors`)
const apiRouter = require(`${__dirname}/routes/api-router`)

app.use(express.json())

app.use('/api', apiRouter)

app.all("*", (_, res) => res.status(404).send({ msg: "Not Found"}))

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleInternalErrors)

module.exports = app