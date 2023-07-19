import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import jwt_decode from "jwt-decode";

const Register = () => {
  const [inputs, setInputs] = useState({});
  const [isChangesOk, setIsChangesOk] = useState(false);
  const [isChanges, setIsChanges] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bloqInputs, setBloqInputs] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(inputs).length === 0) {
      setIsChanges(false);
    } else {
      setIsChanges(true);
    }

    if (
      inputs.name &&
      inputs.lastName &&
      inputs.email &&
      inputs.password &&
      inputs.confirmPassword &&
      inputs.password === inputs.confirmPassword &&
      isValidEmail(inputs.email)
    )
      return setIsChangesOk(true);
    else {
      return setIsChangesOk(false);
    }
    return;
  }, [inputs]);

  console.log(inputs);

  const handleCallbackResponse = (response) => {
    let userObject = jwt_decode(response.credential);
    console.log(userObject);

    const nameAsPassword = userObject.name;

    setInputs({
      ...inputs,
      confirmPassword: nameAsPassword,
      email: userObject.email,
      lastName: userObject.family_name,
      name: userObject.given_name,
      password: nameAsPassword,
    });

    try {
      // Realizar llamada a la API para enviar los datos de registro
      const apiResponse = axios.post('http://localhost:3000/api/users/register', inputs);

      
      // Lógica adicional si es necesario
      console.log(apiResponse.data); // Acceder a la respuesta de la API

      setBloqInputs(true);
      setTimeout(() => {
        return navigate("/login");
      }, 2000);
      handleToast();
      setIsSubmitOk(true);
    } catch (error) {
      // Manejo de errores si la llamada a la API falla
      console.error(error);
    }
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

  const handleModalDropChanges = () => {
    setInputs({});
    setShowModal(false);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  function isValidEmail(email) {
    const patronEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return patronEmail.test(email);
  }

  const handleChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;
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
    // faltan los llamados a la api para chequear que el usuario no exista y para crearlo en el caso que no exista

    e.preventDefault();
    // Lógica para enviar los datos de registro
    setBloqInputs(true);
    setTimeout(() => {
      return navigate("/login");
    }, 2000);
    handleToast();
    return setIsSubmitOk(true);
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
  };

  const handleCancel = (e) => {
    e.preventDefault();
    return navigate("/");
  };

  return (
    <Layout title="Register">
      <div className="container mt-2 col-sm-12 col-md-6 col-lg-4">
        <h2>Registro</h2>
        <div id="signInDiv"></div>
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
