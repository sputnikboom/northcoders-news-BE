const commentRouter = require('express').Router();
const {updateCommentVote} = require('../controllers/comments');

commentRouter.route("/:comment_id")
.patch(updateCommentVote);

module.exports = commentRouter;