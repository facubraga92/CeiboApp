import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import { Select, Spin } from "antd";
import { RiAddBoxLine, RiDeleteBin2Line } from "react-icons/ri";
import { AiOutlineUser } from "react-icons/ai";
import { BsArrowRepeat } from "react-icons/bs";
import { Button, Collapse, Modal } from "react-bootstrap";
import { BiRefresh } from "react-icons/bi";

import Layout from "../components/layouts/Layout";
import Novedad from "../components/Novedad";
import {
  getAllClients,
  getUserByToken,
  toastError,
  toastSuccess,
  useCredentials,
} from "../utils/api";
import { envs } from "../config/env/env.config";
import "../styles/projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState(undefined);
  const [codeSearch, setCodeSearch] = useState(undefined);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConsultors, setShowConsultors] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    const handle = async () => {
      const user = await getUserByToken();
      const clients = await getAllClients();
      setClients(clients);
      return setUser(user);
    };
    handle();
  }, []);

  useEffect(() => {
    if (!user) return;
    axios
      .get(
        `${VITE_BACKEND_URL}/projects/getProjectsUser/${user.id}`,
        useCredentials
      )
      .then((projects) => {
        setProjects(groupProjectsByClient(projects.data));
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const groupProjectsByClient = (projects) => {
    return Object.entries(
      projects.reduce((acc, proj) => {
        const customerName = proj.customer.name;
        if (!acc[customerName]) {
          acc[customerName] = [proj];
        } else {
          acc[customerName].push(proj);
        }
        return acc;
      }, {})
    );
  };

  const handleShowDetails = (index) => {
    localStorage.setItem(
      "selectedProject",
      selectedProject === index ? -1 : index
    );
    setSelectedProject((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const clientOption = clients.map((client) => ({
    value: client.name,
    label: client.name,
  }));

  const handleSearchByClient = (name) => {
    return setClientSearch(name);
  };

  const handleSearchByCode = (e) => {
    const { value } = e.target;
    return setCodeSearch(value);
  };

  useEffect(() => {
    localStorage.setItem("selectedProject", selectedProject);
  }, [selectedProject]);

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await axios
        .delete(
          `${VITE_BACKEND_URL}/projects/project/${idToDelete}`,
          useCredentials
        )
        .then((res) => {
          setShowDeleteModal(false);
          setIsDeleting(false);
          toastSuccess("Proyecto eliminado correctamente");
          setProjects(groupProjectsByClient(res.data));
        });
    } catch (error) {
      setShowDeleteModal(false);
      setIsDeleting(false);
      toastError("Proyecto no se pudo eliminar");
    }
  };

  const handleRefreshProjects = () => {
    setIsLoadingProjects(true);
    axios
      .get(
        `${VITE_BACKEND_URL}/projects/getProjectsUser/${user.id}`,
        useCredentials
      )
      .then((projects) => {
        setProjects(groupProjectsByClient(projects.data));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoadingProjects(false);
      });
  };

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <Layout title="Projects">
      <div className="p-4">
        <div
          className="card"
          style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}
        >
          <div className="container">
            <div className="row">
              <div className="col">
                <h2 className="text-center display-4">Proyectos</h2>
              </div>
            </div>
            <div className="row">
              {user?.role === "manager" && (
                <div className="col">
                  <Link to="/projects/add">
                    <input
                      type="button"
                      value="Crear proyecto"
                      className="btn btn-danger mt-2"
                      style={{ fontSize: '16px'}}
                    />
                  </Link>
                </div>
              )}
              <div className="col">
                <div className="d-flex justify-content-end">
                  <span className="font-italic"></span>
                  {isLoadingProjects ? (
                    <BsArrowRepeat
                      size={30}
                      className="spin-icon"
                      style={{
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <BiRefresh
                      size={30}
                      onClick={handleRefreshProjects}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row mt-2 mb-2">
              {projects.length > 0 && (
                <div className="col-12 col-md-4">
                  <div className="mr-1">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Seleccione un cliente"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={clientOption}
                      onChange={handleSearchByClient}
                    />
                  </div>
                </div>
              )}
            </div>
            {projects.length > 0 ? (
              projects
                .filter(
                  (proj) =>
                    proj[0] === clientSearch || clientSearch === undefined
                )
                .map(([customer, proj], i) => (
                  <div className="mt-1 mb-4">
                    <h4>{customer}</h4>
                    <div className="shadow">
                      {proj.map((e, index) => (
                        <div
                          key={e._id}
                          className={`onHoverRow ${
                            selectedProject === e._id ||
                            localStorage.getItem("selectedProject") === e._id
                              ? "onClickedRow"
                              : ""
                          } border ${index === 0 ? "rounded-top" : ""} ${
                            index === proj.length - 1 ? "rounded-bottom" : ""
                          }`}
                        >
                          <div style={{}} className={"p-1 pb-1"} title={e.name}>
                            <div
                              key={e._id}
                              className={`d-flex justify-content-between align-items-center flex-column flex-lg-row container`}
                              style={{
                                cursor: "pointer",
                              }}
                              onClick={() => handleShowDetails(e._id)}
                            >
                              <div className="justify-content-between">
                                <div className="d-flex">
                                  <p className="m-0 p-0">
                                    <span className="lead font-weight-bold">
                                      {e.name}
                                    </span>
                                    {" - "}
                                    <span className="font-italic">
                                      {e.description}
                                    </span>
                                  </p>
                                </div>
                                <div
                                  className="d-flex p-0 m-0"
                                  style={{ fontSize: "0.7em" }}
                                >
                                  <p className="text-lowercase m-0 p-0 font-italic font-weight-light">
                                    {e?.created_by?.email} -{" "}
                                    {e?.created_at?.split("T")[0]}
                                  </p>
                                </div>
                              </div>
                              {user.role !== "socio"}
                              <div>
                                <div>
                                  <p
                                    className="font-weight-bold font-italic p-0 m-0 text-uppercase mr-1"
                                    style={{ fontSize: "1rem" }}
                                  >
                                    #{e.code}
                                  </p>
                                </div>
                                <div></div>
                              </div>
                              {user?.role === "manager" ? (
                                <>
                                  <div className="d-none d-lg-flex flex-column ">
                                    <div className="">
                                      <input
                                        type="button"
                                        value="Borrar proyecto"
                                        name={e._id}
                                        className="btn btn-danger w-100"
                                        style={{
                                          marginBottom: "10px",
                                          fontSize: "14px",
                                        }}
                                        onClick={() => {
                                          setIdToDelete(e._id);
                                          setShowDeleteModal(true);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <Link to={`/project/addNews/${e._id}`}>
                                        <input
                                          type="button"
                                          value="Agregar novedad"
                                          className="btn btn-danger w-100"
                                          style={{ fontSize: "14px" }}
                                          onClick={(e) =>
                                            setSelectedProject(e._id)
                                          }
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                  <div className="d-flex d-lg-none">
                                    <>
                                      <div
                                        className=""
                                        onClick={() => {
                                          setIdToDelete(e._id);
                                          setShowDeleteModal(true);
                                        }}
                                      >
                                        <RiDeleteBin2Line
                                          size={30}
                                          className="mr-2"
                                        />
                                      </div>
                                      <div>
                                        <Link to={`/project/addNews/${e._id}`}>
                                          <RiAddBoxLine size={30} />
                                        </Link>
                                      </div>
                                    </>
                                  </div>
                                </>
                              ) : (
                                user.role === "consultor" && (
                                  <>
                                    <div className="d-none d-lg-flex">
                                      <Link to={`/project/addNews/${e._id}`}>
                                        <input
                                          type="button"
                                          value="Agregar novedad"
                                          className="btn btn-danger w-100"
                                          style={{ fontSize: "14px" }}
                                          onClick={(e) =>
                                            setSelectedProject(e._id)
                                          }
                                        />
                                      </Link>
                                    </div>
                                    <div className="d-flex d-lg-none">
                                      <Link to={`/project/addNews/${e._id}`}>
                                        <RiAddBoxLine size={30} />
                                      </Link>
                                    </div>
                                  </>
                                )
                              )}
                            </div>

                            <Collapse in={selectedProject === e._id}>
                              <div className={`mt-2 `}>
                                <div
                                  className=""
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowConsultors(!showConsultors);
                                  }}
                                >
                                  {user.role !== "socio" && e.consultors && (
                                    <div className="w-auto mb-2">
                                      <h5
                                        onClick={() =>
                                          setShowConsultors(!showConsultors)
                                        }
                                        className="m-0 p-0"
                                      >
                                        Ver consultores
                                      </h5>
                                      <Collapse in={showConsultors}>
                                        <div className="">
                                          <ul
                                            className="list mb-0"
                                            style={{ lineHeight: "1.5" }}
                                          >
                                            {e.consultors.map((cons, index) => (
                                              <li
                                                key={index}
                                                className="m-0 p-0"
                                              >
                                                <AiOutlineUser /> {cons.email}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </Collapse>
                                    </div>
                                  )}
                                </div>
                                {e?.news?.length > 0 ? (
                                  <div className="d-flex flex-wrap">
                                    {e.news.map((news, index) => (
                                      <div className="col col-sm-12 col-md-6 col-lg-4 mb-2">
                                        <Novedad
                                          key={index}
                                          news={news}
                                          project={e}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div>
                                    <p className="m-0 p-0">
                                      No hay novedades para este proyecto.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </Collapse>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
            ) : isLoading ? (
              <Spin />
            ) : (
              <div>
                <h3 className="display-4">
                  {user.role === "socio"
                    ? "No hay novedades para aprobar"
                    : "No tiene proyecto asignados"}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal show={showDeleteModal} centered>
        {!isDeleting ? (
          <>
            <Modal.Header closeButton>
              <Modal.Title>Confirmar Eliminación</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>¿Estás seguro de que deseas eliminar este Proyecto?</p>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleDeleteProject}>
                Eliminar
              </Button>
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
    </Layout>
  );
};

export default Projects;
