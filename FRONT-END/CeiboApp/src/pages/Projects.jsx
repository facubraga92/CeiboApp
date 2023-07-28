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

  const handleShowDetails = (index) => {
    setSelectedProject((prevIndex) => (prevIndex === index ? -1 : index));
  };

  useEffect(() => {
    console.log(projects);
  }, [projects]);

  return (
    <Layout title="Projects">
      <div className="container-fluid col-sm-12 col-md-10 ">
        {user?.role === "manager" && (
          <div>
            <Link to="/projects/add">
              <input
                type="button"
                value="Crear proyecto"
                className="btn btn-warning mt-2"
              />
            </Link>
          </div>
        )}
        <div className="mt-1 shadow" style={{ backgroundColor: "#f6f8fa" }}>
          {projects.length > 0 ? (
            projects.map((e, index) => (
              <>
                <div
                  className={`onHoverRow border ${
                    index === 0
                      ? "rounded-top"
                      : index === projects.length - 1
                      ? "rounded-bottom"
                      : ""
                  } `}
                >
                  <div style={{}} className={"p-1"} title={e.name}>
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
                            {e.name}

                            {e.description}
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
                    {selectedProject === index && (
                      <div className="">
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
