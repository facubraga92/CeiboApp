const express = require("express");
const {
  userRegister,
  loginUser,
  logOut,
  getAllMembers,
  changeUserRole,
  deleteUser,
} = require("../controllers/user.controllers");
const isLogged = require("../middlewares/isLogged");
const validateUser = require("../middlewares/validateUser");
const isAdmin = require("../middlewares/isAdmin");
const isAdminOrManager = require("../middlewares/isAdminOrManager");

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

userRouter.get("/admin/members", isAdminOrManager, getAllMembers);

userRouter.get("/admin/members/:id", isAdmin, changeUserRole);

userRouter.delete("/admin/members/:id", isAdminOrManager, deleteUser);

userRouter.put("/admin/members/:id", isManager, updateUserCustomer);

module.exports = userRouter;
