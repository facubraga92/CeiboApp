import React, { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Select, DatePicker } from "antd";

/**
 * Componente FormNovedades
 * Formulario para crear novedades.
 */
export default function FormNovedades() {
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectInput, setSelectInput] = useState("default");
  const [inputs, setInputs] = useState({
    prioridad: "1",
    date: new Date().toISOString().split("T")[0],
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isChangesOk, setIsChangesOk] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsChangesOk(
      Object.keys(inputs).length > 1 && inputs.detalles && inputs.tipoNovedad
    );
    console.log(inputs);
  }, [inputs]);

  /**
   * Maneja el cambio de opción.
   * Actualiza el estado de la opción seleccionada y marca los checkboxes correspondientes.
   *
   * @param {Event} event - Evento del cambio de opción.
   */
  const handleOptionChange = (event) => {
    const selectedValue = parseInt(event.target.value);
    setSelectedOption(selectedValue);

    if (selectedValue) {
      for (let i = 1; i <= selectedValue; i++) {
        document.getElementById(`checkbox-${i}`).checked = true;
      }
    }
    return;
  };

  /**
   * Maneja el cambio en los campos del formulario.
   * Actualiza el estado correspondiente según el campo modificado.
   *
   * @param {Event} event - Evento del cambio en los campos del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (value === "") {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      if (name == "tipoNovedad") setSelectInput(value);
      if (name == "prioridad") handleOptionChange(event);
      return setInputs((values) => ({ ...values, [name]: value }));
    }
    return;
  };

  /**
   * Maneja el envío del formulario.
   * Realiza la validación y el envío de datos.
   *
   * @param {Event} event - Evento del envío del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (selectInput === "default") return setFormSubmitted(false);

    setShowModalSave(false);
    toast.success(`Novedad prioridad: ${inputs.prioridad} creada`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // por ahora no hace nada, simula un envio de datos, a la espera de la ruta para crear novedades
    return setTimeout(() => {
      return navigate("/home");
    }, 2000);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (Object.keys(inputs).length === 1) return navigate("/");
    return;
  };

  const toggleDisable = (e) => {
    setIsEditable(!isEditable);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const toggleModalSave = () => {
    setShowModalSave(!showModalSave);
  };

  const handleModalDropChanges = () => {
    setInputs({ prioridad: 1 });
    setSelectInput("default");
    setShowModal(false);
  };

  return (
    <Layout title={"Crear Novedad"}>
      <div className="mt-0 p-4 mt-md-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-6">
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between mb-0 mb-md-4">
              <div>
                <h5>Nombre_Proyecto</h5>
                <h2>Proyecto_XXXXXXXX</h2>
              </div>
              <div>
                <input
                  className="form-control"
                  type="date"
                  name="date"
                  id="date"
                  onChange={handleChange}
                  value={inputs.date}
                />
              </div>
            </div>

            <form method="post" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="detalles">Detalles</label>
                <textarea
                  type="text"
                  className="form-control"
                  id="detalles"
                  name="detalles"
                  rows={4}
                  placeholder="Detalles acerca de la novedad"
                  value={inputs.detalles || ""}
                  onChange={handleChange}
                  required
                  disabled={!isEditable || formSubmitted}
                />
              </div>

              <div className="form-group">
                <label htmlFor="comentarios">Comentarios</label>
                <input
                  type="text"
                  className="form-control"
                  id="comentarios"
                  name="comentarios"
                  placeholder="Comentarios de la novedad"
                  value={inputs.comentarios || ""}
                  onChange={handleChange}
                  disabled={!isEditable || formSubmitted}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipoNovedad">Tipo de Novedad</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const res = {
                        target: {
                          name: "tipoNovedad",
                          value: e,
                        },
                      };

                      handleChange(res);
                    }}
                    className=""
                    defaultValue="Seleccione un tipo de novedad"
                    value={inputs.tipoNovedad || ""}
                    options={[
                      {
                        value: "Seleccione un tipo de novedad",
                        label: "Seleccione un tipo de novedad",
                        disabled: true,
                      },
                      {
                        value: "Tipo 1",
                        label: "Tipo 1",
                      },
                      {
                        value: "Tipo 2",
                        label: "Tipo 2",
                      },
                      {
                        value: "Tipo 3",
                        label: "Tipo 3",
                      },
                    ]}
                  />
                </div>
              </div>

              <label>Prioridad</label>
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((option) => (
                  <label key={option} className="form-check">
                    <input
                      type="checkbox"
                      id={`checkbox-${option}`}
                      name="prioridad"
                      value={option}
                      checked={selectedOption >= option}
                      onChange={handleChange}
                      className="d-none"
                      disabled={!isEditable || formSubmitted}
                    />
                    <div className="checkbox-icon pb-4 display-4">
                      {selectedOption >= option ? (
                        <TiStarFullOutline />
                      ) : (
                        <TiStarOutline />
                      )}
                    </div>
                  </label>
                ))}
              </div>

              <div className="d-flex justify-content-center">
                {Object.keys(inputs).length === 1 ? (
                  <input
                    className="btn btn-outline-warning col-sm-3 col-md-2 mx-2 "
                    value={"Volver"}
                    type="button"
                    onClick={handleCancel}
                    disabled={formSubmitted}
                  />
                ) : (
                  <input
                    className="btn btn-danger col-sm-3 col-md-2 mx-2"
                    value={"Cancelar"}
                    type="button"
                    onClick={toggleModal}
                    disabled={formSubmitted}
                  />
                )}
                {isEditable ? (
                  <input
                    type="button"
                    className="btn btn-primary col-sm-3 col-md-2"
                    value={"Crear"}
                    disabled={!isChangesOk}
                    onClick={toggleModalSave}
                  />
                ) : (
                  <input
                    type="button"
                    className="btn btn-primary col-sm-3 col-md-2"
                    value={"Editar"}
                    onClick={toggleDisable}
                    disabled={formSubmitted}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Modal show={showModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancelar cambios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se perderan todos los cambios</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Volver
          </Button>
          <Button variant="secondary" onClick={handleModalDropChanges}>
            Perder cambios
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalSave} centered>
        <Modal.Header closeButton>
          <Modal.Title>¿Agregar novedad?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Se agregara la novedad al proyecto</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModalSave}>
            Volver
          </Button>
          <Button variant="secondary" onClick={handleSubmit}>
            Agregar novedad
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
