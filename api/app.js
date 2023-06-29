const express = require("express")
const app = express()
const { getEndpoints } = require(`${__dirname}/controllers/api.controllers`)
const { getTopics } = require(`${__dirname}/controllers/topics.controllers`)
const { getUsers, getUserByUsername } = require(`${__dirname}/controllers/users.controllers`)
const { getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId, patchArticleById } = require(`${__dirname}/controllers/articles.controllers`)
const { destroyCommentById } = require(`${__dirname}/controllers/comments.controllers`)
const { handlePsqlErrors, handleCustomErrors, handleInternalErrors} = require(`${__dirname}/errors/errors`)

app.use(express.json())

app.get("/api", getEndpoints)

app.get("/api/topics", getTopics)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticleById)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleById)

app.delete("/api/comments/:comment_id", destroyCommentById)

app.get("/api/users", getUsers)

app.get("/api/users/:username", getUserByUsername)

app.all("*", (_, res) => res.status(404).send({ msg: "Not Found"}))

app.use(handlePsqlErrors)

app.use(handleCustomErrors)

app.use(handleInternalErrors)

module.exports = app