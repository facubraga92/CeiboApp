const { validateToken } = require("../config/tokens");

const isAdminOrManager = (req, res, next) => {
  let token = req.cookies.token;
  let payload = validateToken(token);
  req.user = payload;
  if (req.user?.role == "socio" || req.user?.role == "consultor") {
    return res
      .status(403)
      .send(
        "Acceso denegado. Debe ser un administrador o manager para continuar."
      );
  }
  next();
};

module.exports = isAdminOrManager;
