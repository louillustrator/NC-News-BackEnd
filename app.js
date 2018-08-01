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
  res.status(404).send("Path not found");
});

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "23502")
    res.status(400).send(err.message || "Bad Server Request");
  if (err.code === undefined)
    res.status(400).send("Missing or Incorrect input fields");
  if (err.message === "No data returned from the query.")
    res.status(404).send("No matching item found");
  else next(err);
});

module.exports = app;
