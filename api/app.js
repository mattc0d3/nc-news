const express = require("express")
const app = express()
const { getEndpoints } = require(`${__dirname}/controllers/api.controllers`)
const { getTopics } = require(`${__dirname}/controllers/topics.controllers`)
const { handlePsqlErrors, handleCustomErrors, handleInternalErrors} = require(`${__dirname}/errors/errors`)

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.use(handleCustomErrors)

app.use(handleInternalErrors)

module.exports = app