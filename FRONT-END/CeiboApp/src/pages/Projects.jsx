import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import Novedad from "../components/Novedad";
import { Link } from "react-router-dom";
import { getAllClients, getUserByToken, useCredentials } from "../utils/api";
import { Select, Spin } from "antd";
import "../styles/projects.css";
import { BiRefresh } from "react-icons/bi";
import { envs } from "../config/env/env.config";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState(undefined);
  const [users, setUsers] = useState([]);

  const { VITE_BACKEND_URL } = envs;

  useEffect(() => {
    const handle = async () => {
      const user = await getUserByToken();
      const clients = await getAllClients();
      setClients(clients);
      return setUser(user);
    };
    userOption();
    handle();
  }, []);

  useEffect(() => {
    if (!user) return;
    axios
      .get(
        `http://localhost:3000/api/projects/getProjectsUser/${user.id}`,
        useCredentials
      )
      .then((project) => {
        setProjects(groupProjectsByClient(project.data));
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

  const userOption = async () => {
    const { data } = await axios.get(
      `${VITE_BACKEND_URL}/users/admin/members`,
      useCredentials
    );

    const aux = await data.map((u) => ({
      value: u.name,
      label: u.email,
    }));
    return setUsers(aux);
  };

  const handleSearch = (name) => {
    setClientSearch(name);
  };

  useEffect(() => {
    localStorage.setItem("selectedProject", selectedProject);
  }, [selectedProject]);

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
        <div className="row mt-1">
          <div className="">
            <div className="col">
              <Select
                allowClear
                showSearch
                placeholder="Seleccione un cliente . . ."
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={clientOption}
                onChange={handleSearch}
              />
            </div>
            <div className="col">
              <Select
                allowClear
                showSearch
                placeholder="Seleccione un usuario . . ."
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={users}
              />
            </div>
          </div>
        </div>
        {projects.length > 0 ? (
          projects
            .filter(
              (proj) => proj[0] === clientSearch || clientSearch === undefined
            )
            .map(([customer, e], i) => (
              <div className="mt-1 mb-4">
                <h4>{customer}</h4>
                <div className="shadow">
                  {e.map((e, index) => (
                    <>
                      <div
                        key={e._id}
                        className={`onHoverRow ${
                          selectedProject === e._id ||
                          localStorage.getItem("selectedProject") === e._id
                            ? "onClickedRow"
                            : ""
                        } border ${
                          index === 0
                            ? "rounded-top"
                            : index === projects.length - 1
                            ? "rounded-bottom"
                            : ""
                        } `}
                      >
                        <div style={{}} className={"p-1 pb-1"} title={e.name}>
                          <div
                            key={e._id}
                            className={`d-flex justify-content-between align-items-center`}
                            style={{
                              cursor: "pointer",
                            }}
                            onClick={() => handleShowDetails(e._id)}
                          >
                            <div className="justify-content-between">
                              <div className="d-flex">
                                <p className="">
                                  <span className="lead">{e.name}</span>
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
                                <p className="text-lowercase ">
                                  {e?.created_by?.email} -{" "}
                                  {e?.created_at?.split("T")[0]}
                                </p>
                              </div>
                            </div>
                            <div>
                              <Link to={`/project/addNews/${e._id}`}>
                                <input
                                  type="button"
                                  value="+"
                                  className="btn btn-info"
                                  onClick={(e) => setSelectedProject(e._id)}
                                />
                              </Link>
                            </div>
                          </div>

                          <div
                            className={`${
                              selectedProject === e._id ? "" : "d-none"
                            }`}
                          >
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
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            ))
        ) : (
          <Spin />
        )}
      </div>
    </Layout>
  );
};

export default Projects;
