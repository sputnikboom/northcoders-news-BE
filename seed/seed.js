const mongoose = require("mongoose");
const { Topic, User, Article, Comment } = require("../models");
const { formatArticle, formatComments } = require("../utils");

const seedDB = ({ topicData, userData, articleData, commentData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(topicData),
        User.insertMany(userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      return Promise.all ([
        topicDocs,
        userDocs,
        Article.insertMany(formatArticle(articleData, userDocs))
      ])
    })
    .then(([topicDocs, userDocs, articleDocs]) => {
      return Promise.all ([ 
        topicDocs, userDocs, articleDocs,
        Comment.insertMany(formatComments(commentData, userDocs, articleDocs))
      ])
    })
    .catch(err => {
      console.log("Error encountered seeding database: ", err);
    });
};

module.exports = seedDB;
