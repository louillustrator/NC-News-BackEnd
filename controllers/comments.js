const { Topic, Article, User, Comment } = require("../models");

//update a comments votes
const updateVoteByCommentId = (req, res, next) => {
  const { vote } = req.query;
  const { comment_id } = req.params;
  Comment.findById({ _id: `${comment_id}` })
    .then(comment => {
      if (comment === null) {
        throw { status: 404, msg: "that is not a valid comment id" };
      }

      const amount = vote === "up" ? 1 : vote === "down" ? -1 : 0;

      return Comment.findByIdAndUpdate(
        comment_id,
        { $inc: { votes: amount } },
        { new: true }
      );
    })
    .then(comment => {
      res.status(200).send({ comment });
    })
    .catch(err => {
      if (err.name === "CastError") {
        next({ status: 400, msg: "not a valid comment id" });
      }
      next(err);
    });
};

//delete a comment using the id
const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  return Comment.findByIdAndRemove(comment_id)
    .then(comment => {
      if (comment) res.status(200).send({ msg: "comment succesfully deleted" });
      else {
        next({ status: 400, msg: "this comment doesn't exist!" });
      }
    })
    .catch(next);
};

module.exports = { deleteCommentById, updateVoteByCommentId };
