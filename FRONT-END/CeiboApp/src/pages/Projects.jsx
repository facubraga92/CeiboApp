import React, { useEffect, useRef, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import Novedad from "../components/Novedad";
import { Link } from "react-router-dom";
import { getAllClients, getUserByToken, useCredentials } from "../utils/api";
import { Select, Spin } from "antd";
import "../styles/projects.css";
import { BiRefresh } from "react-icons/bi";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(-1);
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [clientSearch, setClientSearch] = useState(undefined);

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
    console.log(projects);
  }, [projects]);

  useEffect(() => {
    if (!user) return;
    axios
      .get(
        `http://localhost:3000/api/projects/getProjectsUser/${user.id}`,
        useCredentials
      )
      .then((project) => {
        setProjects(project.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  const handleShowDetails = (index) => {
    setSelectedProject((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const clientOption = clients.map((client) => ({
    value: client.name,
    label: client.name,
  }));

  const handleSearch = (name) => {
    setClientSearch(name);
  };

  useEffect(() => {
    console.log(clientSearch);
  }, [clientSearch]);

  return (
    <Layout title="Projects">
      <div className="container">
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
          <div className="col col-sm-12 col-md-4">
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
              style={{ width: "100%" }}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="mt-1 shadow">
          {projects.length > 0 ? (
            projects.map((e, index) => (
              <>
                <div
                  key={index}
                  className={`onHoverRow ${
                    selectedProject === index ? "onClickedRow" : ""
                  } border ${
                    index === 0
                      ? "rounded-top"
                      : index === projects.length - 1
                      ? "rounded-bottom"
                      : ""
                  } `}
                  style={{
                    display:
                      clientSearch === e.customer.name ||
                      clientSearch === undefined
                        ? "block"
                        : "none",
                  }}
                >
                  <div style={{}} className={"p-1 pb-1"} title={e.name}>
                    <div
                      key={index}
                      className={`d-flex justify-content-between align-items-center`}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleShowDetails(index)}
                    >
                      <div className="justify-content-between">
                        <div className="d-flex">
                          <p className="">
                            <span className="lead">{e.name}</span>
                            {" - "}
                            <span className="font-italic">{e.description}</span>
                          </p>
                        </div>
                        <div
                          className="d-flex p-0 m-0"
                          style={{ fontSize: "0.7em" }}
                        >
                          <p className="text-lowercase ">
                            {e?.created_by?.email} -{" "}
                            {e?.created_at.split("T")[0]}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Link to={`/project/addNews/${e._id}`}>
                          <input
                            type="button"
                            value="+"
                            className="btn btn-info"
                          />
                        </Link>
                      </div>
                    </div>

                    <div
                      className={`${selectedProject === index ? "" : "d-none"}`}
                    >
                      {e.news.length > 0 ? (
                        <div className="d-flex flex-wrap">
                          {e.news.map((news, index) => (
                            <div className="col col-4 mb-2">
                              <Novedad key={index} news={news} project={e} />
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
            ))
          ) : (
            <Spin />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Projects;
