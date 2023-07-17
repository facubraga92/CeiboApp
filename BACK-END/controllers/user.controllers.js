const { generateToken } = require("../config/tokens");
const userModel = require("../schemas/User");

const userRegister = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    let user = await userModel.findOne({ email });

    console.log(user);

    if (user) {
      return res.status(500).send("Usuario ya existe");
    }

    user = new userModel({
      name,
      lastName,
      email,
      password,
    });

    await user.save();

    return res.status(201).send("Usuario creado");
  } catch (error) {
    return res.status(500).send(error);
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
        associatedCustomers: user.associatedCustomers,
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
    const members = await userModel.find(
      {},
      "name lastName email role associatedCustomers"
    );
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

const updateUserCustomer = async (req, res, next) => {
  const id = req.params.id; // Obtener el ID del usuario desde los parámetros de la solicitud
  const {
    name,
    lastName,
    email,
    role,
    associatedCustomers,
    associatedProjects,
  } = req.body; // Obtener los datos actualizados del usuario desde el cuerpo de la solicitud

  try {
    // Buscar el usuario por ID
    const user = await userModel.findById(id);

    // Si no se encuentra el usuario, devolver un error
    if (!user) {
      const error = new Error("El usuario no existe");
      error.statusCode = 404;
      throw error;
    }

    // Actualizar los campos del usuario con los nuevos datos
    user.associatedCustomers = associatedCustomers;

    // Guardar los cambios en la base de datos
    const result = await user.save();

    // Devolver el resultado actualizado
    res.status(200).json({
      message: "Usuario actualizado exitosamente.",
    });
  } catch (error) {
    next(error);
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
