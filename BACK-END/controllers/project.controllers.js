const projectModel = require("../schemas/Project");

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel
      .find()
      .populate("customer", "projectnews", "projects", "users");
    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const createOneProject = async (req, res) => {
  const project = new projectModel(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getOneProject = (req, res) => {
  res.json(res.project);
};

module.exports = {
  getAllProjects,
  getOneProject,
  createOneProject,
};
