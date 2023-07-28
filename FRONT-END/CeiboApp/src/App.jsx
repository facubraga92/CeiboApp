import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Members from "./pages/Members";
import { ProtectedRoute } from "./components";
import AddProject from "./pages/AddProject";
import FormNovedades from "./pages/FormNovedades";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerificationPage from "./pages/VerificationPage";
import AccountValidationMessage from "./pages/AccountValidationMessage";
import { getCookieValue, getUserByToken } from "./utils/api";
import Projects from "./pages/Projects";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route
          path="/InvalidAccount"
          exact
          element={<AccountValidationMessage />}
        />

        <Route path="/" element={<ProtectedRoute />}>
          <>
            {/* User Routes, cualquier usuario ya loggeado! */}
            {/* Admin Routes */}
            <Route path="/" element={<ProtectedRoute onlyAdmin />}>
              <Route path="/" exact element={<Members />} />
              <Route path="/admin/members" exact element={<Members />} />
            </Route>

            {/* Manager Routes */}

            <Route path="/" element={<ProtectedRoute onlyManager />}>
              <Route path="/home" exact element={<Projects />} />
              <Route path="/manager" exact element={<Manager />} />
              <Route path="/projects" exact element={<Projects />} />

              <Route path="/projects/add" exact element={<AddProject />} />
              <Route path="/partners" exact element={<Partners />} />
            </Route>

            {/* Contributes Routes */}
            <Route path="/" element={<ProtectedRoute onlyConsultor />}>
              <Route
                path="/project/addNews/:idProject"
                exact
                element={<FormNovedades />}
              />
            </Route>
          </>
        </Route>
        {/*Error 404 */}
        <Route
          path="*"
          element={getCookieValue("token") ? <NotFound /> : <Login />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
