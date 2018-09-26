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
        console.log(topicDocs[0], userDocs[0])
      return Promise.all ([
        userDocs,
        Article.insertMany(formatArticle(articleData, userDocs))
      ])
    })
    .then(([userDocs, articleDocs]) => {
        console.log(articleDocs[0])
      return Comment.insertMany(
        formatComments(commentData, userDocs, articleDocs)
      );
    })
    .catch(err => {
      console.log("Error encountered seeding database: ", err);
    });
};

module.exports = seedDB;
