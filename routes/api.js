const apiRouter = require("express").Router();
const topicsRouter = require("./topics");

apiRouter.use("/topics", topicsRouter);

apiRouter.get("/", (req, res) => {
  res.status(200).send({ msg: "welcome to the api home page!" });
});

module.exports = apiRouter;
