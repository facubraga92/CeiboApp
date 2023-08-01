import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Input, Grid } from "@nextui-org/react";

import { toast } from "react-toastify";

import jwt_decode from "jwt-decode";
import axios from "axios";
import { envs } from "../config/env/env.config";

const Register = () => {
  const [inputs, setInputs] = useState({});
  const [isChangesOk, setIsChangesOk] = useState(false);
  const [isChanges, setIsChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bloqInputs, setBloqInputs] = useState(false);

  const { VITE_BACKEND_URL } = envs;

  const navigate = useNavigate();

  useEffect(() => {
    Object.keys(inputs).length === 0 ? setIsChanges(false) : setIsChanges(true);

    return inputs.name &&
      inputs.lastName &&
      inputs.email &&
      inputs.password &&
      inputs.confirmPassword &&
      inputs.password === inputs.confirmPassword &&
      isValidEmail(inputs.email)
      ? setIsChangesOk(true)
      : setIsChangesOk(false);
  }, [inputs]);

  const handleModalDropChanges = () => {
    setInputs({});
    return setShowModal(false);
  };

  const handleModalToggle = () => {
    return setShowModal(!showModal);
  };

  function isValidEmail(email) {
    const patronEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patronEmail.test(email);
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value === "") {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputs((values) => ({ ...values, [name]: value }));
    }
    return;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${VITE_BACKEND_URL}/users/register`,
        inputs
      );

      setBloqInputs(true);
      setTimeout(() => {
        return navigate("/login");
      }, 2000);
      handleToast();
      setIsSubmitOk(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToast = () => {
    toast.success("Usuario creado satisfactoriamente", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return;
  };

  const handleCancel = (e) => {
    e.preventDefault();
    return navigate("/");
  };

  return (
    <>
      <Layout hasNotFooter={true} title="Register" />

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
            Registro
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
                  labelPlaceholder="Nombre"
                  color="error"
                  id="name"
                  name="name"
                  value={inputs.name || ""}
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
                <Input
                  style={{ width: "60rem" }}
                  underlined
                  labelPlaceholder="Apellido"
                  color="error"
                  id="lastName"
                  name="lastName"
                  value={inputs.lastName || ""}
                  onChange={handleChange}
                  required
                  disabled={bloqInputs}
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
                <Input
                  style={{ width: "60rem" }}
                  underlined
                  labelPlaceholder="Correo electrónico"
                  color="error"
                  id="email"
                  name="email"
                  value={inputs.email || ""}
                  onChange={handleChange}
                  required
                  disabled={bloqInputs}
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
                  value={inputs.password || ""}
                  onChange={handleChange}
                  required
                  disabled={bloqInputs}
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
                  labelPlaceholder=" Confirmar contraseña"
                  color="error"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={inputs.confirmPassword || ""}
                  onChange={handleChange}
                  required
                  disabled={bloqInputs}
                />{" "}
                {inputs.password != inputs.confirmPassword && (
                  <div>
                    <span className="text-danger">
                      Las contraseñas no coinciden
                    </span>
                  </div>
                )}
              </Grid>
            </Grid.Container>

            <div  className="d-flex justify-content-around s">
              {!isChanges && (
                <Grid onClick={handleSubmit}>
                  <button
                    type="button"
                    value="Volver"
                    className="btn btn-outline-danger w-100 "
                    disabled={isChanges || bloqInputs}
                    onClick={handleCancel}
                  >
                    Volver
                  </button>
                </Grid>
              )}

              {isChanges && (
                <Grid onClick={handleSubmit}>
                  <button
                    type="button"
                    value="Cancelar"
                    className="btn btn-outline-danger w-150 "
                    onClick={handleModalToggle}
                    disabled={bloqInputs}
                  >
                    Cancelar
                  </button>
                </Grid>
              )}
              <Grid onClick={handleSubmit}>
                <button
                  type="button"
                  value={"Registrarse"}
                  className="btn btn-outline-danger w-150"
                  disabled={!isChangesOk || bloqInputs}
                  style={{ pointerEvents: "auto" }}
                >
                  Registrarse
                </button>
              </Grid>
            </div>
          </form>
        </div>
      </div>
      <Modal show={showModal} centered onHide={handleModalToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se perderan todos los cambios</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={handleModalToggle}>
            Volver
          </Button>
          <Button variant="primary" onClick={handleModalDropChanges}>
            Perder cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default Register;
