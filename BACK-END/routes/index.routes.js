const express = require("express");
const userRouter = require("./User.routes");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);

module.exports = apiRouter;
