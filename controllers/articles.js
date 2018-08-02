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

module.exports = { getAllArticles, getArticleById };
