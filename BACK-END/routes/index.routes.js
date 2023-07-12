const express = require("express");
const userRouter = require("./User.routes");
const projectNewsRouter = require("./proyectNews.routes");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/news", projectNewsRouter)

module.exports = apiRouter;
