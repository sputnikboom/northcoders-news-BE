const { Comment } = require("../models");

const getCommentsByArticle = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id })
    .populate('created_by')
    .populate('belongs_to')
    .then(comments => {
      if (!comments[0]) throw {status: 404}
      res.send({ comments })})
    .catch(next);
};

module.exports = { getCommentsByArticle };
