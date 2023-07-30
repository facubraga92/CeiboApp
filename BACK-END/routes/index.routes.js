const express = require("express");
const userRouter = require("./user.routes");
const projectRouter = require("./project.routes");
const projectNewsRouter = require("./projectNews.routes");
const customerRouter = require("./customer.routes");
const apiRouter = express.Router();

apiRouter.use("/users", userRouter);
apiRouter.use("/projects", projectRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/news", projectNewsRouter);
module.exports = apiRouter;
