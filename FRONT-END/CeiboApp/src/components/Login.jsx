import React, { useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../state/user";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar los datos de inicio de sesión
    // Puedes agregar aquí la llamada a tu API o realizar cualquier otra acción necesaria
    axios
      .post(
        "http://localhost:3000/api/users/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          credentials: "include",
        }
      )
      .then((loginResponse) => {
        // Verificar el token después del inicio de sesión exitoso
        axios
          .get("http://localhost:3000/api/users/me", {
            withCredentials: true,
            credentials: "include",
          })
          .then((tokenVerifyResponse) => {
            dispatch(setUser(tokenVerifyResponse.data));

            message.success(
              `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
            );

            // Mover la navegación a la página principal aquí
            navigate("/");
          })
          .catch((error) => {
            if (error.response && error.response.status === 403) {
              // El token no es válido
              message.error("El token no es válido. Inicia sesión nuevamente.");
            } else {
              message.error(
                `Error en la verificación del token: ${error.message}`
              );
            }
          });
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          message.error(error.response.data);
        } else {
          message.error("Ocurrió un error al procesar la solicitud.");
        }
      });
  };

  return (
    <div className="container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
