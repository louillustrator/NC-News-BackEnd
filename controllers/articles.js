const { Topic, Article, User, Comment } = require("../models");

// console.log(User_id);

const getAllArticles = (req, res, next) => {
  Article.find({})
    .populate("created_by")
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  Article.findOne({ _id: `${article_id}` })
    .populate("created_by")
    .then(article => {
      article !== null
        ? res.status(200).send({ article })
        : next({
            status: 404,
            msg: "that is not an article id, please try again"
          });
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, msg: "not a valid article id" });
    });
};

// Get all the comments for a individual article

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Comment.find({ belongs_to: `${article_id}` })
    .populate("created_by")
    .then(comments => {
      comments.length !== 0
        ? res.status(200).send({ comments })
        : next({ status: 404, msg: "that article does not exist! " });
    })
    .catch(err => {
      if (err.name === "CastError")
        next({ status: 400, msg: "not a valid article id" });
    });
};

//post a comment for an article

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Article.find({ _id: article_id })

    .then(article => {
      if (article.length === 0)
        throw { status: 404, msg: "that article does not exist!" };
      else {
        let newComment = {
          body: req.body.body,
          belongs_to: article_id,
          created_by: req.body.created_by
        };
        return Promise.all([
          Comment.create(newComment),
          User.findById(req.body.created_by)
        ]);
      }
    })
    // You'll also find it handy if your POST comment endpoint returns the new comment with the created_by property populated with the corresponding user object.
    .then(([comment, user]) => {
      comment.created_by = user;
      res.status(201).send({ comment });
    })
    .catch(err => {
      if (err.name === "CastError") {
        next({ status: 400, msg: "not a valid article id" });
      }
      if (err.name === "ValidationError") {
        next({ status: 400, msg: "Plese check required fields" });
      } else next(err);
    });
};

const updateVoteByArticleId = (req, res, next) => {
  const { vote } = req.query;
  const { article_id } = req.params;
  Article.findById({ _id: `${article_id}` })
    .then(article => {
      if (article === null) {
        throw { status: 404, msg: "that is not a valid mongo id" };
      }

      const amount = vote === "up" ? 1 : vote === "down" ? -1 : 0;

      return Article.findByIdAndUpdate(
        article_id,
        { $inc: { votes: amount } },
        { new: true }
      );
    })
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(err => {
      if (err.name === "CastError") {
        next({ status: 400, msg: "not a valid article id" });
      }
      next(err);
    });
};

module.exports = {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateVoteByArticleId
};
