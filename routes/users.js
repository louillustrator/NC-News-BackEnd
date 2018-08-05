const usersRouter = require("express").Router();

const { getUserByUsername, getAllUsers } = require("../controllers/users");

usersRouter.route("/").get(getAllUsers);
usersRouter.route("/:username").get(getUserByUsername);

module.exports = usersRouter;
