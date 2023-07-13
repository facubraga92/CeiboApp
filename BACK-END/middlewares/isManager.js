const { validateToken } = require("../config/tokens");

const isManager = (req, res, next) => {
  let token = req.cookies.token;
  let payload = validateToken(token);
  req.user = payload;
  if (req.user?.role !== "manager") {
    return res
      .status(403)
      .send("Acceso denegado. Debe ser un Manager para continuar.");
  }
  next();
};

module.exports = isManager;

