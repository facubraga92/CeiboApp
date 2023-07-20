import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import News from "../components/Novedades";

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [data, setData] = useState([]);

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

  return (
    <Layout title="Home">
      <div className="container col-sm-12 col-md-6">
        {data.map((project, index) => (
          <div key={index}>
            <h1>{project.project.name}</h1>
            {project.news.map((news, index) => {
              <News key={index} />;
            })}
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
