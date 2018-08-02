const seedDB = require("./seed");
const data = require("./devData/");
//this is bringing in userData, commentData, topicData, articleData
const mongoose = require("mongoose");
const { DB_URL } = require("../config");

mongoose
  .connect(
    DB_URL,
    { useNewUrlParser: true }
  )
  .then(() => seedDB(data))
  .then(() => mongoose.disconnect());
