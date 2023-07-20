import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import News from "../components/Novedades";
const Home = () => {
  //  const paramMovie = useParams();
  const [projects, setProjects] = useState([]);

  const [data, setData] = useState([]);

  const user = useSelector((state) => {
    return state.user;
  });
  const userId = user;
  useEffect(() => {
    console.log(userId, "USUARIO");

    axios
      .post("http://localhost:3000/api/projects/getProjectsUser", user)
      .then((project) => {
        setProjects(project.data);
        console.log(project, "USUARIO");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    projects.map((proyecto) => {
      let aux = [];
      console.log(proyecto);
      axios
        .get(`http://localhost:3000/api/news/newsProject/${proyecto._id}`, {
          withCredentials: true,
          credentials: "include",
        })
        .then((novedades) => {
          aux.push(novedades);

          setData((e) => {
            return e.concat(aux);
          });
          console.log(data, "...........................................");
        });
    });
  }, [projects]);

  /*   const handleProjectClick = (project) => {
    setSelectedProject(project);
  }; */

  return (
    <Layout title="Home">
      <div className="container col-sm-12 col-md-6"></div>
    </Layout>
  );
};

export default Home;
