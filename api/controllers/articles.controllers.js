const { selectArticles, selectArticleById, selectCommentsByArticleId, insertCommentByArticleId } = require(`${__dirname}/../models/articles.models`)
const { checkCategoryExists } = require(`${__dirname}/../utils`)

exports.getArticles = (req, res, next) => {
    selectArticles().then(articles => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    const promises = [checkCategoryExists('articles', 'article_id', article_id), selectArticleById(article_id)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            article = resolvedPromises[1]
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const promises = [checkCategoryExists('articles', 'article_id', article_id), selectCommentsByArticleId(article_id)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            comments = resolvedPromises[1]
            res.status(200).send({ comments })
        })
        .catch(next)
}

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    const promises = [checkCategoryExists('articles', 'article_id', article_id), insertCommentByArticleId(article_id, username, body)]

    Promise.all(promises)
        .then(resolvedPromises => {
            const comment = resolvedPromises[1]
            res.status(201).send({ comment })
        })
        .catch(next)
}