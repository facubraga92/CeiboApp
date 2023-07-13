const express = require("express");
const userRouter = require("./user.routes");
const projectRouter = require("./project.routes");
const projectNewsRouter = require("./projectNews.routes");
const apiRouter = express.Router();

apiRouter.use("/users", userRouter);

apiRouter.use("/projects", projectRouter);

apiRouter.use("/news", projectNewsRouter);
module.exports = apiRouter;
