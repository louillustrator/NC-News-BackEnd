const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const { DB_URL } =
  process.env.NODE_ENV !== "production" ? require("./config") : process.env;

//internet thing
app.use(cors());

app.use("/api", express.static(__dirname + "/public"));

//remeber to connect to mongoose!!
mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  next({
    status: 404,
    msg:
      "please check the route, that one is not valid. Use /api to view the index"
  });
});

// app.use("/", (req, res, next) => {
//   res.status(200).send({
//     msg: "welcome to the homepage, please use /api to view the index"
//   });
// });

app.use((err, req, res, next) => {
  if (res.status(err.status).send(err));
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
