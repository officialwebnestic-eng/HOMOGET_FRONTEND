import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetPasswordRequest from "./pages/Auth/ResetPasswordRequest";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import VerifyEmail from "./pages/VerifyEmail";

import AllRoutes from "./routes/AllRoutes";
import PrivateRoutes from "./routes/PrivateRoutes";

import PropertyRegistrationForm from "./components/ShellProperty/PropertyRegistrationForm";
import ViewShellProperty from "./components/ShellProperty/ViewShellProperty";

import MainLayout from "./routes/MainLayout";
import BaseLayout from "./routes/BaseLayout";

function App() {
  return (
    <Router>
      <ToastContainer />
      <AllRoutes />

      

      <Routes>
        {/* AUTH PAGES (NO NAVBAR / FOOTER / SIDEBAR) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ResetPassword />} />
        <Route path="/forget-password-request" element={<ResetPasswordRequest />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />



        < Route element={<PrivateRoutes />}>
          <Route element={<MainLayout />}>
            <Route
              path="/userpropertyregister"
              element={<PropertyRegistrationForm />}
            />
            <Route
              path="/getPropertyshell"
              element={<ViewShellProperty />}
            />

          </Route>




        </Route>


      </Routes>
    </Router>
  );
}

export default App;
