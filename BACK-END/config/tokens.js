const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require(".");

let generateToken = (payload) => {
  let token = jwt.sign(payload, SECRET_TOKEN, { expiresIn: "2h" });
  return token;
};

let validateToken = (token) => {
  try {
    return jwt.verify(token, SECRET_TOKEN);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  validateToken,
};
