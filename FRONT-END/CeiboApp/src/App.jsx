import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Navbar from "./commons/Navbar";
import { useSelector } from "react-redux";
import Members from "./components/Members";
function App() {
  const user = useSelector((state) => state.user);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={user.email ? <Home /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/members"
          element={user.role == "admin" ? <Members /> : <Login />}
        />
      </Routes>
    </>
  );
}

export default App;
