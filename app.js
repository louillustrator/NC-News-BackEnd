const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const mongoose = require("mongoose");

const { DB_URL } = require("./config");

//remeber to connect to mongoose!!
mongoose.connect(
  DB_URL,
  { useNewUrlParser: true }
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).send({ msg: "what a fine homepage" });
});

app.use("/api", apiRouter);

app.use("/*", (req, res, next) => {
  if (res.status === 404) res.status(404).send("Path not found");
  else next(err);
});

app.use((err, req, res, next) => {
  //change to work properly!
  if (res.status(err.status).send(err));
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
