import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

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
      return navigate("/");
    }, 2000);
    toast.success("Usuario creado satisfactoriamente", {
      position: "top-right", // Posición de la notificación
      autoClose: 3000, // Tiempo en milisegundos antes de cerrarse automáticamente
      hideProgressBar: false, // Mostrar la barra de progreso
      closeOnClick: true, // Cerrar al hacer clic en la notificación
      pauseOnHover: true, // Pausar al pasar el ratón sobre la notificación
      draggable: true, // Hacer arrastrable la notificación
    });
    return setIsSubmitOk(true);
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
              <p>Las contraseñas no coinciden</p>
            )}
          </div>

          <div className="d-flex justify-content-center">
            {!isChanges && (
              <input
                type="button"
                value="Volver"
                className="btn btn-outline-warning col-sm-3 mx-2"
                disabled={isChanges || bloqInputs}
                onClick={handleCancel}
              />
            )}

            {isChanges && (
              <input
                type="button"
                value="Cancelar"
                className="btn btn-danger col-sm-3 mx-2"
                onClick={handleModalToggle}
                disabled={bloqInputs}
              />
            )}
            <input
              type="submit"
              className="btn btn-primary col-sm-3"
              value={"Registrarse"}
              disabled={!isChangesOk || bloqInputs}
            />
          </div>
        </form>
      </div>
      <Modal show={showModal}>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se perderan todos los cambios</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalToggle}>
            Volver
          </Button>
          <Button variant="secondary" onClick={handleModalDropChanges}>
            Perder cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Register;
