const { Topic, Article, User, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  Article.find()
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findOne({ _id: `${article_id}` })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, msg: "not a valid article id" });
    });
};

// Get all the comments for a individual article
//not tested from here
const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  Comment.find({ belongs_to: `${article_id}` })
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, msg: "not a valid comment id" });
    });
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Article.find({ _id: article_id })
    .then(article => {
      console.log(article);
      if (article.length === 0)
        throw { status: 404, msg: "that article does not exist!" };
      else {
        let newComment = {
          body: req.body.body,
          belongs_to: article_id,
          created_by: req.body.created_by
        };
        return new Comment(newComment).save();
      }
    })
    // You'll also find it handy if your POST comment endpoint returns the new comment with the created_by property populated with the corresponding user object.
    .then(comment => {
      res.status(201).send({
        msg: "new comment created",
        comment
      });
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, msg: "not a valid article id" });
    });
};
//error handle//test this for if the user id in the body is incorrect

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId
};
