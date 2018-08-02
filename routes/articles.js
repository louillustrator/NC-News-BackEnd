const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId
} = require("../controllers/articles");

articlesRouter.route("/").get(getAllArticles);
articlesRouter.route("/:article_id").get(getArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

// Add a new comment to an article.This route requires a JSON body with body and created_by key value pairs e.g: {
//   "body": "This is my new comment", "created_by": <mongo id for a user>}

module.exports = articlesRouter;
