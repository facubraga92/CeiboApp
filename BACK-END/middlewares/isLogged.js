const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../config");

const isLogged = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .send("Acceso denegado. Debe iniciar sesión para continuar.");
  }

  try {
    const decoded = jwt.verify(token, SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .send("Acceso denegado. Token de autenticación inválido.");
  }
};

module.exports = isLogged;
