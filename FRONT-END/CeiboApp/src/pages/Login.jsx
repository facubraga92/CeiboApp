import React, { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";
import { useDispatch } from "react-redux";
import { setUser } from "../state/user";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [isFormOk, setIsFormOk] = useState(false);
  const [disableInputs, setDisableInputs] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return setIsFormOk(inputs.email && inputs.password);
  }, [inputs]);

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
    const { email, password } = inputs;
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

  const handleCancel = (e) => {
    e.preventDefault();
    setDisableInputs(true);

    setTimeout(() => {
      // ahora va al home, podria ir a la vista anterior
      navigate("/");
    }, 200);
  };

  return (
    <Layout title="Login">
      <div className="container mt-5 col-12 col-lg-6">
        <div className="d-flex flex-column justify-content-center align-items-center flex-md-row">
          <div className="col text-center">
            <button className="btn btn-primary">
              Iniciar sesión con Google
            </button>
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
                  disabled={disableInputs}
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
                  disabled={disableInputs}
                  required
                />
              </div>
              <div className="d-flex justify-content-center">
                <input
                  type="button"
                  className="btn btn-outline-warning mx-2"
                  value={"Volver"}
                  onClick={handleCancel}
                />
                <input
                  type="submit"
                  className="btn btn-primary"
                  value={"Iniciar sesión"}
                  disabled={!isFormOk || disableInputs}
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
