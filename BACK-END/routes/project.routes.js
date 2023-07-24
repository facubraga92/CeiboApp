const express = require("express");
//const { createProject } = require("../controllers/project.controllers")

const projectRouter = express.Router();
const {
  getAllProjects,
  getOneProject,
  createOneProject,
  getProjectsByUserId,
} = require("../controllers/project.controllers");
const isLogged = require("../middlewares/isLogged");
const isManager = require("../middlewares/isManager");

projectRouter.get("/getAll", isLogged, getAllProjects);

projectRouter.get("/getProjectsUser/:id", isLogged, getProjectsByUserId);

projectRouter.post("/create", isManager, createOneProject);

projectRouter.get("/getOne/:id", isLogged, getOneProject);

module.exports = projectRouter;
