import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./commons/Navbar";
import Members from "./pages/Members";
import { Manager } from "./pages/Manager";
import { ProtectedRoute } from "./components";
import AddProject from "./components/AddProject";
function App() {

  return (
    <>
      <Navbar />
      <Routes>
        {/* User routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/" exact element={<Home />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute onlyAdmin />}>
          <Route path="/admin/members" exact element={<Members />} />
        </Route>

        {/* Manager Routes */}
        <Route path="/manager" element={<ProtectedRoute onlyManager />}>
          <Route path="/manager" exact element={<Manager />} />
        </Route>

        {/* Contributes Routes */}
        <Route path="/projects" element={<ProtectedRoute onlyContributor />}>
           <Route path="/projects/add" exact element={<AddProject />} />
        </Route>

      </Routes>
    </>
  );
}

export default App;
