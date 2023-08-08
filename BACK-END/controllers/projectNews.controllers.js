const ProjectNews = require("../schemas/ProjectNews");
const Project = require("../schemas/Project");
const getManagersRelevants = require("../utils/utils");
const User = require("../schemas/User");
const getPartnersAssociate = require("../utils/utilsPartners");

exports.createNews = async (req, res) => {
  try {
    const { title, description, userId, associatedProject } = req.body;
    const news = new ProjectNews({
      title,
      description,
      userId,
      associatedProject,
      state: "pendiente",
    });
    await news.save();
    await getManagersRelevants(news);
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

exports.getNewsProyect = async (req, res) => {
  const projectId = req.params.id;

  try {
    // Buscar el proyecto por su ID para verificar si existe
    const project = await Project.findById(projectId);
    console.log(project);
    if (!project) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    // Obtener las novedades del proyecto por su ID
    const projectNews = await ProjectNews.find({
      associatedProject: projectId,
    }).populate("userId", "username"); // Esto es opcional, para obtener solo el nombre de usuario en lugar de toda la información del usuario.

    res.json(projectNews);
  } catch (err) {
    console.error("Error al obtener las novedades del proyecto:", err);
    res.status(500).json({
      message: "Error del servidor al obtener las novedades del proyecto",
    });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const news = await ProjectNews.findById(id)
      .populate("userId")
      .populate("associatedProject")
      .populate("reply.user");
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
    const { title, description, userId, message } = await req.body;

    const news = await ProjectNews.findById(id);
    const user = await User.findById(userId);
    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    if (news.title && news.title !== title) {
      news.title = title;
      const log = { user: user, description: "Se ha cambiado el titulo" };
      news.logs.push(log);
    }

    if (news.description && news.description !== description) {
      news.description = description;
      const log = {
        user: user,
        description: "Se ha cambiado la descripcion",
      };
      news.logs.push(log);
    }

    if (news.title || news.description) {
      news.state = "modificada";
    }

    if (userId && message) {
      const newComment = {
        user,
        message,
      };

      news.reply.push(newComment);
    }
    await news.save();

    const populatedNews = await ProjectNews.findById(id)
      .populate("reply.user")
      .populate("approved_by")
      .populate("logs.user")
      .populate("userId");

    res.status(200).json({ success: true, data: populatedNews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteNews = async (req, res) => {
  const newsId = req.params.id;

  try {
    const { id } = req.params;
    const news = await ProjectNews.findById(id);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    await ProjectNews.deleteOne({ _id: newsId });

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
    const idUser = req.body.id;
    const news = await ProjectNews.findById(id);
    const userDb = await User.findById(idUser);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    news.approved_date = Date.now();
    news.approved_by = userDb;
    news.state = "aprobada";

    const log = { user: userDb, description: "Se aprobo la novedad" };
    news.logs.push(log);

    await news.save();

    const populatedNews = await ProjectNews.findById(id)
      .populate("reply.user")
      .populate("approved_by")
      .populate("logs.user")
      .populate("userId");
    await getPartnersAssociate(news.associatedProject);
    res.status(200).json({ success: true, data: populatedNews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.addCommentToNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { user, message } = req.body;

    const news = await ProjectNews.findById(id);
    const userDb = await User.findById(user);

    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }

    const newComment = {
      user: userDb,
      message,
    };

    news.reply.push(newComment);
    await news.save();

    const populatedNews = await ProjectNews.findById(id)
      .populate("reply.user")
      .populate("approved_by")
      .populate("logs.user")
      .populate("userId");

    res.json({
      success: true,
      message: "Comentario agregado correctamente",
      data: populatedNews,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateNewsManager = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, userId, message, date } = req.body;

    const news = await ProjectNews.findById(id);
    if (!news) {
      return res
        .status(404)
        .json({ success: false, error: "Novedad no encontrada" });
    }
    if (req.user.role !== "manager") {
      return res.status(403).json({ success: false, error: "Acceso denegado" });
    }
    if (news.title) news.title = title;
    if (news.description) news.description = description;
    if (userId && message && date) {
      const rDate = new Date(date);
      const newComment = {
        userId,
        message,
        rDate,
      };

      news.reply.push(newComment);
    }
    await news.save();

    const populatedNews = await ProjectNews.findById(id)
      .populate("reply.user")
      .populate("approved_by")
      .populate("logs.user")
      .populate("userId");

    res.status(200).json({ success: true, data: "populatedNews" });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};
