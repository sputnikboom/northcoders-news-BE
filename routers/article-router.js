const articleRouter = require("express").Router();
const { getAllArticles, getArticleById, updateVote } = require("../controllers/articles");
const { getCommentsByArticle, addNewComment } = require('../controllers/comments')

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article_id/comments")
.get(getCommentsByArticle)
.post(addNewComment)

articleRouter.route("/:article_id")
.get(getArticleById)
.patch(updateVote);

module.exports = articleRouter;
