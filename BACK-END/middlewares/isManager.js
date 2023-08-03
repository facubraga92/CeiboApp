const userModel = require("../schemas/User");
const jwtDecode = require("jwt-decode");

async function isManager(req, res, next) {
  const managerId = req.body.managers;
  const { token } = req.cookies;
  try {
    if (!token)
      return res.status(403).json({ message: "Acceso solo para managers" });

    const decoded = jwtDecode(token);
    if (decoded.role !== "manager")
      return res.status(403).json({ message: "Acceso solo para managers" });

    next();
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

module.exports = isManager;
