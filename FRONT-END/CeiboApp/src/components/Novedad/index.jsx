import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Input } from "antd";
import "./Style.Novedad.css";

const { TextArea } = Input;

export default function Novedad({ mostrar }) {
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
  }, []);
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

  return (
    <>
      <Modal
        show={showModal}
        centered
        onHide={toggleShowModal}
        size="lg"
        backdropClassName="bg-dark"
      >
        <Modal.Header closeButton>
          <div>
            <h2>{data.title}</h2>
            <h5>{data.associatedProject}</h5>
          </div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="d-flex justify-content-center">
              {role == "manager" ? (
                <input
                  type="button"
                  value={`Estado: ${data.state}`}
                  className="btn btn-warning"
                  onClick={toggleShowConfirmModal}
                />
              ) : (
                <p>Estado: {data.state}</p>
              )}
            </div>
            <div>
              <p className="lead mt-2">{data.description}</p>
            </div>
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
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <p>{data.userId}</p>
            <p>{data.creationDate}</p>
          </div>
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
        </Modal.Footer>
      </Modal>
      <Modal
        centered
        show={confirmModal}
        backdrop="static"
        keyboard={false}
        onHide={toggleShowConfirmModal}
        backdropClassName="bg-dark"
      >
        <Modal.Header className="" closeButton>
          ¿Aprobar novedad?
        </Modal.Header>
        <Modal.Body>
          <div></div>
        </Modal.Body>
        <Modal.Footer>Footer</Modal.Footer>
      </Modal>
    </>
  );
}
