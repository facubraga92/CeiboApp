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

const getProjectsUser = async (req, res) => {
  try {
    const userId = req.body.id;

    const projects = await projectModel.find({
      $expr: {
        $or: [{ $in: [userId, "$consultors"] }, { $in: [userId, "$managers"] }],
      },
    });
    console.log(projects);
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
    const projectId = newProject._id;

    // Asociar el proyecto al cliente correspondiente
    await customerModel.updateOne(
      { _id: req.body.customer },
      { $push: { associatedProjects: projectId } }
    );

    res.status(201).send("Proyecto creado con éxito!");
  } catch (error) {
    // Capturar error de validación de Mongoose
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const deleteOneProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    // Obtener el proyecto a eliminar
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    // Obtener el ID del cliente asociado al proyecto
    const customerId = project.customer;

    // Eliminar el proyecto
    await projectModel.deleteOne({ _id: projectId });

    // Eliminar el ID del proyecto del campo associatedProjects del cliente correspondiente
    await customerModel.updateOne(
      { _id: customerId },
      { $pull: { associatedProjects: projectId } }
    );

    res.status(200).json({ message: "Proyecto eliminado con éxito." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOneProject = async (req, res) => {
  const projectId = req.params.id;

  try {
    // Obtener el proyecto existente
    const project = await projectModel.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado." });
    }

    // Actualizar el proyecto
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true }
    );

    res.status(200).json({ message: "Proyecto actualizado con éxito." });
  } catch (error) {
    // Capturar error de validación de Mongoose
    if (error.name === "ValidationError") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const getOneProject = async (req, res) => {
  try {
    const project = await projectModel
      .findById(req.params.id)
      .populate("name description code customer consultors managers");
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
  getProjectsUser,
};
