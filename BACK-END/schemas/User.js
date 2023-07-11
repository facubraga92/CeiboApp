const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_TOKEN } = require("../config");

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  salt: String,
  role: {
    type: String,
    enum: ["consultor", "manager", "socio", "admin"],
    default: "socio",
  },
  associatedCostumer: { type: mongoose.Schema.Types.ObjectId, ref: "Costumer" },
  associatedProjects: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  ],
});

// Antes de guardar, realiza el hash de la contraseña con salt y valida la contraseña
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  const uppercaseRegex = /^(?=.*[A-Z])/; // Expresión regular para validar al menos una letra mayúscula
  const lengthRegex = /^.{8,}$/; // Expresión regular para validar al menos 8 caracteres

  if (!uppercaseRegex.test(user.password)) {
    const error = new Error(
      "La contraseña debe contener al menos una letra mayúscula."
    );
    return next(error);
  }

  if (!lengthRegex.test(user.password)) {
    const error = new Error("La contraseña debe tener al menos 8 caracteres.");
    return next(error);
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});

// Método para verificar la contraseña
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
