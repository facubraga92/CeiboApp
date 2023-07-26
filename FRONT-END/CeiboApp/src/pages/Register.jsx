import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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

      console.log(response.data);

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
      position: "top-right", // Posición de la notificación
      autoClose: 3000, // Tiempo en milisegundos antes de cerrarse automáticamente
      hideProgressBar: false, // Mostrar la barra de progreso
      closeOnClick: true, // Cerrar al hacer clic en la notificación
      pauseOnHover: true, // Pausar al pasar el ratón sobre la notificación
      draggable: true, // Hacer arrastrable la notificación
    });
    return;
  };

  const handleCancel = (e) => {
    e.preventDefault();
    return navigate("/");
  };

  return (
    <Layout title="Register">
      <div className="container mt-2 col-sm-12 col-md-6 col-lg-4">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={inputs.name || ""}
              onChange={handleChange}
              required
              disabled={bloqInputs}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">
              Apellido
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              value={inputs.lastName || ""}
              onChange={handleChange}
              required
              disabled={bloqInputs}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={inputs.email || ""}
              onChange={handleChange}
              required
              disabled={bloqInputs}
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
              value={inputs.password || ""}
              onChange={handleChange}
              required
              disabled={bloqInputs}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar contraseña
            </label>
            <br />

            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={inputs.confirmPassword || ""}
              onChange={handleChange}
              required
              disabled={bloqInputs}
            />
            {inputs.password != inputs.confirmPassword && (
              <span className="text-danger">Las contraseñas no coinciden</span>
            )}
          </div>

          <div className="d-flex justify-content-center">
            {!isChanges && (
              <input
                type="button"
                value="Volver"
                className="btn btn-outline-warning mr-2 flex-fill w-50"
                disabled={isChanges || bloqInputs}
                onClick={handleCancel}
              />
            )}

            {isChanges && (
              <input
                type="button"
                value="Cancelar"
                className="btn btn-danger mr-2 flex-fill w-50"
                onClick={handleModalToggle}
                disabled={bloqInputs}
              />
            )}
            <input
              type="submit"
              className="btn btn-primary flex-fill w-50"
              value={"Registrarse"}
              disabled={!isChangesOk || bloqInputs}
              style={{ pointerEvents: "auto" }}
            />
          </div>
        </form>
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
    </Layout>
  );
};

export default Register;
