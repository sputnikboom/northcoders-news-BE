const topicRouter = require('express').Router();
const getAllTopics = require('../controllers/topics');
const {getArticlesByTopic, addNewArticle} = require('../controllers/articles')

topicRouter.route('/').get(getAllTopics);

topicRouter.route('/:topic_slug/articles')
.get(getArticlesByTopic)
.post(addNewArticle)

module.exports = topicRouter;