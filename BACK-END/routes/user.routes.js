const express = require("express");
const {
  userRegister,
  loginUser,
  logOut,
  getAllMembers,
  deleteUser,
  updateUserCustomer,
} = require("../controllers/user.controllers");
const isLogged = require("../middlewares/isLogged");
const validateUser = require("../middlewares/validateUser");
const isAdmin = require("../middlewares/isAdmin");
const isAdminOrManager = require("../middlewares/isAdminOrManager");
const isManager = require("../middlewares/isManager");


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

userRouter.delete("/admin/members/:id", isAdminOrManager, deleteUser);

userRouter.put("/admin/members/:id", isAdminOrManager, updateUserCustomer);

module.exports = userRouter;
