const userModel = require("../schemas/User");

async function validateManager(req, res, next) {
  const managerId = req.body.managers;
  console.log(managerId);
  try {
    const isManager = await userModel.exists({
      _id: managerId,
      role: "manager",
    });

    if (!isManager) {
      return res
        .status(403)
        .json({ message: "Solo los managers pueden crear proyectos." });
    }
    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = validateManager;
