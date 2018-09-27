const articleRouter = require("express").Router();
const { getAllArticles, getArticleById } = require("../controllers/articles");
const { getCommentsByArticle } = require('../controllers/comments')

articleRouter.route("/").get(getAllArticles);

articleRouter.route("/:article_id/comments").get(getCommentsByArticle)

articleRouter.route("/:article_id").get(getArticleById);

module.exports = articleRouter;
