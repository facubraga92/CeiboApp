const express = require("express");
//const { createProject } = require("../controllers/project.controllers")

const projectRouter = express.Router();
const {
  getAllProjects,
  getOneProject,
  createOneProject,
} = require("../controllers/project.controllers");
const getValidationProject = require("../middlewares/validateProject");

projectRouter.get("/getAll", getAllProjects);

projectRouter.post("/create", createOneProject);

projectRouter.get("/getOne/:id", getValidationProject, getOneProject);

module.exports = projectRouter;
