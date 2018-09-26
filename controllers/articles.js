const { Article } = require('../models');

const getAllArticles = (req, res, next) => {
    Article.find()
    .then(articles =>{
        res.send({articles});
    })
    .catch(err => {
        next(err);
    })
}

module.exports = {getAllArticles};