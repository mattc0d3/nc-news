const { deleteCommentById } = require(`${__dirname}/../models/comments.models`)
const { checkCategoryExists } = require(`${__dirname}/../utils`)

exports.destroyCommentById = (req, res, next) => {
    const { comment_id } = req.params
    const promises = [checkCategoryExists('comments', 'comment_id', comment_id), deleteCommentById(comment_id)]

    Promise.all(promises)
        .then(resolvedPromises => res.send(204))
        .catch(next)
}
