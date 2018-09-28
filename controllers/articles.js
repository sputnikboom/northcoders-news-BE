const { Article } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .then(articles => res.send({ articles }))
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
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

const updateVote = (req, res, next) => {
  if (req.query.vote !== "up" && req.query.vote !== "down")
    throw { status: 400 };

  const voteObj = req.query.vote === "up" ? { votes: +1 } : { votes: -1 };
  return Article.findByIdAndUpdate(
    req.params.article_id,
    { $inc: voteObj },
    { new: true }
  )
    .populate("created_by")
    .then(updatedDoc => {
      res.send(updatedDoc);
    })
    .catch(next);
};

const addNewArticle = (req, res, next) => {
  const newArticle = Article({...req.body, belongs_to: req.params.topic_slug})
  newArticle.save()
  .then(newArticleDoc =>{
    res.status(201).send(newArticleDoc);
  })
  .catch(next);
};

module.exports = {
  getAllArticles,
  getArticlesByTopic,
  getArticleById,
  updateVote,
  addNewArticle
};
