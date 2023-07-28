import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Toast } from "react-bootstrap";
import { Input } from "antd";
import "./Style.Novedad.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCookieValue, useCredentials } from "../../utils/api";
import jwt_decode from "jwt-decode";
import { envs } from "../../config/env/env.config";

const { TextArea } = Input;

export default function Novedad({ news, projectProp }) {
  const [data, setData] = useState({});
  const [inputs, setInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [user, setUser] = useState({});
  const [isModifying, setIsModifying] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [project, setProject] = useState({});

  useEffect(() => {
    const handle = () => {
      const cookie = getCookieValue("token");
      const user = jwt_decode(cookie);
      return setUser(user);
    };
    handle();
  }, []);

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    setData(news);
  }, [news]);

  useEffect(() => {
    setProject(projectProp);
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const handleSubmit = async () => {
    const newReply = {
      user: user.id,
      message: inputs.message,
      date: new Date().toLocaleDateString("es-AR"),
    };

    const updatedFakeData = {
      ...data,
      reply: [
        ...data?.reply,
        {
          user: {
            email: user.email,
          },
          message: newReply.message,
          date: newReply.date,
        },
      ],
    };

    await axios.put(
      `${VITE_BACKEND_URL}/news/${data._id}`,
      newReply,
      useCredentials
    );

    setInputs({});
    setData(updatedFakeData);
    return handleScrollBottom();
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const handleApprove = () => {
    toggleShowConfirmModal();
    extendChat.current.classList.add("comprimed-chat");
    descRef.current.classList.add("text-truncate");

    const call = axios.put(
      `${VITE_BACKEND_URL}/news/${data._id}/approve`,
      user,
      useCredentials
    );

    toast.success(`Novedad Aprobada, notificando a Socios`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    return setData((values) => ({ ...values, ["state"]: "aprobada" }));
  };

  const handleModify = async () => {
    try {
      const modifiedData = {
        title: inputs.title || data.title,
        description: inputs.description || data.description,
      };
      const response = await axios.put(
        `http://localhost:3000/api/news/${data._id}/modify`,
        modifiedData,
        useCredentials
      );
      setData(response.data.data);
      toast.success("Novedad modificada con éxito!");
      setIsModifying(false);
    } catch (error) {
      console.error("Error al modificar la novedad:", error);
      toast.error(
        "Error al modificar la novedad. Por favor, intenta de nuevo."
      );
    }
  };

  const handleCancelEdit = () => {
    setData(editedData);
    setIsModifying(false);
  };

  const descRef = useRef(null);
  const handleDesc = () => {
    return descRef.current.classList.toggle("text-truncate");
  };

  const extendChat = useRef(null);
  const handleExtendChat = (e) => {
    return extendChat.current.classList.toggle("comprimed-chat");
  };

  const handleScrollBottom = () => {
    setTimeout(() => {
      return (extendChat.current.scrollTop = extendChat.current.scrollHeight);
    }, 100);
  };

  return (
    <>
      <div
        className={`card shadow tarjeta lead ${
          news.state === "aprobada" ? "" : ""
        }`}
        onClick={toggleShowModal}
        style={{ cursor: "pointer" }}
      >
        <div className="card-header">
          <p className="card-title text-truncate text-uppercase">
            <span>{data?.title}</span>
          </p>
        </div>
        <div className="card-body">
          <p className="card-description text-truncate">{data?.description}</p>
          <p className="card-state">Estado: {data?.state?.toUpperCase()}</p>
          <p className="card-comments">Tipo: {data?.type}</p>
          <p className="card-comments">Comentarios: {data?.reply?.length}</p>
          <p className="card-comments display-4">Prioridad: {data?.priority}</p>
        </div>
        <div className="card-footer d-flex flex-wrap justify-content-between">
          <p>{data?.userId?.email}</p>
          <p className="card-date">{data?.created_at?.split("T")[0]}</p>
        </div>
      </div>
      <Modal
        show={showModal}
        centered
        onHide={toggleShowModal}
        size="lg"
        backdropClassName="background-blur"
      >
        <Modal.Header
          closeButton
          className={`${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <h2>Novedad: {data?.title}</h2>
            <h5 className="text-muted">
              <em>Proyecto: {data?.associatedProject?.name}</em>
            </h5>
          </div>
        </Modal.Header>
        <Modal.Body
          className={`${
            data?.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <div className="d-flex justify-content-center">
              {user?.role == "manager" && data.state != "aprobada" ? (
                <>
                  <input
                    type="button"
                    value={`Estado: ${data?.state}`}
                    className="btn btn-outline-warning p-3 text-uppercase"
                    onClick={toggleShowConfirmModal}
                  />
                </>
              ) : (
                <p className="display-4">
                  Estado:{" "}
                  <span className="bg-warning text-uppercase">
                    {data?.state}
                  </span>
                </p>
              )}
            </div>
            <div>
              <p
                className="lead mt-2 text-justify"
                ref={descRef}
                onClick={handleDesc}
              >
                {data?.description}
              </p>
            </div>

            <hr className="" />

            <div
              className="comprimed-chat back-normal bg-secondary p-1"
              ref={extendChat}
            >
              <ul className="list-unstyled">
                {data?.reply?.length ? (
                  data?.reply?.map((mess, index) => (
                    <div className="" key={index}>
                      <li
                        key={index}
                        style={{
                          backgroundColor: "#d9d7c7",
                          width: "fit-content",
                          marginLeft:
                            mess?.user?.email === user?.email ? "auto" : "0",
                        }}
                        className={`p-2 rounded mb-3 ${
                          mess?.user?.email === user?.email
                            ? "text-right pl-4"
                            : "bg-light pr-4"
                        }`}
                      >
                        <p className="m-0">{mess.message}</p>
                        <p className={`small text-muted m-0 font-italic`}>
                          {mess?.user?.email || mess?.userId} -{" "}
                          {mess.date.split("T")[0]}
                        </p>
                      </li>
                    </div>
                  ))
                ) : (
                  <li>
                    <p className="text-center display-4">
                      No hay comentarios todavia
                    </p>
                  </li>
                )}
              </ul>
            </div>
          </div>
          {data?.reply?.length > 4 && (
            <div className="text-center mt-2">
              <input
                type="button"
                value={"Extender chat"}
                className="btn btn-info"
                onClick={handleExtendChat}
              />
            </div>
          )}
          <div className="mt-2">
            {data.state != "aprobada" ? (
              <>
                <label htmlFor="">{user.email}</label>
                <TextArea
                  rows={2}
                  allowClear
                  value={inputs.message || ""}
                  onChange={handleChange}
                  name="message"
                  onPressEnter={inputs.message ? handleSubmit : ""}
                />
                <Button
                  variant="primary mt-2"
                  onClick={handleSubmit}
                  disabled={!inputs.message}
                >
                  Comentar
                </Button>
              </>
            ) : (
              <div className="bg-secondary text-white p-2">
                <p className="display-4 text-center">Novedad aprobada</p>
              </div>
            )}
          </div>
          {/*Campo de editar la novedad */}
          {user.role === "manager" && data.state !== "aprobada" && (
            <div className="mt-4">
              {/* Agregar inputs controlados para editar los campos */}
              <input
                type="text"
                name="title"
                value={
                  isModifying ? inputs.title || editedData.title : data.title
                }
                onChange={handleChange}
                className="form-control"
                placeholder="Título"
              />
              <textarea
                name="description"
                value={
                  isModifying
                    ? inputs.description || editedData.description
                    : data.description
                }
                onChange={handleChange}
                className="form-control mt-2"
                placeholder="Descripción"
              />
              {isModifying ? (
                <div className="mt-2">
                  <Button variant="success" onClick={handleModify}>
                    Modificar
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancelEdit}
                    className="ml-2"
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="info mt-2"
                  onClick={() => {
                    setIsModifying(true);
                    setEditedData(data); // Copiar el estado data en editedData al iniciar la edición
                  }}
                >
                  Editar
                </Button>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer
          className={`d-flex justify-content-between ${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <p>{data?.userId?.email}</p>
            <p>{data?.created_at?.split("T")[0]}</p>
          </div>

          {data.state != "aprobada" ? (
            <div className="d-flex">
              <Button
                variant="warning"
                onClick={toggleShowModal}
                className="mr-2"
              >
                Volver
              </Button>
              {(user?.role == "manager" || user?.role == "admin") && (
                <Button variant="danger" onClick={toggleShowConfirmModal}>
                  Aprobar Novedad
                </Button>
              )}
            </div>
          ) : (
            <div className={`d-flex flex-column align-items-end`}>
              <p>XXXX</p>
              <p>XXXX</p>
            </div>
          )}
        </Modal.Footer>
      </Modal>
      <Modal
        show={confirmModal}
        backdrop="static"
        keyboard={false}
        onHide={toggleShowConfirmModal}
        backdropClassName="bg-dark"
      >
        <Modal.Header closeButton>
          <p className="lead">¿Aprobar novedad y notificar a Socio?</p>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>
              Se pasara la novedad a aprobada y se notificara el socio
              correspondiente
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <input
            type="button"
            value="Volver sin modificar"
            className="btn btn-warning"
            onClick={toggleShowConfirmModal}
          />
          <input
            type="button"
            value="Aprobar y Notificar"
            className="btn btn-danger"
            onClick={handleApprove}
          />
        </Modal.Footer>
      </Modal>
    </>
  );
}
