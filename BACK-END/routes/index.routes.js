const express = require("express");
const userRouter = require("./user.routes");
const projectRouter = require("./project.routes");
const customerRouter = require("./customer.routes");

const apiRouter = express.Router();

apiRouter.use("/users", userRouter);

apiRouter.use("/projects", projectRouter);

apiRouter.use("/customers", customerRouter);

module.exports = apiRouter;
