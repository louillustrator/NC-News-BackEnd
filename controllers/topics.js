const { Topic, Article, User } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticlesForTopic = (req, res, next) => {
  const { topic_slug } = req.params;

  Article.find({ belongs_to: `${topic_slug}` })
    .then(article => {
      article.length !== 0
        ? res.status(200).send({ article })
        : next({ status: 400, msg: "topic not found" });
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  const { topic_slug } = req.params;

  Topic.find({ slug: topic_slug })
    .then(topic => {
      if (topic.length === 0)
        throw { status: 404, msg: "that topic doesn't exist!" };
      else {
        let newArticle = {
          title: req.body.title,
          body: req.body.body,
          belongs_to: topic_slug,
          created_by: req.body.created_by
        };
        //finding user info so we can insert it into the object we return
        return Promise.all([
          Article.create(newArticle),
          User.findById(req.body.created_by)
        ]);
      }
    })
    .then(([article, user]) => {
      article.created_by = user;
      res.status(201).send({
        message: `new article inserted into ${topic_slug}`,
        article
      });
    })
    .catch(err => {
      err.name === "ValidationError"
        ? next({ status: 400, msg: "please check body for correct input" })
        : next(err);
    });
};

module.exports = { getAllTopics, getArticlesForTopic, addArticleToTopic };
