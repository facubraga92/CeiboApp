import React, { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

import { Input, Grid } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { setUser } from "../state/user";
import Layout from "../components/layouts/Layout";
import { useCredentials } from "../utils/api";
import { envs } from "../config/env/env.config";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [isFormOk, setIsFormOk] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);
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
    const allowedDomain = "ceibo.digital";

    /*

      *** ESTO PARA SOLO PERMITIR DOMINIOS CEIBO.DIGITAL ***

      if (userObject.email.split("@")[1] !== allowedDomain) {
        toastError(`Solo para dominios de ${allowedDomain}`);
        return; // cortar secuencia
      }

    */

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
            dispatch(setUser(user));
            message.success(
              `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
            );
            navigate("/");
          });
      })
      .catch(() => {
        console.log("hola");
      });
  };
  console.log(inputs);
  const handleChange = (e) => {
    e?.preventDefault();

    const { name, value } = e?.target;
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
    <>
      <Layout hasNotFooter={true} title="Login" />

      <div
        style={{
          height: "90vh",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div>
          <h2
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Iniciar sesión
          </h2>
          <form onSubmit={handleSubmit} className="">
            <Grid.Container
              gap={4}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Grid
                style={{
                  display: "flex",
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50%",
                }}
              >
                <Input
                  style={{ width: "60rem" }}
                  underlined
                  labelPlaceholder="Correo electrónico"
                  color="error"
                  id="email"
                  name="email"
                  value={inputs.email}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid
                style={{
                  display: "flex",
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50%",
                }}
              >
                <Input.Password
                  style={{ width: "57.5rem" }}
                  underlined
                  labelPlaceholder="Contraseña"
                  color="error"
                  id="password"
                  name="password"
                  type="password"
                  value={inputs.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid onClick={handleSubmit}>
                <button
                  type="button"
                  className="btn btn-outline-danger w-100 "
                  disabled={!isFormOk}
                >
                  Iniciar sesión
                </button>
              </Grid>
              <div
                id="signInDiv"
                className="col w-100 d-flex justify-content-center mt-4"
              >
                {handleCallbackResponse}
              </div>
            </Grid.Container>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
