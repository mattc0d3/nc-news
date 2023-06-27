const { selectArticles, selectArticleById, selectCommentsByArticleId } = require(`${__dirname}/../models/articles.models`)
const { checkCategoryExists } = require(`${__dirname}/../utils`)

exports.getArticles = (req, res, next) => {
    selectArticles().then(articles => {
        res.status(200).send({ articles })
    })
    .catch(err => {
        next(err)
    })
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    const promises = [selectArticleById(article_id), checkCategoryExists('articles', 'article_id', article_id)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            article = resolvedPromises[0]
            res.status(200).send({ article })
        })
        .catch(next)
}

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const promises = [selectCommentsByArticleId(article_id), checkCategoryExists('articles', 'article_id', article_id)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            comments = resolvedPromises[0]
            res.status(200).send({ comments })
        })
        .catch(next)
}