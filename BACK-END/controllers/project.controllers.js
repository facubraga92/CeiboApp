const customerModel = require("../schemas/Customer");
const projectModel = require("../schemas/Project");
const userModel = require("../schemas/User");

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
    const projectId = newProject._id;

    // Obtener los IDs de los usuarios asociados al proyecto
    const userIds = [
      ...newProject.consultors,
      ...newProject.managers,
      ...newProject.partners,
    ];

    // Actualizar el campo associatedProjects de cada usuario correspondiente
    await userModel.updateMany(
      { _id: { $in: userIds } },
      { $push: { associatedProjects: projectId } }
    );

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

    // Obtener los IDs de los usuarios asociados al proyecto
    const userIds = [
      ...project.consultors,
      ...project.managers,
      ...project.partners,
    ];

    // Obtener el ID del cliente asociado al proyecto
    const customerId = project.customer;

    // Eliminar el proyecto
    await projectModel.deleteOne({ _id: projectId });

    // Eliminar el ID del proyecto del campo associatedProjects de cada usuario correspondiente
    await userModel.updateMany(
      { _id: { $in: userIds } },
      { $pull: { associatedProjects: projectId } }
    );

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

    // Obtener los IDs de los usuarios asociados al proyecto antes de la actualización
    const oldUserIds = [
      ...project.consultors,
      ...project.managers,
      ...project.partners,
    ];

    // Actualizar el proyecto
    const updatedProject = await projectModel.findByIdAndUpdate(
      projectId,
      req.body,
      { new: true }
    );

    // Obtener los IDs de los usuarios asociados al proyecto después de la actualización
    const newUserIds = [
      ...updatedProject.consultors,
      ...updatedProject.managers,
      ...updatedProject.partners,
    ];

    // Identificar los IDs de los usuarios que han sido agregados o eliminados del proyecto
    const addedUserIds = newUserIds.filter((id) => !oldUserIds.includes(id));
    const removedUserIds = oldUserIds.filter((id) => !newUserIds.includes(id));

    // Agregar el ID del proyecto al campo associatedProjects de los usuarios agregados
    await userModel.updateMany(
      { _id: { $in: addedUserIds } },
      { $push: { associatedProjects: projectId } }
    );

    // Eliminar el ID del proyecto del campo associatedProjects de los usuarios eliminados
    await userModel.updateMany(
      { _id: { $in: removedUserIds } },
      { $pull: { associatedProjects: projectId } }
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
  deleteOneProject,
  updateOneProject,
};
