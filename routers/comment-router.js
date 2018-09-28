const commentRouter = require('express').Router();
const {updateCommentVote, removeComment} = require('../controllers/comments');

commentRouter.route("/:comment_id")
.patch(updateCommentVote)
.delete(removeComment);

module.exports = commentRouter;