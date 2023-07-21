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
import { useSelector } from "react-redux";
import VerificationPage from "./pages/VerificationPage";
import AccountValidationMessage from "./pages/AccountValidationMessage";

function App() {
  const user = useSelector((state) => state.user);
  return (
    <>
      <Routes>
        {/* User routes 
        <Route path="/" element={<ProtectedRoute />}></Route>*/}
        {/* Public Routes */}
        <Route
          path="/"
          element={
            user.email ? (
              user.isValidated ? (
                <Home />
              ) : (
                <AccountValidationMessage />
              )
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" exact element={<Profile />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route
          path="/validation-error"
          element={<AccountValidationMessage />}
        />
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
        <Route path="/" element={<ProtectedRoute onlyContributor />}>
          {user.isValidated ? (
            <>
              <Route path="/formNovedades" exact element={<FormNovedades />} />
              <Route path="/home" exact element={<Home />} />
            </>
          ) : (
            <Route path="/home" exact element={<AccountValidationMessage />} />
          )}
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
