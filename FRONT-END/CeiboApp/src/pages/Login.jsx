import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { message } from "antd";
import axios from "axios";
import jwt_decode from "jwt-decode";

import { setGoogleUser, setUser } from "../state/user";
import Layout from "../components/layouts/Layout";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [isFormOk, setIsFormOk] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return setIsFormOk(inputs.email && inputs.password);
  }, [inputs]);

  const handleCallbackResponse = (response) => {
    let userObject = jwt_decode(response.credential);

    dispatch(setGoogleUser(userObject));
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:
        "1084071228016-gr7fc6uvh4hv66lk0ks1d7cfh4mdh3pv.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    if (value === "") {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputs((values) => ({ ...values, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar los datos de inicio de sesión
    // Puedes agregar aquí la llamada a tu API o realizar cualquier otra acción necesaria
    axios
      .post(
        "http://localhost:3000/api/users/login",
        {
          ...inputs,
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
            const user = tokenVerifyResponse.data;
            delete user.status;
            dispatch(setUser(user));
            localStorage.setItem("user", JSON.stringify(user));
            message.success(
              `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
            );

            // Mover la navegación a la página principal aquí
            navigate("/home");
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
    <Layout title="Login">
      <div className="container mt-5 col-12 col-lg-6">
        <div className="d-flex flex-column justify-content-center align-items-center flex-md-row">
          {/* <div className="col text-center">
            <button className="btn btn-primary">
              Iniciar sesión con Google
            </button>
          </div> */}

          <div id="signInDiv"></div>
          {/* {user && (
            <div>
              <img src={user.picture}></img>
              <h3>{user.name}</h3>
            </div>
          )} */}

          <div className="col mt-5 mt-md-0 align-content-center">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit} className="">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
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
                  name="password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={"Iniciar sesión"}
                  disabled={!isFormOk}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
