const articleRouter = require('express').Router();
const {getAllArticles} = require('../controllers/articles');

articleRouter.route('/').get(getAllArticles)

module.exports = articleRouter;