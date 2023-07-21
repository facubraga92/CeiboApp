import Layout from "../components/layouts/Layout";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";

export default function Profile() {
  const [isChanges, setIsChanges] = useState(false);
  const [formOk, setFormOk] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);

  const navigate = useNavigate();

  // INICIALIZAR CON VALORES DESDE LA API
  const [inputs, setInputs] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "prueba@prueba.com",
  });

  const [initialState, setInitialState] = useState({
    name: "nombre prueba",
    lastName: "lastName prueba",
    email: "prueba@prueba.com",
  });

  useEffect(() => {
    console.log(inputs);
    return setIsChanges(
      JSON.stringify(inputs) !== JSON.stringify(initialState)
    );
  }, [inputs]);

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
    return;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setDisabled(true);
    setInitialState(inputs);
    setIsChanges(false);
    toggleShowModalSave();
    handleToast();
    console.log(inputs);
    // por ahora no hace nada REVISAR
    return;
  };

  const handleRedirect = () => {
    if (isChanges) {
      setFormOk(true);
      return setTimeout(() => {
        navigate("/home"); // redirige al home por ahora
      }, 1000);
    } else {
      navigate("/home"); // redirige al home por ahora
    }
    return;
  };

  const toggleShowModalSave = () => {
    return setShowModalSave(!showModalSave);
  };

  const handleModalDropChanges = () => {
    setInputs(initialState);
    setIsChanges(false);
    setShowModal(false);
    setDisabled(!disabled);
  };

  const handleModalToggle = () => {
    return setShowModal(!showModal);
  };

  const handleToast = () => {
    toast.success("Cambios guardados", {
      position: "top-right", // Posición de la notificación
      autoClose: 3000, // Tiempo en milisegundos antes de cerrarse automáticamente
      hideProgressBar: false, // Mostrar la barra de progreso
      closeOnClick: true, // Cerrar al hacer clic en la notificación
      pauseOnHover: true, // Pausar al pasar el ratón sobre la notificación
      draggable: true, // Hacer arrastrable la notificación
    });
  };
  return (
    <Layout title="Profile">
      <div className="mt-4 p-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-4">
            <div>
              <h2>Editar Perfil</h2>
            </div>
            <div className="">
              <form action="" method="post" onSubmit={toggleShowModalSave}>
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
                        type="button"
                        value={"Guardar"}
                        className="btn btn-primary col-sm-3 col-md-2 mx-2"
                        disabled={!isChanges || Object.keys(inputs).length < 3}
                        onClick={toggleShowModalSave}
                      />
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
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
      <Modal show={showModalSave} centered onHide={toggleShowModalSave}>
        <Modal.Header closeButton>
          <Modal.Title>¿Guardar cambios?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Se guardaran los cambios</Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={toggleShowModalSave}>
            Volver
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
