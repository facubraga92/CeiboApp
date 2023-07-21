import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import Novedad from "../components/Novedad";
import { Link } from "react-router-dom";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(-1);

  const user = useSelector((state) => {
    return state.user;
  });
  const userId = user;

  useEffect(() => {
    axios
      .post("http://localhost:3000/api/projects/getProjectsUser", user)
      .then((project) => {
        setProjects(project.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      const promises = projects.map(async (proyecto) => {
        const response = await axios.get(
          `http://localhost:3000/api/news/newsProject/${proyecto._id}`,
          {
            withCredentials: true,
            credentials: "include",
          }
        );
        return { project: proyecto, news: response.data };
      });

      const results = await Promise.all(promises);
      setData(results);
    };

    if (projects.length > 0) {
      fetchNews();
    }
  }, [projects]);

  const handleShowDetails = (index) => {
    setSelectedProject((prevIndex) => (prevIndex === index ? -1 : index));
  };

  if (user.role != "manager") return <Layout></Layout>;
  return (
    <Layout title="Home">
      <div className="container col-sm-12 col-md-6">
        <div>
          <Link to="/projects/add">
            <input
              type="button"
              value="Crear proyecto"
              className="btn btn-warning mt-2"
            />
          </Link>
        </div>

        <div className="">
          {data.map((e, index) => (
            <>
              <div>
                {console.log(e)}
                <div
                  key={index}
                  title={index}
                  className={`row mt-2 d-flex p-3 justify-content-between`}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#F5F5F5",
                    borderRadius: "10px",
                  }}
                  onClick={() => handleShowDetails(index)}
                >
                  <div className="d-flex justify-content-between">
                    <strong
                      className="mr-4 text-truncate"
                      style={{ maxWidth: "250px" }}
                    >
                      {e.project.name}
                    </strong>
                    <p className="text-truncate" style={{ width: "20em" }}>
                      {e.project.description}
                    </p>
                  </div>
                  <div>
                    <Link to={"/formNovedades"}>
                      <input type="button" value="+" className="btn btn-info" />
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
                              <Novedad key={index} datos={{ ...news, e }} />
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
            </>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
