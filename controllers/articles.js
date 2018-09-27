const { Article } = require('../models');

const getAllArticles = (req, res, next) => {
    Article.find()
    .then(articles => res.send({articles}))
    .catch(err => next(err))
}

const getArticleById = (req, res, next) => {
    Article.findById(req.params.article_id)
    .then(article => res.send({article}))
    .catch(err => next(err));
}

module.exports = {getAllArticles, getArticleById};