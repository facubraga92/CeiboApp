import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import News from "../components/Novedades";

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

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Layout title="Home">
      <div className="container col-sm-12 col-md-10">
        <div className="">
          {data.map((e, index) => (
            <div
              key={index}
              title={index}
              className={`row mt-2 d-flex flex-column p-3 bg-light`}
              onClick={() => handleShowDetails(index)}
              style={{ cursor: "pointer" }}
            >
              <strong>{e.project.name}</strong>

              {selectedProject === index && (
                <div className="ml-3">
                  {e.news.length > 0 ? (
                    e.news.map((news) => (
                      <div
                        className="m-2 d-flex justify-content-between"
                        key={news._id}
                        style={{ backgroundColor: "beige" }}
                      >
                        <p>{news.title}</p>
                        <p>{news.title}</p>
                        <p>{news.title}</p>
                        <p>{news.title}</p>
                        <p>{news.title}</p>
                        <p>{news.title}</p>
                      </div>
                    ))
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
