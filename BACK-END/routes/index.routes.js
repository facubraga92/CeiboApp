const express = require("express");
const userRouter = require("./user.routes");
const projectRouter = require("./project.routes");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);

apiRouter.use("/projects", projectRouter);

module.exports = apiRouter;
