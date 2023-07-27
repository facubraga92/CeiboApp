import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import Novedad from "../components/Novedad";
import { Link } from "react-router-dom";
import { getUserByToken, useCredentials, userMe } from "../utils/api";
import { Spin } from "antd";
import "../styles/projects.css";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(-1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handle = async () => {
      const user = getUserByToken();
      return setUser(user);
    };
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
        setProjects(project.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  const handleShowDetails = (index) => {
    setSelectedProject((prevIndex) => (prevIndex === index ? -1 : index));
  };

  return (
    <Layout title="Projects">
      <div className="container col-sm-12 col-md-10">
        <div>
          <Link to="/projects/add">
            <input
              type="button"
              value="Crear proyecto"
              className="btn btn-warning mt-2"
            />
          </Link>
        </div>

        <div className="mt-1 shadow" style={{ backgroundColor: "#f6f8fa" }}>
          {projects.length > 0 ? (
            projects.map((e, index) => (
              <>
                <div
                  className={`border onHoverDiv ${
                    index === 0
                      ? "rounded-top"
                      : index === projects.length - 1
                      ? "rounded-bottom"
                      : ""
                  } `}
                >
                  <div style={{}} className={"p-1"}>
                    <div
                      key={index}
                      title={index}
                      className={`d-flex justify-content-between`}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() => handleShowDetails(index)}
                    >
                      <div className="d-flex justify-content-between">
                        <strong
                          className="mr-4 text-truncate"
                          style={{ maxWidth: "250px" }}
                        >
                          {e.name}
                        </strong>
                        <p className="text-truncate" style={{ width: "20em" }}>
                          {e.description}
                        </p>
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
                    {selectedProject === index && (
                      <div className="ml-5 mt-0">
                        {e.news.length > 0 ? (
                          <div className="table-responsive ">
                            <table className="table table-striped table-hover table-sm">
                              <thead className="">
                                <tr className="">
                                  <th>Título</th>
                                  <th>Fecha de Creación</th>
                                  <th>Descripción</th>
                                  <th>Estado</th>
                                  <th>Comentarios</th>
                                </tr>
                              </thead>
                              <tbody
                                style={{ cursor: "pointer" }}
                                className="container"
                              >
                                {e.news.map((news, index) => (
                                  <Novedad key={index} idNews={news._id} />
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div>
                            <p className="m-0 p-0">
                              No hay novedades para este proyecto.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
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
