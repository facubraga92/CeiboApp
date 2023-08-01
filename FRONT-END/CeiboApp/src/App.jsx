//libs
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

//Pages
import Register from "./pages/Register";
import Members from "./pages/Members";
import AddProject from "./pages/AddProject";
import FormNovedades from "./pages/FormNovedades";
import Projects from "./pages/Projects";
import Login from "./pages/Login";
import Partners from "./pages/Partners";
import NotFound from "./pages/NotFound";
import VerificationPage from "./pages/VerificationPage";
import AccountValidationMessage from "./pages/AccountValidationMessage";
import Customers from "./pages/Customers";

// Data user
import { getCookieValue } from "./utils/api";

//Protected Routes
import { IsLogged } from "./components/ProtectedRoute/IsLogged";
import { ProtectedRoute } from "./components";


function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <IsLogged>
              <Login />
            </IsLogged>
          }
        />
        <Route
          path="/register"
          element={
            <IsLogged>
              <Register />
            </IsLogged>
          }
        />
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route
          path="/InvalidAccount"
          exact
          element={<AccountValidationMessage />}
        />

        <Route path="/" element={<ProtectedRoute />}>
          <>
            {/* Admin Routes */}
            <Route path="/" element={<ProtectedRoute onlyAdmin />}>
              <Route path="/" exact element={<Members />} />
              <Route path="/admin/members" exact element={<Members />} />
            </Route>

            {/* Manager Routes */}
            <Route path="/" element={<ProtectedRoute onlyManager />}>
              <Route path="/projects/add" exact element={<AddProject />} />
              <Route path="/partners" exact element={<Partners />} />
              <Route path="/customers" exact element={<Customers />} />
            </Route>

            {/* Contributes and Manager Routes */}
            <Route path="/" element={<ProtectedRoute onlyManajerOrConsultor />}>
              <Route path="/projects" exact element={<Projects />} />
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
