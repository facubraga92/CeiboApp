import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { setUser } from "../state/user";
import Layout from "../components/layouts/Layout";
import { useCredentials } from "../utils/api";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [isFormOk, setIsFormOk] = useState(false);

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
      .post("http://localhost:3000/api/users/googleVerify", {
        email: userState.email,
      })
      .then(async (res) => {
        if (!res.data) {
          await axios.post("http://localhost:3000/api/users/register", {
            ...userState,
          });
        }
        axios
          .post(
            "http://localhost:3000/api/users/login",
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
            navigate("/home");
          });
      });
  };

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
      .post(
        "http://localhost:3000/api/users/login",
        { ...inputs },
        useCredentials
      )
      .then((loginResponse) => {
        const user = loginResponse.data;
        delete user?.status;
        dispatch(setUser(user));
        message.success(
          `Inicio de sesión exitoso: Bienvenido de regreso ${loginResponse.data.name} `
        );
        navigate("/home");
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
          <div id="signInDiv" className="col">
            {handleCallbackResponse}
          </div>
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
