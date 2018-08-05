const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  updateVoteByCommentId
} = require("../controllers/comments");

commentsRouter
  .route("/:comment_id")
  .put(updateVoteByCommentId)
  .delete(deleteCommentById);

module.exports = commentsRouter;
