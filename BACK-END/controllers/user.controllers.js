const { generateToken } = require("../config/tokens");
const userModel = require("../schemas/User");

const userRegister = async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.send(`Usuario creado exitosamente! ${user.email}`);
  } catch (error) {
    if (error.errors) {
      // Si hay errores de validación en el modelo
      const errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      res.status(400).send(errorMessage);
    } else {
      // Otro tipo de error
      res.status(500).send(error.message || "Error al crear el usuario");
    }
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send("Usuario incorrecto/inexistente.");
    }

    const passwordMatch = await user.comparePassword(req.body.password);
    if (passwordMatch) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        role: user.role,
        associatedCostumer: user.associatedCostumer,
        associatedProjects: user.associatedProjects,
      };
      const token = generateToken(payload);
      res.cookie("token", token);
      return res.send(payload);
    } else {
      return res.status(404).send("Contraseña incorrecta.");
    }
  } catch (error) {
    return res.status(500).send("Error al realizar el inicio de sesión.");
  }
};

const logOut = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(204);
};

module.exports = {
  userRegister,
  loginUser,
  logOut
};
