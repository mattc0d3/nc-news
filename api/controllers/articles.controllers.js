const { selectArticles, insertArticle, selectArticleById, selectCommentsByArticleId, insertCommentByArticleId, updateArticleById } = require(`${__dirname}/../models/articles.models`)
const { checkCategoryExists, checkPageQueryValid } = require(`${__dirname}/../utils`)

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order, limit, p, total_count } = req.query

    const promises = [selectArticles(topic, sort_by, order, limit, p, total_count)]
    if (total_count === "true") promises.push(selectArticles(topic, sort_by, order, null))
    // if (p !== 0) promises.push(checkPageQueryValid(topic, limit, p))

    Promise.all(promises)
        .then(resolvedPromises => {
            // console.log(resolvedPromises, "<<<<<<<< resolvedPromises")
            const articles = {}
            articles.articles = resolvedPromises[0]
            // console.log(resolvedPromises[0], "<<<<<<<<<<<< resolved promise[i]")
            if (total_count === "true") articles.totalArticles = resolvedPromises[1].length
            res.status(200).send(articles)
        })
    .catch(next)
}


// exports.getArticles = (req, res, next) => {
//     const { topic, sort_by, order, limit, p, total_count } = req.query

//     const promises = selectArticles(topic, sort_by, order, limit, p, total_count)
//     if (total_count) promises.push(selectArticles(topic, sort_by, order))

//     Promise.all(promises)
//         .then(resolvedPromises => {
//             const articles = resolvedPromises[0]
//             if (total_count) const articleCount = resolvedPromises[1]
//             res.status(200).send{ articles: }
//         })
//     selectArticles(topic, sort_by, order, limit, p, total_count).then(articles => {
//         // if (total_count) articles.total_count = article
//         res.status(200).send({ articles })
//     })
//     .catch(next)
// }

exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    promises = [
        checkCategoryExists('users', 'username', author),
        checkCategoryExists('topics', 'slug', topic),
        insertArticle(author, title, body, topic, article_img_url)
    ]

    Promise.all(promises)
        .then(resolvedPromises => {
            const { article_id } = resolvedPromises[2]
            return selectArticleById(article_id)
        })
        .then(postedArticle => {
            res.status(201).send({ postedArticle })
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
    const promises = [
                        checkCategoryExists('articles', 'article_id', article_id), 
                        checkCategoryExists('users', 'username', username), 
                        insertCommentByArticleId(article_id, username, body)
                    ]

    Promise.all(promises)
        .then(resolvedPromises => {
            const comment = resolvedPromises[2]
            res.status(201).send({ comment })
        })
        .catch(next)
}

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    const promises = [checkCategoryExists('articles', 'article_id', article_id), updateArticleById(article_id, inc_votes)]
    
    Promise.all(promises)
        .then(resolvedPromises => {
            article = resolvedPromises[1]
            res.status(201).send({ article })
        })
        .catch(next)
}