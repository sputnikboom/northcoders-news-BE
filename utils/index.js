const formatArticle = (articleData, userDocs) => {
  return articleData.map(article => {
    return {
      ...article,
      belongs_to: article.topic,
      votes: 0,
      created_by: userDocs.find(user => user.username === article.created_by)
        ._id
    };
  });
};

const formatComments = (commentData, userDocs, articleDocs) => {
  return commentData.map(comment => {
    return {
      ...comment,
      belongs_to: articleDocs.find(
        article => article.title === comment.belongs_to
      )._id,
      created_by: userDocs.find(user => user.username === comment.created_by)
        ._id
    };
  });
};

module.exports = { formatArticle, formatComments };