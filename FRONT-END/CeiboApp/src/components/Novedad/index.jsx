import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import jwt_decode from "jwt-decode";

import { Input, Spin } from "antd";
import { Modal, Button } from "react-bootstrap";
import { BsSave } from "react-icons/bs";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import { RiEditBoxLine } from "react-icons/ri";
import { RiDeleteBin2Line } from "react-icons/ri";

import { getCookieValue, toastSuccess, useCredentials } from "../../utils/api";
import { envs } from "../../config/env/env.config";
import "./Style.Novedad.css";

const { TextArea } = Input;

export default function Novedad({ news }) {
  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  const [inputs, setInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [canModify, setCanModify] = useState({
    title: false,
    description: false,
  });
  const [inputsModify, setInputsModify] = useState({});

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    const handle = () => {
      const cookie = getCookieValue("token");
      const user = jwt_decode(cookie);
      return setUser(user);
    };
    handle();
  }, []);

  useEffect(() => {
    setData(news);
    const { title, description } = news;
    setInputsModify({ title: title, description: description });
  }, [news]);

  const handleModifyChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setInputsModify((current) => {
        const { [name]: _, ...rest } = current;
        return rest;
      });
    } else {
      return setInputsModify((values) => ({ ...values, [name]: value }));
    }
    return;
  };

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
    setIsSendingReply(true);
    const newReply = {
      user: user.id,
      message: inputs.message,
      date: new Date().toLocaleDateString("es-AR"),
    };

    await axios
      .put(`${VITE_BACKEND_URL}/news/${data._id}`, newReply, useCredentials)
      .then((response) => {
        setIsSendingReply(false);
        setInputs({});
        setData(response.data.data);
      })
      .catch((err) => {});

    return handleScrollBottom();
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const handleApprove = async () => {
    toggleShowConfirmModal();
    extendChat?.current?.classList.add("comprimed-chat");
    descRef?.current?.classList.add("text-truncate");

    const call = await axios.put(
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

    return setData(call.data.data);
  };

  const handleSubmitModify = async (e) => {
    e.preventDefault();
    const modifications = {
      ...inputsModify,
      userId: user.id,
    };
    try {
      const response = await axios.put(
        `http://localhost:3000/api/news/${data._id}/modify`,
        modifications,
        useCredentials
      );
      setData(response.data.data);
      toast.success("Modificado con exito!");
    } catch (error) {
      toast.error(
        "Error al modificar la novedad. Por favor, intenta de nuevo."
      );
    }
  };

  const handleDeleteNews = async () => {
    setIsDeleting(true);
    try {
      console.log("Deleting news item with ID:", data._id);

      await axios
        .delete(`${VITE_BACKEND_URL}/news/${data._id}`, useCredentials)
        .then(() => {
          setShowDeleteConfirmation(false);
          setIsDeleting(false);
          toastSuccess("Novedad Eliminada correctamente");
          setData(null);
        });
    } catch (error) {
      console.error("Error deleting news item:", error);
      setShowDeleteConfirmation(false);
      setIsDeleting(false);
      toast.error("Error al eliminar la novedad. Por favor, intenta de nuevo.");
    }
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

  if (!data) {
    return null;
  }

  return (
    <>
      <div
        className={`card shadow tarjeta lead ${
          news.state === "aprobada" ? "" : ""
        }`}
        onClick={toggleShowModal}
        style={{ cursor: "pointer" }}
      >
        <div className="card-header" style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p className="text-truncate" style={{ margin: 0 }}>
              <span> Titulo: </span>
              <span>{data?.title}</span>
            </p>
            {((user.role === "manager" && data.state === "aprobada") ||
              (["manager", "consultor"].includes(user.role) &&
                data.state === "pendiente")) && (
              <RiDeleteBin2Line
                variant="danger"
                onClick={() => setShowDeleteConfirmation(true)}
                size={30}
                style={{
                  padding: "4px",
                  cursor: "pointer",
                  color: "red",
                }}
              />
            )}
          </div>
        </div>
        <div className="card-body">
          <p className="text-truncate">{data?.description}</p>
          <p className="">{data?.state}</p>
          <p className="">Comentarios: {data?.reply?.length}</p>
        </div>
        <div className="card-footer">
          <h5>Creada</h5>
          <p className="m-0">{data?.created_at?.split("T")[0]}</p>
          <p className="m-0">{data?.userId?.email}</p>
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
          className={`${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div className="container">
            {!canModify.title ? (
              <>
                <div className="d-flex justify-content-center">
                  <h2 className="text-center mr-2 display-5">{data.title}</h2>
                  {data.state !== "aprobada" && (
                    <RiEditBoxLine
                      size={50}
                      display={canModify.title ? "none" : ""}
                      onClick={() => {
                        setCanModify({ ...canModify, title: true });
                      }}
                    />
                  )}
                </div>
              </>
            ) : (
              <form className="d-flex" onSubmit={handleSubmitModify}>
                <Input
                  placeholder=""
                  onChange={handleModifyChange}
                  name="title"
                  value={inputsModify.title || ""}
                  disabled={!canModify.title}
                  bordered={canModify.title}
                  className="lead mr-1"
                  showCount
                  maxLength={20}
                  minLength={1}
                  required
                />

                <button type="submit" className="btn">
                  <BsSave size={50} display={!canModify.title ? "none" : ""} />
                </button>

                <button
                  onClick={() => {
                    setCanModify({ ...canModify, title: false });
                  }}
                  className="btn"
                >
                  <FcCancel
                    size={50}
                    display={!canModify.title ? "none" : ""}
                  />
                </button>
              </form>
            )}
          </div>
        </Modal.Header>
        <Modal.Body
          className={` ${
            data?.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div className="">
            <div className="pb-2 d-flex flex-column align-items-center">
              <div className="">
                {user?.role == "manager" && data.state != "aprobada" ? (
                  <div>
                    <input
                      type="button"
                      value={`Estado: ${data?.state}`}
                      className="btn btn-outline-warning p-3 text-uppercase"
                      onClick={toggleShowConfirmModal}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="display-4 d-flex d-md-block d-lg-flex">
                      <span className="d-none d-md-block">Estado:</span>{" "}
                      <span className="bg-warning text-uppercase">
                        {data?.state}
                      </span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <ul>
                  {data?.logs?.map((log, index) => (
                    <li className="m-0 p-0 list-group" key={index}>
                      {log.user.email} - {log?.description} -{" "}
                      {log?.date?.split("T")[0]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pb-2">
              {!canModify.description ? (
                <div className="d-flex flex-wrap">
                  {data.state !== "aprobada" && (
                    <RiEditBoxLine
                      size={50}
                      display={canModify.description ? "none" : ""}
                      onClick={() => {
                        setCanModify({ ...canModify, description: true });
                      }}
                    />
                  )}
                  <p
                    className="lead mt-2 text-justify text-break"
                    ref={descRef}
                    onClick={handleDesc}
                  >
                    {inputsModify?.description}
                  </p>
                </div>
              ) : (
                <form className="col d-flex" onSubmit={handleSubmitModify}>
                  <TextArea
                    placeholder=""
                    onChange={handleModifyChange}
                    name="description"
                    value={inputsModify.description || ""}
                    disabled={!canModify.description}
                    bordered={canModify.description}
                    showCount
                    maxLength={1000}
                    minLength={1}
                    required
                  />

                  <button type="submit" className="btn">
                    <BsSave
                      size={50}
                      display={!canModify.description ? "none" : ""}
                    />
                  </button>

                  <button className="btn">
                    <FcCancel
                      size={50}
                      onClick={() => {
                        setCanModify({ ...canModify, description: false });
                      }}
                      display={!canModify.description ? "none" : ""}
                    />
                  </button>
                </form>
              )}
            </div>

            <hr className="" />

            {user.role !== "socio" && (
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
                          <p className="m-0 text-break">{mess.message}</p>
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
                        No hay comentarios
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          {data?.reply?.length > 4 && user.role !== "socio" && (
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
                {!isSendingReply ? (
                  <>
                    <TextArea
                      rows={2}
                      allowClear
                      value={inputs.message || ""}
                      onChange={handleChange}
                      name="message"
                      onPressEnter={inputs.message ? handleSubmit : ""}
                      maxLength={140}
                      showCount
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
                  <div className="text-center">
                    <Spin />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-secondary text-white p-2">
                <p className="display-4 text-center">Novedad aprobada</p>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer
          className={`d-flex justify-content-between ${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <h5>Creada </h5>
            <p className="m-0">{data?.userId?.email}</p>
            <p className="m-0"> {data?.created_at?.split("T")[0]}</p>
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
            <div
              className={`d-flex flex-column align-items-sm-center align-items-md-end `}
            >
              <h5>Aprobada</h5>
              <p className="m-0">{data?.approved_by?.email || ""}</p>
              <p className="m-0">{data?.approved_date?.split("T")[0] || ""}</p>
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
              Se pasara la novedad a aprobada y se notificara al socio
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
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
        backdrop="static"
        keyboard={false}
        backdropClassName="bg-dark"
      >
        {!isDeleting ? (
          <>
            <Modal.Header closeButton>
              <p className="lead">¿Estás seguro de eliminar la novedad?</p>
            </Modal.Header>
            <Modal.Body>
              <div>
                <p>Esta acción no se puede deshacer.</p>
              </div>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-center">
              <input
                type="button"
                value="Cancelar"
                className="btn btn-warning"
                onClick={() => setShowDeleteConfirmation(false)}
              />
              <input
                type="button"
                value="Eliminar"
                className="btn btn-danger"
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  handleDeleteNews();
                }}
              />
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Eliminando . . .</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Spin size={40} />
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </>
        )}
      </Modal>
    </>
  );
}
