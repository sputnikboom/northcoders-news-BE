const { Comment } = require("../models");

const getCommentsByArticle = (req, res, next) => {
  Comment.find({ belongs_to: req.params.article_id })
    .populate("created_by")
    .populate("belongs_to")
    .then(comments => {
      res.send({ comments });
    })
    .catch(next);
};

const updateCommentVote = (req, res, next) => {
  if (req.query.vote !== "up" && req.query.vote !== "down")
    throw { status: 400 };
  const voteObj = req.query.vote === "up" ? { votes: +1 } : { votes: -1 };

  return Comment.findByIdAndUpdate(
    req.params.comment_id,
    { $inc: voteObj },
    { new: true }
  )
    .populate("created_by")
    .populate("belongs_to")
    .then(updatedComment => {
      res.send(updatedComment);
    })
    .catch(next);
};

const addNewComment = (req, res, next) => {
  const newComment = Comment({
    ...req.body,
    belongs_to: req.params.article_id
  })

    newComment.save()
    .then(newCommentDoc => {
      return Comment.findById(newCommentDoc._id).populate("created_by").populate("belongs_to").lean()
    })
    .then(commentDoc => {
      res.status(201).send(commentDoc);
    })
    .catch(next);
};

const removeComment = (req, res, next) => {
  Comment.findByIdAndRemove(req.params.comment_id)
    .then(removedComment => {
      res.send(removedComment);
    })
    .catch(next);
};

module.exports = {
  getCommentsByArticle,
  updateCommentVote,
  addNewComment,
  removeComment
};
