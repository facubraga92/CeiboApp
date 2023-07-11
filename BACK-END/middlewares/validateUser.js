const { validateToken } = require("../config/tokens");

let validateUser = (req, res, next) => {
  let token = req.cookies.token;
  let payload = validateToken(token);
  req.user = payload;

  if (payload !== null) {
    return next();
  }

  res.send("Inicia sesión para una experiencia completa del sitio.");
};

module.exports = validateUser;
