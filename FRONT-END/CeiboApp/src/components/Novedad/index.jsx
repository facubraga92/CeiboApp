import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "antd";
import "./Style.Novedad.css";

const { TextArea } = Input;

export default function Novedad({ mostrar, datos }) {
  const [data, setData] = useState({
    title: "TITULO_NOVEDAD",
    description:
      "esta es la descripcion completa de la novedad, vamos agregando texto para hacer lugar y ver como va quedando",
    userId: "6FFSDFASDRREHREASDA",
    associatedProject: "PROYECTO_XXX",
    state: "pendiente",
    creationDate: "19/07/2023",
    reply: [
      {
        userId: "ceibo@ceibo.digital",
        message: "este es un mensajito de prueba vamo viendo que onda",
        date: "19/07/2023",
      },
      {
        userId: "ceibo@ceibo.digital",
        message:
          "este es un mensajito de prueba vamo viendo que ondaeste es un mensajito de prueba vamo viendo que ondaeste es un mensajito de prueba vamo viendo que ondaeste es un mensajito de prueba vamo viendo que ondaeste es un mensajito de prueba vamo viendo que onda",
        date: "19/07/2023",
      },
      {
        userId: "admin@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "consultor@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "ceibo@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "admin@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "8888DASDASDAS",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "ceibo@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
      {
        userId: "ceibo@ceibo.digital",
        message: "MENSAJE",
        date: "19/07/2023",
      },
    ],
  });
  const [inputs, setInputs] = useState({});
  const [showModal, setShowModal] = useState(true);
  const [confirmModal, setConfirmModal] = useState(false);

  // para testing
  const loggedUserId = "admin@ceibo.digital";
  const role = "manager";
  // para testing

  useEffect(() => {
    mostrar = true; //
    setShowModal(mostrar); //
  }, [mostrar]);

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

  const handleSubmit = () => {
    const newReply = {
      userId: loggedUserId,
      message: inputs.message,
      date: new Date().toLocaleDateString("es-AR"),
    };

    const updatedFakeData = {
      ...data,
      reply: [...data.reply, newReply],
    };

    setInputs({});
    setData(updatedFakeData);
  };

  const toggleShowModal = () => {
    setShowModal(!showModal);
  };

  const toggleShowConfirmModal = () => {
    setConfirmModal(!confirmModal);
  };

  const handleApprove = () => {
    toggleShowConfirmModal();
    return setData((values) => ({ ...values, ["state"]: "aprobada" }));
  };

  return (
    <>
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
            <h2>{data.title}</h2>
            <h5>{data.associatedProject}</h5>
          </div>
        </Modal.Header>
        <Modal.Body
          className={`${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <div className="d-flex justify-content-center">
              {role == "manager" && data.state != "aprobada" ? (
                <>
                  <input
                    type="button"
                    value={`Estado: ${data.state}`}
                    className="btn btn-outline-warning p-3 text-uppercase"
                    onClick={toggleShowConfirmModal}
                  />
                </>
              ) : (
                <p className="display-4">
                  Estado:{" "}
                  <span className="bg-warning text-uppercase">
                    {data.state}
                  </span>
                </p>
              )}
            </div>
            <div>
              <p className="lead mt-2">{data.description}</p>
            </div>
            <hr className="" />
            <ul className="list-unstyled ">
              {data.reply.map((mess, index) => (
                <li
                  key={index}
                  style={{ backgroundColor: "#d9d7c7" }}
                  className={`p-3 rounded mb-3 ${
                    mess.userId === loggedUserId
                      ? "d-flex flex-column align-items-end"
                      : "bg-light"
                  }`}
                >
                  <p className="m-0">{mess.message}</p>
                  <p className={`small text-muted m-0 font-italic`}>
                    {mess.userId} - {mess.date}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="">
            {data.state != "aprobada" ? (
              <>
                <label htmlFor="">{loggedUserId}</label>
                <TextArea
                  rows={2}
                  allowClear
                  value={inputs.message || ""}
                  onChange={handleChange}
                  name="message"
                />
                <Button
                  variant="primary mt-3 mb-2"
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
        </Modal.Body>
        <Modal.Footer
          className={`d-flex justify-content-between ${
            data.state == "aprobada" ? "back-approve" : "back-normal"
          }`}
        >
          <div>
            <p>{data.userId}</p>
            <p>{data.creationDate}</p>
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
              {(role == "manager" || role == "admin") && (
                <Button variant="danger" onClick={toggleShowConfirmModal}>
                  Aprobar Novedad
                </Button>
              )}
            </div>
          ) : (
            <div className={`d-flex flex-column align-items-end`}>
              <p>Aprobada por: admin@ceibo.digital</p>
              <p>20/07/2023</p>
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
