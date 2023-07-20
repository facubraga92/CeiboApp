import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { useSelector } from "react-redux";

const Home = () => {
  //  const paramMovie = useParams();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  return (
    <Layout title="Home">
      <div>
        {/* Ternario para verificar si projects está vacío */}
        {projects.length === 0 ? (
          <p>No hay proyectos para mostrar.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className={`card mb-3 ${
                selectedProject === project ? "bg-primary text-white" : ""
              }`}
              onClick={() => handleProjectClick(project)}
            >
              <div className="card-body">
                <small>{project.name}</small>
                {selectedProject === project && (
                  <div>
                    <p className="card-text">{project.description}</p>
                    <p>Customer: {project.customer}</p>
                    <p>Consultors: {project.consultors.join(", ")}</p>
                    <p>Managers: {project.managers.join(", ")}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Home;
