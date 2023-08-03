const mongoose = require("mongoose");
const jwtDecode = require("jwt-decode");

const projectModel = require("../schemas/Project");
const customerModel = require("../schemas/Customer");
const userModel = require("../schemas/User");
const projectNews = require("../schemas/ProjectNews");

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectModel.find();
    res.json(projects);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

const getProjectsByUserId = async (req, res) => {
  try {
    const { token } = req.cookies;
    const decoded = jwtDecode(token);
    const { id } = decoded;
    const user = await userModel.findById(id).populate("associatedCustomers");

    const projects = await projectModel
      .find({
        $or: [
          { managers: user._id },
          { consultors: user._id },
          { customer: user._id },
          { created_by: user._id },
          { customer: { $in: user.associatedCustomers } },
        ],
      })
      .populate("customer")
      .populate({
        path: "customer",
        populate: { path: "associatedProjects" },
      })
      .populate("consultors")
      .populate("managers")
      .populate("news")
      .populate({
        path: "news",
        populate: { path: "userId" },
      })
      .populate({
        path: "news",
        populate: { path: "reply.user" },
      })
      .populate({
        path: "news",
        populate: { path: "associatedProject" },
      })
      .populate({
        path: "news",
        populate: { path: "approved_by" },
      })
      .populate({
        path: "news",
        populate: { path: "logs.user" },
      })

      .populate("created_by")
      .exec();

    // esto es porque si es socio, que filtre y solo devuelva los projectos y novedades en donde las novedades esten aprobadas
    if (user.role === "socio") {
      projects.forEach((project) => {
        project.news = project.news.filter((news) => news.state === "aprobada");
      });
      return res.json(projects.filter((proj) => proj.news.length > 0));
    }

    res.json(projects);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createOneProject = async (req, res) => {
  const project = new projectModel(req.body);
  try {
    const newProject = await project.save();
    const projectId = newProject._id;

    // si da problemas comentar todo el customerModel
    // Asociar el proyecto al cliente correspondiente
    await customerModel.updateOne(
      { _id: req.body.customer },
      { $push: { associatedProjects: projectId } }
    );

    res.status(201).send(projectId);
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

    return await getProjectsByUserId(req, res);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
  const { id } = req.params;
  try {
    const project = await projectModel.findById(id);
    if (project == null) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }
    res.json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addNewsToProjectById = async (req, res) => {
  try {
    const { idProject } = req.params;
    const newsToCreate = req.body;
    const news = await projectNews.create(newsToCreate);
    const user = await userModel.findById(news.userId);

    const newNewsId = news._id;
    const project = await projectModel.findByIdAndUpdate(
      idProject,
      {
        $push: { news: newNewsId },
        $set: { modified_at: new Date() },
      },
      { new: true }
    );

    const log = { user: user, description: "Creada la novedad" };
    news.logs.push(log);
    await news.save();

    return res.send(project);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getAllProjects,
  getOneProject,
  createOneProject,
  getProjectsByUserId,
  addNewsToProjectById,
  deleteOneProject,
};
