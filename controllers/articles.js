const { Topic, Article, User, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  Promise.all([Article.find().populate("created_by"), Comment.find()])
    .then(([article, comment]) => {
      let articlesCounted = article.reduce((acc, curVal) => {
        let obj = {
          votes: curVal.votes,
          _id: curVal._id,
          title: curVal.title,
          created_by: curVal.created_by,
          body: curVal.body,
          created_at: curVal.created_at,
          belongs_to: curVal.belongs_to,
          __v: curVal.__v
        };
        obj.comment_count = 0;
        for (let i = 0; i < comment.length; i++) {
          if (comment[i].belongs_to.toString() === obj._id.toString()) {
            obj.comment_count++;
          }
        }
        acc.push(obj);
        return acc;
      }, []);
      res.status(200).send({ articlesCounted });
    })

    //i need the article id to match belongs_to comment
    // .then(articles => {
    //   res.status(200).send({ articles });
    // })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    Article.findById(article_id).populate("created_by"),
    Comment.find({ belongs_to: article_id })
  ])

    .then(([article, comments]) => {
      article.comment_count = comments.length;

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
      } else {
        next(err);
      }
    });
};

const updateVoteByArticleId = (req, res, next) => {
  const { vote } = req.query;
  const { article_id } = req.params;
  Article.findById({ _id: `${article_id}` })
    .then(article => {
      if (article === null) {
        throw { status: 404, msg: "that is not a valid article id" };
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
