import React, { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import { Axios } from "axios";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
/**
 * Componente FormNovedades
 * Formulario para crear novedades.
 */
export default function FormNovedades() {
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectInput, setSelectInput] = useState("default");
  const [inputs, setInputs] = useState({ prioridad: "1" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isChangesOk, setIsChangesOk] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsChangesOk(
      Object.keys(inputs).length > 1 &&
        inputs.name &&
        inputs.detalles &&
        inputs.tipoNovedad
    );
    console.log(isChangesOk);
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
    const value = event.target.value;
    const name = event.target.name;
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

    toast.success(`Novedad prioridad: ${inputs.prioridad} creada`, {
      position: "top-right", // Posición de la notificación
      autoClose: 3000, // Tiempo en milisegundos antes de cerrarse automáticamente
      hideProgressBar: false, // Mostrar la barra de progreso
      closeOnClick: true, // Cerrar al hacer clic en la notificación
      pauseOnHover: true, // Pausar al pasar el ratón sobre la notificación
      draggable: true, // Hacer arrastrable la notificación
    });

    // por ahora no hace nada, simula un envio de datos, a la espera de la ruta para crear novedades
    console.log(inputs);
    return setTimeout(() => {
      return navigate("/");
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

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleModalDropChanges = () => {
    setInputs({ prioridad: 1 });
    setSelectInput("default");
    setShowModal(false);
  };

  return (
    <Layout title={"Crear Novedad"}>
      <div className="mt-4 p-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-6">
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between">
              <div>
                <h5>Nombre_Proyecto</h5>
                <h2>Proyecto_XXXXXXXX</h2>
              </div>
              <h5>XX/XX/XXXX</h5>
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
                <select
                  className="form-control"
                  id="tipoNovedad"
                  name="tipoNovedad"
                  value={selectInput}
                  onChange={handleChange}
                  required
                  disabled={!isEditable || formSubmitted}
                >
                  <option value="default" disabled>
                    Seleccione tipo de novedad
                  </option>
                  <option value="Novedad prueba">Novedad prueba</option>
                </select>
                {formSubmitted && selectInput === "default" && (
                  <span className="text-danger">
                    Debe seleccionar un tipo de novedad.
                  </span>
                )}
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
                    onClick={handleModalToggle}
                    disabled={formSubmitted}
                  />
                )}
                {isEditable ? (
                  <input
                    type="submit"
                    className="btn btn-primary col-sm-3 col-md-2"
                    value={"Guardar"}
                    disabled={formSubmitted && !isChangesOk}
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
