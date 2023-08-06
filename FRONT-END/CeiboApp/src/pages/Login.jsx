import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { setUser } from "../state/user";
import Layout from "../components/layouts/Layout";
import { useCredentials } from "../utils/api";
import { envs } from "../config/env/env.config";
import { Input } from "@nextui-org/react";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [isFormOk, setIsFormOk] = useState(false);
  const { VITE_BACKEND_URL } = envs;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return setIsFormOk(inputs.email && inputs.password);
  }, [inputs]);

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

  const handleCallbackResponse = async (response) => {
    const userObject = await jwt_decode(response.credential);
    const { given_name, family_name, email, picture } = await userObject;

    const userState = {
      password: "12345678A",
      name: given_name,
      lastName: family_name,
      email: email,
      isValidated: true,
      picture,
    };

    await axios
      .post(`${VITE_BACKEND_URL}/users/googleVerify`, {
        email: userState.email,
      })
      .then(async (res) => {
        if (!res.data) {
          await axios.post(`${VITE_BACKEND_URL}/users/register`, {
            ...userState,
          });
        }
        axios
          .post(
            `${VITE_BACKEND_URL}/users/login`,
            {
              email: email,
              password: `${userState.password}`,
            },
            useCredentials
          )
          .then((loginResponse) => {
            const user = loginResponse.data;
            delete user?.status;
            const loggedUser = dispatch(setUser(user));
            message.success(
              `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
            );
            if (loggedUser) navigate("/");
          });
      });
  };

  const handleChange = (e) => {
    e?.preventDefault();
    const { name, value } = e?.target;
    const newValue = value === "" ? null : value; // Cambia a null si el valor es una cadena vacía , para que el input siga teniendo funcionalidad completa.

    setInputs((current) => {
      const { [name]: _, ...rest } = current;
      return { ...rest, [name]: newValue };
    });
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    axios
      .post(`${VITE_BACKEND_URL}/users/login`, { ...inputs }, useCredentials)
      .then((loginResponse) => {
        const user = loginResponse.data;
        delete user?.status;
        dispatch(setUser(user));
        message.success(
          `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
        );
        navigate("/");
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
      <div style={{minHeight:"100%"}} className="container mt-5 col-sm-12 col-md-6 col-lg-4">
        <div className="d-flex flex-column justify-content-center align-items-center flex-md-row">
          <div className="col mt-0 mt-md-0 align-content-center">
            <h2 style={{ marginBottom: "15%" }} className="text-center">
              Iniciar sesión
            </h2>
            <form onSubmit={handleSubmit} className="">
              <div className="mb-5">
                <Input
                  underlined
                  labelPlaceholder="Correo electrónico"
                  color="error"
                  type="email"
                  id="email"
                  name="email"
                  autoComplete={true}
                  fullWidth={true}
                  value={inputs.email}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="mb-3">
                <Input.Password
                  underlined
                  labelPlaceholder="Contraseña"
                  color="error"
                  id="password"
                  name="password"
                  autoComplete={true}
                  value={inputs.password}
                  fullWidth={true}
                  onChange={handleChange}
                  required={true}
                />
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="submit"
                  className="btn btn-outline-danger w-100"
                  value={"Iniciar sesión"}
                  disabled={!isFormOk}
                />
              </div>
              <div
                id="signInDiv"
                className="col w-100 d-flex justify-content-center mt-4"
              >
                {handleCallbackResponse}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
