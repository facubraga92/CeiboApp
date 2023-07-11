const express = require("express");
const {
  userRegister,
  loginUser,
  logOut,
} = require("../controllers/user.controllers");
const isLogged = require("../middlewares/isLogged");
const validateUser = require("../middlewares/validateUser");

const userRouter = express.Router();

userRouter.get("/", isLogged, async (req, res) => {
  res.send("hola, estas en la ruta /api/users");
});

userRouter.post("/register", userRegister);

userRouter.post("/login", loginUser);

userRouter.post("/logout", logOut);

userRouter.get("/me", validateUser, (req, res) => {
  res.status(200).send({ status: "OK", ...req.user });
});

module.exports = userRouter;
