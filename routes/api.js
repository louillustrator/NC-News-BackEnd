const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "welcome to the api home page!" });
});

module.exports = apiRouter;
