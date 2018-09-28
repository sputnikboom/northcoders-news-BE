const apiRouter = require('express').Router();
const topicRouter = require('./topic-router');
const articleRouter = require('./article-router');
const userRouter = require('./user-router');
const commentRouter = require('./comment-router');

apiRouter.use('/topics', topicRouter);
apiRouter.use('/articles', articleRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/comments', commentRouter);

// 

module.exports = apiRouter