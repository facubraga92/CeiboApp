const express = require("express");

const projectRouter = express.Router();
const {
  getAllProjects,
  getOneProject,
  createOneProject,
  getProjectsByUserId,
  addNewsToProjectById,
  deleteOneProject,
} = require("../controllers/project.controllers");
const isLogged = require("../middlewares/isLogged");
const isManager = require("../middlewares/isManager");

projectRouter.get("/getAll", isLogged, getAllProjects);

projectRouter.get("/getProjectsUser/:id", isLogged, getProjectsByUserId);

projectRouter.post("/create", isManager, createOneProject);

projectRouter.get("/project/:id", isLogged, getOneProject);

projectRouter.delete("/project/:id", isManager, deleteOneProject);

projectRouter.post(
  "/project/addNews/:idProject",
  isLogged,
  addNewsToProjectById
);

module.exports = projectRouter;
