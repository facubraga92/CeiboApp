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
import { getUserByToken } from "./utils/api";

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

        <Route path="/" element={<ProtectedRoute IsLogged />}>
          <>
            {/* RUTA PARA SOLO CON LOGEO */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            ></Route>

            {/* Admin Routes */}
            <Route
              path="/admin/members"
              element={
                <ProtectedRoute onlyAdmin>
                  <Members />
                </ProtectedRoute>
              }
            ></Route>

            {/* Manager Routes */}
            <Route
              path="/projects/add"
              element={
                <ProtectedRoute onlyManager>
                  <AddProject />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/partners"
              element={
                <ProtectedRoute onlyManager>
                  <Partners />
                </ProtectedRoute>
              }
            ></Route>

            <Route
              path="/customers"
              element={
                <ProtectedRoute onlyManager>
                  <Customers />
                </ProtectedRoute>
              }
            ></Route>

            {/* Contributes and Manager Routes */}
            <Route
              path="/project/addNews/:idProject"
              element={
                <ProtectedRoute onlyManajerOrConsultor>
                  <FormNovedades />
                </ProtectedRoute>
              }
            ></Route>

            {/* Partners Routes*/}
          </>
        </Route>
        {/*Error 404 */}
        <Route path="*" element={getUserByToken() ? <NotFound /> : <Login />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
