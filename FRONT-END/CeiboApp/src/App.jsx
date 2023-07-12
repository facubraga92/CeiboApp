import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./commons/Navbar";
import { useSelector } from "react-redux";
import Members from "./components/Members";
import { ProtectedRoute } from "./components";
function App() {
  const user = useSelector((state) => state.user);

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
          {/* Routes */}
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
