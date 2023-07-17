const express = require("express");
//const { createProject } = require("../controllers/project.controllers")

const projectRouter = express.Router();
const {
  getAllProjects,
  getOneProject,
  createOneProject,
} = require("../controllers/project.controllers");
const isManager = require("../middlewares/isManager");

projectRouter.get("/getAll", getAllProjects);

projectRouter.post("/create", isManager, createOneProject);

projectRouter.get("/getOne/:id", getOneProject);

module.exports = projectRouter;
