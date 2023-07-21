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
      <div className="container col-sm-12 col-md-6">
        <div className="">
          {data.map((e, index) => (
            <div
              key={index}
              title={index}
              className={`row mt-2 d-flex  flex-column justify-content-center alaig p-3 bg-light`}
              onClick={() => handleShowDetails(index)}
              style={{ cursor: "pointer" }}
            >
              <table class="table bd-highlight table-striped">
                <thead class=" bd-highlight flex-fill">
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                  </tr>
                </thead>
                <tbody class="table table-striped  bd-highlight table-hover">
                  <tr>
                    <th scope="row"></th>
                    <td>{e.project.name}</td>
                    <td>{e.project.description}</td>
                  </tr>
                </tbody>
              </table>

              {selectedProject === index && (
                <div className="ml-3">
                  {e.news.length > 0 ? (
                    e.news.map((news) => (
                      <table class="table table-primary table-striped">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Reply</th>
                          </tr>
                        </thead>
                        <tbody class="table table-primary table-hover">
                          <tr>
                            <th scope="row"></th>
                            <td>{news.title}</td>
                            <td>{news.description}</td>
                            <td>{news.reply.length}</td>
                          </tr>
                        </tbody>
                      </table>
                    ))
                  ) : (
                    <div>
                      <table class="table table-primary table-striped">
                        <thead>
                          <tr>
                            <th scope="col"></th>
                            <th scope="col">Name</th>
                          </tr>
                        </thead>
                        <tbody class="table table-primary table-hover">
                          <tr>
                            <th scope="row"></th>
                            <td>este proyecto no tiene novedades</td>

                            <td></td>
                          </tr>
                        </tbody>
                      </table>
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
