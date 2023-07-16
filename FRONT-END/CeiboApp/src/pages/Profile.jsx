import Layout from "../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import { redirect, useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

export default function Profile() {
  const [isChanges, setIsChanges] = useState(false);
  const [formOk, setFormOk] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  // INICIALIZAR CON VALORES DESDE LA API
  const [inputs, setInputs] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "email prueba",
  });

  const [initialState, setInitialState] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "email prueba",
  });

  useEffect(() => {
    return setIsChanges(
      JSON.stringify(inputs) !== JSON.stringify(initialState)
    );
  }, [inputs]);

  const [disabled, setDisabled] = useState(true);

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

  const handleDisabled = () => {
    return setDisabled(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (isChanges) {
      return setShowModal(true);
    } else {
      setInputs(initialState);
      setDisabled(!disabled);
    }
  };

  const handleCancelChanges = (e) => {
    e.preventDefault();
    if (isChanges) return setShowModal(true);
    return handleCancel(e);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isChanges) return;
    // por ahora no hace nada, simula un envio de datos, a la espera de la ruta para editar perfil
    return handleRedirect();
  };

  const handleRedirect = () => {
    if (isChanges) {
      setFormOk(true);
      return setTimeout(() => {
        navigate("/"); // redirige al home por ahora
      }, 1000);
    } else {
      navigate("/"); // redirige al home por ahora
    }
  };

  const handleModalDropChanges = () => {
    setInputs(initialState);
    setShowModal(false);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  if (formOk)
    return (
      <Layout title={"Edit Ok"}>
        <div className="container">
          <div className="text-center mt-5">
            <h2 className="text-primary display-4">
              Usuario editado correctamente
            </h2>
          </div>
        </div>
      </Layout>
    );
  return (
    <Layout title="Profile">
      <div className="mt-4 p-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-4">
            <div>
              <h2>Editar Perfil</h2>
            </div>
            <div className="">
              <form action="" method="post" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    id=""
                    className="form-control"
                    value={inputs.name || ""}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    id=""
                    className="form-control"
                    value={inputs.lastName || ""}
                    onChange={handleChange}
                    disabled={disabled}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="">Email</label>
                  <input
                    type="text"
                    name="email"
                    id=""
                    className="form-control"
                    value={inputs.email || ""}
                    onChange={handleChange}
                    disabled
                  />
                </div>

                <div className="d-flex justify-content-center">
                  {disabled ? (
                    <>
                      <input
                        className="btn btn-outline-warning col-sm-3 col-md-2 mx-2 "
                        value={"Volver"}
                        type="button"
                        onClick={handleRedirect}
                      />
                      <input
                        type="button"
                        value="Editar"
                        onClick={handleDisabled}
                        className="btn btn-primary col-sm-3 col-md-2 mx-2"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="button"
                        value="Cancelar"
                        onClick={handleCancel}
                        className="btn btn-danger col-sm-3 col-md-2 mx-2"
                      />
                      <input
                        type="submit"
                        value={"Guardar"}
                        className="btn btn-primary col-sm-3 col-md-2 mx-2"
                        disabled={!isChanges}
                      />
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
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
}
