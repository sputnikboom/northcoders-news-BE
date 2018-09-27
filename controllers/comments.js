const { Comment } = require("../models");

const getCommentsByArticle = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id })
    .populate('created_by')
    .populate('belongs_to')
    .then(comments => {
      if (!comments) throw {status: 404}
      res.send({ comments })})
    .catch(err => next(err));
};

module.exports = { getCommentsByArticle };
