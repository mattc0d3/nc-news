const { selectCommentById, deleteCommentById, updateCommentById } = require(`${__dirname}/../models/comments.models`)
const { checkCategoryExists } = require(`${__dirname}/../utils`)

exports.getCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const promises = [checkCategoryExists('comments', 'comment_id', comment_id), selectCommentById(comment_id)]

    Promise.all(promises)
        .then(resolvedPromises => {
            const comment = resolvedPromises[1]
            res.status(200).send({ comment })
        })
        .catch(next)
}

exports.destroyCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const promises = [checkCategoryExists('comments', 'comment_id', comment_id), deleteCommentById(comment_id)]

    Promise.all(promises)
        .then(resolvedPromises => res.send(204))
        .catch(next)
}

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    const promises = [checkCategoryExists('comments', 'comment_id', comment_id), updateCommentById(comment_id, inc_votes)]

    Promise.all(promises)
        .then(resolvedPromises => {
            const updatedComment = resolvedPromises[1]
            res.status(201).send({ updatedComment })
        })
        .catch(next)
}