const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");
const commentRouter = require("./comments");
const userRouter = require("./users");
const express = require("express");
const app = express();

///fix meeeeeee
app.get("/", (req, res) => {
  res.render("index");
});
//if not send me as an object

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentRouter);
apiRouter.use("/users", userRouter);

// app.use(express.static(path.join(__dirname, "public")));
module.exports = apiRouter;
