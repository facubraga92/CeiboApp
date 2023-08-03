import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import Novedad from "../components/Novedad";
import { Link } from "react-router-dom";
import { getAllClients, getUserByToken, useCredentials } from "../utils/api";
import { Input, Select, Spin } from "antd";
import "../styles/projects.css";
import { BiRefresh } from "react-icons/bi";
import { envs } from "../config/env/env.config";
import { RiAddBoxLine, RiDeleteBin2Line, RiEditBoxLine } from "react-icons/ri";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState("");
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState(undefined);
  const [codeSearch, setCodeSearch] = useState(undefined);

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

  useEffect(() => {
    console.log(clients);
  }, [clients]);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <Layout title="Projects">
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
                  className="btn btn-warning mt-2"
                />
              </Link>
            </div>
          )}
          <div className="col">
            <div className="d-flex justify-content-end">
              <span className="font-italic"></span>
              <BiRefresh size={30} />
            </div>
          </div>
        </div>
        <div className="row mt-2 mb-2">
          {projects.length > 0 && (
            <div className="col-12 col-md-4">
              {user.role !== "socio" && (
                <div className="mb-1">
                  <Input
                    allowClear
                    value={codeSearch}
                    onChange={handleSearchByCode}
                    addonBefore="Codigo"
                    placeholder="Busqueda por codigo"
                  />
                </div>
              )}
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
              (proj) => proj[0] === clientSearch || clientSearch === undefined
            )
            .map(([customer, proj], i) => (
              <div className="mt-1 mb-4">
                <h4>{customer}</h4>
                <div className="shadow">
                  {proj.map((e, index) => (
                    <>
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
                                  className="font-weight-bold font-italic p-0 m-0 text-uppercase"
                                  style={{ fontSize: "2rem" }}
                                >
                                  #{e.code}
                                </p>
                              </div>
                              <div></div>
                            </div>
                            {user?.role === "manager" && (
                              <>
                                <div className="d-none d-lg-flex flex-column ">
                                  <div className="">
                                    <Link to={`/project/delete/${e._id}`}>
                                      <input
                                        type="button"
                                        value="Borrar proyecto"
                                        className="btn btn-danger w-100"
                                        onClick={(e) =>
                                          setSelectedProject(e._id)
                                        }
                                      />
                                    </Link>
                                  </div>
                                  <div>
                                    <Link to={`/project/edit/${e._id}`}>
                                      <input
                                        type="button"
                                        value="Editar proyecto"
                                        className="btn btn-warning  w-100"
                                        onClick={(e) =>
                                          setSelectedProject(e._id)
                                        }
                                      />
                                    </Link>
                                  </div>
                                  <div>
                                    <Link to={`/project/addNews/${e._id}`}>
                                      <input
                                        type="button"
                                        value="Agregar novedad"
                                        className="btn btn-primary w-100"
                                        onClick={(e) =>
                                          setSelectedProject(e._id)
                                        }
                                      />
                                    </Link>
                                  </div>
                                </div>
                                <div className="d-flex d-lg-none">
                                  <>
                                    <div className="">
                                      <Link to={`/project/delete/${e._id}`}>
                                        <RiDeleteBin2Line
                                          size={30}
                                          className="mr-2"
                                        />
                                      </Link>
                                    </div>
                                    <div>
                                      <Link to={`/project/edit/${e._id}`}>
                                        <RiEditBoxLine
                                          size={30}
                                          className="mr-2"
                                        />
                                      </Link>
                                    </div>
                                    <div>
                                      <Link to={`/project/addNews/${e._id}`}>
                                        <RiAddBoxLine size={30} />
                                      </Link>
                                    </div>
                                  </>
                                </div>
                              </>
                            )}
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
      </div>
    </Layout>
  );
};

export default Projects;
