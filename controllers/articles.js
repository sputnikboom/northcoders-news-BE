const { Article } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .then(articles => res.send({ articles }))
    .catch(next);
};

const getArticleById = (req, res, next) => {
  Article.findById(req.params.article_id)
    .populate("created_by")
    .then(article => {
      if (!article) throw { status: 404 };
      res.send({ article });
    })
    .catch(next);
};

module.exports = { getAllArticles, getArticleById };
