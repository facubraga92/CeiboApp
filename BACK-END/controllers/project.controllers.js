const projectModel = require("../schemas/Project");

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel.find();
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

const getOneProject = async (req, res) => {
  try {
    const project = await projectModel
      .findById(req.params.id)
      .populate("customer consultors managers partners");
    if (project == null) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  createOneProject,
};
