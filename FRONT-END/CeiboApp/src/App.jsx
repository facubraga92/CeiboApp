import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Members from "./pages/Members";
import { Manager } from "./pages/Manager";
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
import { getCookieValue } from "./utils/api";
import Projects from "./pages/Projects";
import Home from "./pages/Home";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}

        <Route path="/home" element={<Home />} />
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
            <Route path="/profile" exact element={<Profile />} />

            {/* Admin Routes */}
            <Route path="/" element={<ProtectedRoute onlyAdmin />}>
              <Route path="/admin/members" exact element={<Members />} />
            </Route>

            {/* Manager Routes */}

            <Route path="/" element={<ProtectedRoute onlyManager />}>
              <Route path="/manager" exact element={<Manager />} />
              <Route path="/projects" exact element={<Projects />} />
              <Route path="/projects/add" exact element={<AddProject />} />
              <Route path="/partners" exact element={<Partners />} />
            </Route>

            {/* Contributes Routes */}
            <Route path="/" element={<ProtectedRoute onlyContributor />}>
              <Route
                path="/project/addNews/:idProject"
                exact
                element={<FormNovedades />}
              />
              <Route path="/formNovedades" exact element={<FormNovedades />} />
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
