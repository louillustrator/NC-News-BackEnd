const mongoose = require("mongoose");
const { User, Article, Comment, Topic } = require("../models");

const seedDB = data => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Promise.all([
        Topic.insertMany(data.topicData),
        User.insertMany(data.userData)
      ]);
    })
    .then(([topicDocs, userDocs]) => {
      console.log(`${topicDocs.length} topics inserted`);
      console.log(`${userDocs.length} users inserted`);
      //using .find here inside the map so we can match the name of who created it to the same name the user has inside
      const formattedArticles = data.articleData.map(article => {
        const userId = userDocs.find(
          user => article.created_by === user.username
        )._id;
        //this ._id on the end here refers to user._id
        return { ...article, created_by: userId, belongs_to: article.topic };
        //bringing back the article and changing created by, adding belong to.
      });
      return Promise.all([Article.insertMany(formattedArticles), userDocs]);
    })
    .then(([articleDocs, userDocs]) => {
      console.log(articleDocs);
      console.log(`${articleDocs.length} articles inserted`);
      const formattedComments = data.commentData.map(comment => {
        const createdById = userDocs.find(
          user => comment.created_by === user.username
        )._id;
        const articleRef = articleDocs.find(
          article => comment.belongs_to === article.title
        )._id;
        return {
          ...comment,
          created_by: createdById,
          belongs_to: articleRef
        };
      });
      return Comment.insertMany(formattedComments);
    })
    .then(commentDocs => console.log(`${commentDocs.length} comments inserted`))

    .catch(console.log);
};

module.exports = seedDB;
