const express = require("express")
const app = express()
const { getTopics } = require(`${__dirname}/controllers/topics.controllers`)
const { handlePsqlErrors, handleCustomErrors, handleInternalErrors} = require(`${__dirname}/errors/errors`)

app.get("/api/topics", getTopics)

app.use(handleCustomErrors)

app.use(handleInternalErrors)

module.exports = app