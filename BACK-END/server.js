const { SERVER_PORT } = require("./config");
const db = require("./config/db");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require('cors')

const costumerModel = require("./schemas/Costumer");
const projectModel = require("./schemas/Project");
const userModel = require("./schemas/User");
const projectNewsModel = require("./schemas/ProjectNews");
const apiRouter = require("./routes/index.routes");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use("/api", apiRouter);

app.listen(SERVER_PORT, () => {
  console.log(`servidor conectado puerto http://localhost:${SERVER_PORT}`);
});

//CONEXION A LA BD
db();

// Crear un nuevo costumer
// const costumer = new costumerModel({
//   name: "Ejemplo Costumer",
//   address: "Dirección de Ejemplo",
//   contactInfo: "Información de contacto de Ejemplo",
// });

// // Crear un nuevo proyecto
// const project = new projectModel({
//   name: "Ejemplo Proyecto",
//   description: "Descripción de Ejemplo",
//   customer: costumer._id, // Asignar el ID del costumer creado anteriormente
// });

// Crear un nuevo usuario
// const user = new userModel({
//   name: "Ejemplo Usuario",
//   email: "ejemplo@usuario.com",
//   password: "contraseña",
// associatedCostumer: costumer._id, // Asignar el ID del costumer creado anteriormente
// associatedProject: [project._id], // Asignar el ID del proyecto creado anteriormente
// });

// // Crear una nueva noticia de proyecto
// const projectNews = new projectNewsModel({
//   title: "Ejemplo Noticia",
//   description: "Descripción de la noticia de ejemplo",
//   associatedProject: project._id, // Asignar el ID del proyecto creado anteriormente
//   reply: [
//     {
//       userId: user._id, // Asignar el ID del usuario creado anteriormente
//       message: "Mensaje de ejemplo",
//       date: new Date(),
//     },
//   ],
// });

// Guardar los documentos en la base de datos
// Promise.all([
// costumer.save(),
//   project.save(),
//   user.save(),
//   projectNews.save(),
// ])
// .then((result) => {
//   console.log("Documentos creados y guardados:", result);
// })
// .catch((error) => {
//   console.error("Error al crear y guardar los documentos:", error);
// });
