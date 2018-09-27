const { Topic, Article } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => res.send({ topics }))
    .catch(err => next(err));
};

const getTopicArticles = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .then(articles => res.send({ articles }))
    .catch(err => {
      console.log(err);``
      next(err);
    });
};

module.exports = { getAllTopics, getTopicArticles };
