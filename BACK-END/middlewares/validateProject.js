const projectModel = require("../schemas/Project");

async function getProject(req, res, next) {
  try {
    const project = await projectModel
      .findById(req.params.id)
      .populate("customer consultors managers partners");
    if (project == null) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.project = project;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = getProject;
