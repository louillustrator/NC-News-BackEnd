const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");
const commentRouter = require("./comments");
const userRouter = require("./users");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.render("index");
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

module.exports = apiRouter;
