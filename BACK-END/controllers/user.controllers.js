const { generateToken } = require("../config/tokens");
const userModel = require("../schemas/User");

const userRegister = async (req, res) => {
  try {
    let emailDomain = req.body.email.split("@")[1];
    let role = "socio"; // Por defecto el role es "socio"
    if (emailDomain.toLowerCase() === "ceibo.digital") {
      role = "consultor";
      if (req.body.email.toLowerCase() === "admin@ceibo.digital") {
        role = "admin";
      }
    }
    const user = new userModel({ ...req.body, role });
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
        associatedCustomer: user.associatedCustomer,
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

const getAllMembers = async (req, res) => {
  try {
    const members = await userModel.find({});
    if (members.length === 0) {
      return res.status(404).send("No se encontraron miembros.");
    }
    res.send(members);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los miembros.");
  }
};

const changeUserRole = async (req, res) => {
  const id = req.params.id;
  let user = await userModel.findById(id).exec();
  if (!user) {
    res.status(404).send("Usuario no encontrado");
  }
  try {
    user.role == "consultor"
      ? (user.role = "manager")
      : (user.role = "consultor");

    user.save();
    res.send(
      `Role del usuario con id:${id} cambiado exitosamente a ${user.role}`
    );
  } catch (error) {
    res
      .status(500)
      .send(
        "Ha ocurrido un error al intentar cambiar el role del usuario especificado."
      );
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await userModel.findByIdAndDelete(id).exec();
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(202).send(`Usuario con id: ${user.id} eliminado exitosamente.`);
  } catch (error) {
    res
      .status(500)
      .send("Ha ocurrido un error al intentar eliminar el usuario.");
  }
};

module.exports = {
  userRegister,
  loginUser,
  logOut,
  getAllMembers,
  changeUserRole,
  deleteUser,
};
