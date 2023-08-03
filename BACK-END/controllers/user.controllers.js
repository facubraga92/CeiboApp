const { generateToken, validateToken } = require("../config/tokens");
const userModel = require("../schemas/User");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../utils/mail/mailService");
const generateMailOptions = require("../utils/mail/registrationMail");

const userRegister = async (req, res) => {
  try {
    let emailDomain = req.body.email.split("@")[1];
    let role = "socio";
    if (emailDomain.toLowerCase() === "ceibo.digital") {
      role = "consultor";
      if (req.body.email.toLowerCase() === "admin@ceibo.digital") {
        req.body.isValidated = true;
        role = "admin";
      }
    }
    const code = uuidv4();

    const user = new userModel({ ...req.body, role, code });
    await user.save();

    const email = req.body.email;

    const token = generateToken({ email, code });

    const replacedDotsToken = token.replaceAll(".", "@");
    const mailOptions = generateMailOptions(user, replacedDotsToken);
    sendMail(mailOptions);

    res.send(`Usuario creado exitosamente! ${user.email}`);
  } catch (error) {
    if (error.errors) {
      const errorMessage = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      res.status(400).send(errorMessage);
    } else {
      res.status(500).send(error.message || "Error al crear el usuario");
    }
  }
};

const verifyAccount = async (req, res) => {
  const token = req.params.token;
  try {
    const decoded = validateToken(token);

    if (!decoded || !decoded.email || !decoded.code) {
      return res.status(400).send("Token de verificación inválido.");
    }

    const { email, code } = decoded;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send("Usuario incorrecto/inexistente.");
    }

    if (user.code === code) {
      if (!user.isValidated) {
        user.isValidated = true;
        await user.save();
        return res.send("Usuario validado exitosamente!");
      } else {
        return res.send("Este usuario ya se encuentra validado.");
      }
    }

    return res.status(401).send("Código de validación incorrecto.");
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Hubo un error al intentar validar el usuario.");
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });

    if (!user) return res.status(401).send("Usuario incorrecto/inexistente.");

    const passwordMatch = await user.comparePassword(req.body.password);
    if (passwordMatch) {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        lastName: user.lastName,
        role: user.role,
        isValidated: user.isValidated,
        picture: user.picture,
      };
      const token = generateToken(payload);
      return res.cookie("token", token).send(payload);
    } else {
      return res.status(404).send("Contraseña incorrecta.");
    }
  } catch (error) {
    return res.status(500).send("Error al intentar logear");
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

const updateUserCustomer = async (req, res, next) => {
  const id = req.params.id;
  const { name, lastName, email, role, associatedCustomers } = req.body;

  try {
    console.log("entre al try");
    const user = await userModel.findById(id);

    if (!user) {
      const error = new Error("El usuario no existe");
      error.statusCode = 404;
      throw error;
    }

    user.name = name || user.name;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.associatedCustomers = associatedCustomers || user.associatedCustomers;

    const result = await user.save();

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

const googleVerify = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  } catch (error) {
    return res.status(500).send("Error al verificar el correo electrónico.");
  }
};

const getMemberById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findById(id);
    return res.send(user);
  } catch (error) {
    return res.status(500);
  }
};

const getMembersByRole = async (req, res) => {
  const { rol } = req.params;

  try {
    const users = await userModel.find({ role: rol });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500);
  }
};

module.exports = {
  userRegister,
  loginUser,
  logOut,
  getAllMembers,
  deleteUser,
  updateUserCustomer,
  googleVerify,
  verifyAccount,
  getMemberById,
  getMembersByRole,
};
