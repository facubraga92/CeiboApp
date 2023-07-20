import axios from "axios";
import React, { useEffect, useState } from "react";

const News = ({ project }) => {
  const [selectedProject, setSelectedProject] = useState({}); // Cambiamos el nombre del estado



  return (
    <div>
      {selectedProject.data === undefined ? (
        <p>no hay novedades</p>
      ) : (
        <h1>{selectedProject.data.title}</h1>
      )}
    </div>
  );
};

export default News;
