const { validateToken } = require("../config/tokens");

const isAdmin = (req, res, next) => {
  let token = req.cookies.token;
  let payload = validateToken(token);
  req.user = payload;
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .send("Acceso denegado. Debe ser un administrador para continuar.");
  }
  next();
};

module.exports = isAdmin;
