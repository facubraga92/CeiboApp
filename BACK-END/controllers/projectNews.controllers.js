const ProjectNews = require("../schemas/ProjectNews");
const Project = require("../schemas/Project");
const getManagersRelevants = require("../utils/utils")
 
exports.createNews = async (req, res) => {
  try {
    const { title, description, userId, associatedProject } = req.body;
    //para probar las rutas en postman y no tener ningun problema comentar los dos if
    if (req.user.role !== "consultor" || req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }
    console.log(title, description, userId, associatedProject);
    const project = await Project.findById(associatedProject);

    if (!project || !project.consultors.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        error: "No autorizado para crear una novedad en este proyecto",
      });
    }

    const news = new ProjectNews({
      title,
      description,
      userId,
      associatedProject,
      state: "pendiente",
    });
    await news.save();

    await getManagersRelevants(news)
    res.status(201).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAllNews = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    const news = await ProjectNews.find({
      associatedProject: req.user.associatedProjects,
    });

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await ProjectNews.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    if (
      (req.user.role === "customer" &&
        !req.user.associatedProjects.includes(news.associatedProject)) ||
      (req.user.role === "consultor" &&
        !news.userId.equals(req.user._id) &&
        !req.user.associatedProjects.includes(news.associatedProject))
    ) {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const news = await ProjectNews.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    if (
      req.user.role !== "consultor" ||
      !news.userId.equals(req.user._id) ||
      news.state !== "pendiente"
    ) {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    news.title = title;
    news.description = description;
    news.state = "modificada";
    await news.save();

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await ProjectNews.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    if (
      req.user.role !== "consultor" ||
      !news.userId.equals(req.user._id) ||
      news.state !== "pendiente"
    ) {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    await news.remove();

    res
      .status(200)
      .json({ success: true, message: "Novedad eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.approveNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await ProjectNews.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    if (
      req.user.role !== "manager" ||
      !news.associatedProject.managers.includes(req.user._id)
    ) {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }

    news.state = "aprobada";
    await news.save();

    res.status(200).json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
