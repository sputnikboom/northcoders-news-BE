const { Topic, Article } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => res.send({ topics }))
    .catch(next);
};

const getTopicArticles = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .then(articles => res.send({ articles }))
    .catch(next);
};

module.exports = { getAllTopics, getTopicArticles };
