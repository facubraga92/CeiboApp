import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./commons/Navbar";
import Members from "./pages/Members";
import { ProtectedRoute } from "./components";
import { Manager } from "./pages/Manager";
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

        {/* Manager Routes */}
        <Route path="/contributor" element={<ProtectedRoute onlyContributor />}>
          {/* Routes */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
