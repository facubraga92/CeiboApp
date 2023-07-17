import React, { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { redirect, useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import { Axios } from "axios";

/**
 * Componente FormNovedades
 * Formulario para crear novedades.
 */
export default function FormNovedades() {
  const [selectedOption, setSelectedOption] = useState(1);
  const [selectInput, setSelectInput] = useState("default");
  const [inputs, setInputs] = useState({ prioridad: "1" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formOk, setFormOk] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [isEditable, setIsEditable] = useState(true);

  const navigate = useNavigate();

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

    if (selectInput === "default") return;

    // por ahora no hace nada, simula un envio de datos, a la espera de la ruta para crear novedades
    console.log(inputs);
    return handleRedirect();
  };

  /**
   * Maneja la redirección después de un evento exitoso.
   * Establece el estado de formOk a true para mostrar un mensaje de éxito.
   * Luego, realiza la redirección después de un breve retraso.
   */
  const handleRedirect = () => {
    setFormOk(true);

    setTimeout(() => {
      // hacer la redireccion
      // ahora redirige al home
      navigate("/");
    }, 1000);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (Object.keys(inputs).length === 1) return navigate("/");
    return setCancelado(!cancelado);
  };

  const handleCancelOk = (e) => {
    e.preventDefault();
    return navigate("/");
  };

  const toggleDisable = (e) => {
    setIsEditable(!isEditable);
  };

  if (cancelado)
    return (
      <Layout title={"¿Cancelar?"}>
        <div className="container">
          <div className="text-center mt-3">
            <h3 className="display-4">
              ¿ Estas seguro de <strong>cancelar ?</strong>
            </h3>
            <p className="text-muted display-5 lead">
              Perderas todos los cambios
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <input
              className="btn btn-danger col-sm-3 col-md-2 mx-2"
              value={"Si, cancelar"}
              type="submit"
              onClick={handleCancelOk}
            />
            <input
              type="submit"
              className="btn btn-primary col-sm-3 col-md-2"
              value={"Volver"}
              onClick={handleCancel}
            />
          </div>
        </div>
      </Layout>
    );
  if (formOk)
    return (
      <Layout title={"Novedad creada"}>
        <div className="container">
          <div className="text-center mt-5">
            <h2 className="text-primary display-4">
              Novedad creada satisfactoriamente
            </h2>
          </div>
        </div>
      </Layout>
    );
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                  disabled={!isEditable}
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
                      disabled={!isEditable}
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
                    type="submit"
                    onClick={handleCancel}
                  />
                ) : (
                  <input
                    className="btn btn-danger col-sm-3 col-md-2 mx-2"
                    value={"Cancelar"}
                    type="submit"
                    onClick={handleCancel}
                  />
                )}
                {isEditable ? (
                  <input
                    type="submit"
                    className="btn btn-primary col-sm-3 col-md-2"
                    value={"Guardar"}
                  />
                ) : (
                  <input
                    type="submit"
                    className="btn btn-primary col-sm-3 col-md-2"
                    value={"Editar"}
                    onClick={toggleDisable}
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
