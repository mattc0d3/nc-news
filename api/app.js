const express = require("express")
const app = express()
const { getEndpoints } = require(`${__dirname}/controllers/api.controllers`)
const { getTopics } = require(`${__dirname}/controllers/topics.controllers`)
const { getArticles } = require(`${__dirname}/controllers/articles.controllers`)
const { handleCustomErrors, handleInternalErrors} = require(`${__dirname}/errors/errors`)

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.use(handleCustomErrors)

app.use(handleInternalErrors)

module.exports = app