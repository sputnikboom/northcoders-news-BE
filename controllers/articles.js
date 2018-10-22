const { Article, Comment } = require("../models");
const { getCommentCount } = require("../utils");

const getAllArticles = (req, res, next) => {
  Article.find()
    .populate("created_by")
    .lean()
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, commentCounts]) => {
      const articles = articleDocs.map(article => {
        return {
          ...article,
          comment_count: commentCounts.filter(
            comment => comment.belongs_to == `${article._id}`
          ).length
        };
      });
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  Article.find({ belongs_to: req.params.topic_slug })
    .lean()
    .populate("created_by")
    .then(articleDocs => {
      return Promise.all([articleDocs, Comment.find()]);
    })
    .then(([articleDocs, comments]) => {
      const articles = articleDocs.map(article => {
        return {
          ...article,
          comment_count: comments.filter(
            comment => comment.belongs_to == `${article._id}`
          ).length
        };
      });
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  Article.findById(req.params.article_id)
    .populate("created_by")
    .lean()
    .then(articleDoc => {
      if (!articleDoc) throw { status: 404 };
      else return getCommentCount(articleDoc);
    })
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

const updateVote = (req, res, next) => {
  const voteObj = (req.query.vote === "up") ? { votes: +1 } : { votes: -1 };
  return Article.findByIdAndUpdate(
    req.params.article_id,
    { $inc: voteObj },
    { new: true }
  )
    .populate("created_by")
    .lean()
    .then(updatedDoc => {
      if (!updatedDoc) throw { status: 404 };
      else return getCommentCount(updatedDoc);
    })
    .then(article => res.status(200).send(article))
    .catch(next);
};

const addNewArticle = (req, res, next) => {
  const newArticle = Article({
    ...req.body,
    belongs_to: req.params.topic_slug
  }).populate("created_by");
  newArticle
    .save()
    .then(newArticleDoc => {
      console.log(newArticleDoc, "!!!")
      return Article.findById(
        newArticleDoc._id
      ).lean().populate("created_by")
    })
    .then(updatedDoc => {
      updatedDoc.comment_count = 0;
      res.status(201).send(updatedDoc);
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
