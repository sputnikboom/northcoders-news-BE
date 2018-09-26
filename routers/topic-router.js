const topicRouter = require('express').Router();
const {getAllTopics, getTopicArticles} = require('../controllers/topics');

topicRouter.route('/').get(getAllTopics);

topicRouter.route('/:topic_slug/articles').get(getTopicArticles)

module.exports = topicRouter;