import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Members from "./pages/Members";
import { Manager } from "./pages/Manager";
import { ProtectedRoute } from "./components";
import AddProject from "./pages/AddProject";
import FormNovedades from "./pages/FormNovedades";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Partners from "./pages/Partners";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Routes>
        {/* User routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" exact element={<Home />} />
          <Route path="/formNovedades" exact element={<FormNovedades />} />
        </Route>
        {/* Public Routes */}
        <Route path="/Login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" exact element={<Profile />} />
        {/* Admin Routes */}
        <Route path="/" element={<ProtectedRoute onlyAdmin />}>
          <Route path="/admin/members" exact element={<Members />} />
        </Route>
        {/* Manager Routes */}
        <Route path="/" element={<ProtectedRoute onlyManager />}>
          <Route path="/manager" exact element={<Manager />} />
          <Route path="/projects/add" exact element={<AddProject />} />
          <Route path="/partners" exact element={<Partners />} />
        </Route>
        {/* Contributes Routes */}
        <Route path="/" element={<ProtectedRoute onlyContributor />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
