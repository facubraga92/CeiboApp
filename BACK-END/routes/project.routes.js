const express = require("express");

const projectRouter = express.Router();
const {
  getAllProjects,
  getOneProject,
  createOneProject,
  deleteOneProject,
  updateOneProject,
} = require("../controllers/project.controllers");
const isManager = require("../middlewares/isManager");

projectRouter.get("/getAll", getAllProjects);

projectRouter.post("/create", isManager, createOneProject);

projectRouter.get("/:id", getOneProject);

projectRouter.delete("/:id", isManager, deleteOneProject);

projectRouter.put("/:id", isManager, updateOneProject);

module.exports = projectRouter;
