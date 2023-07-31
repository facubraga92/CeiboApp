import React, { useEffect, useState } from "react";
import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Select, DatePicker, Spin } from "antd";
import moment from "moment";
import axios from "axios";
import { useCredentials, userMe } from "../utils/api";
import { envs } from "../config/env/env.config";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";

/**
 * Componente FormNovedades
 * Formulario para crear novedades.
 */
export default function FormNovedades() {
  const params = useParams();

  const { VITE_BACKEND_URL } = envs;

  const [selectedOption, setSelectedOption] = useState(1);
  const [selectInput, setSelectInput] = useState("default");
  const [inputs, setInputs] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isChangesOk, setIsChangesOk] = useState(false);
  const [showModalSave, setShowModalSave] = useState(false);

  const [project, setProject] = useState({});

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const handle = async () => {
      const user = await userMe();
      return setUser(user);
    };
    handle();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        axios
          .get(
            `${VITE_BACKEND_URL}/projects/project/${params.idProject}`,
            useCredentials
          )
          .then((response) => {
            setProject(response.data);
            handleChange({
              target: {
                name: "associatedProject",
                value: response.data._id,
              },
            });
            handleChange({
              target: {
                name: "userId",
                value: user.id,
              },
            });
          });
      } catch (error) {
        console.error(error);
      }
    };
    fetchProject();
  }, [user]);

  useEffect(() => {
    setIsChangesOk(
      Object.keys(inputs).length > 1 &&
        inputs.description &&
        inputs.week &&
        inputs.title
    );
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
    for (let i = 1; i <= selectedValue; i++) {
      document.getElementById(`checkbox-${i}`).checked = true;
    }
  };

  /**
   * Maneja el envío del formulario.
   * Realiza la validación y el envío de datos.
   *
   * @param {Event} event - Evento del envío del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(
        `${VITE_BACKEND_URL}/projects/project/addNews/${params.idProject}`,
        inputs,
        useCredentials
      );
    } catch (error) {
      return console.log(error);
    }

    setShowModalSave(false);
    toast.success(`Novedad "${inputs.title}" creada`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    return setTimeout(() => {
      return navigate("/Projects");
    }, 1000);
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

  /**
   * Maneja el cambio en los campos del formulario.
   * Actualiza el estado correspondiente según el campo modificado.
   *
   * @param {Event} event - Evento del cambio en los campos del formulario.
   */
  const handleChange = (event) => {
    const { name, value } = event?.target;
    if (value === "") {
      setInputs((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      if (name == "type") setSelectInput(value);
      if (name == "priority") handleOptionChange(event);
      return setInputs((values) => ({ ...values, [name]: value }));
    }
    return;
  };

  const customWeek = (value) => {
    const weekOfYear = moment(value).isoWeek();
    return `S:${weekOfYear} ${moment(value).format("MM/YYYY")}`;
  };

  return (
    <Layout title={"Crear Novedad"}>
      <div className="mt-0 p-4 mt-md-4">
        <div className="row">
          <div className="container col-sm-12 col-md-8 col-lg-6">
            <div className="d-flex flex-wrap flex-md-nowrap justify-content-between mb-0 mb-md-4">
              <div>
                {project.name ? (
                  <>
                    <h5>{project.name}</h5>
                    <h2>{project.description || project.name}</h2>
                  </>
                ) : (
                  <Spin />
                )}
              </div>
              <div>
                <DatePicker
                  placeholder="Semana . . ."
                  format="S:Wo MM/YYYY"
                  picker="week"
                  valueRender={customWeek}
                  size="large"
                  onChange={(e) => {
                    handleChange({
                      target: {
                        name: "week",
                        value: e?.week() ? e?.week() : "",
                      },
                    });
                  }}
                />
              </div>
            </div>

            <form method="post" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Titulo</label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  maxLength={20}
                  placeholder="Titulo de la novedad"
                  value={inputs.title || ""}
                  onChange={handleChange}
                  required
                  showCount
                  disabled={!isEditable || formSubmitted}
                />
              </div>
              <div className="form-group">
                <label htmlFor="detalles">Detalles</label>
                <TextArea
                  type="text"
                  id="detalles"
                  name="description"
                  rows={4}
                  placeholder="Detalles acerca de la novedad"
                  value={inputs.description || ""}
                  onChange={handleChange}
                  required
                  disabled={!isEditable || formSubmitted}
                  showCount
                  maxLength={1000}
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="tipoNovedad">Tipo de Novedad</label>
                <div>
                  <Select
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      const res = {
                        target: {
                          name: "type",
                          value: e,
                        },
                      };

                      handleChange(res);
                    }}
                    className=""
                    defaultValue="Seleccione un tipo de novedad"
                    value={inputs.type || ""}
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
              </div> */}

              <label>Prioridad</label>
              <div className="d-flex justify-content-center">
                {[1, 2, 3, 4, 5].map((option) => (
                  <label key={option} className="form-check">
                    <input
                      type="checkbox"
                      id={`checkbox-${option}`}
                      name="priority"
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
