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

// import PropertyRegistrationForm from "./components/ShellProperty/PropertyRegistrationForm";
// import ViewShellProperty from "./components/ShellProperty/ViewShellProperty";

import MainLayout from "./routes/MainLayout";
import UserProfile from "./pages/UserProfile";
function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* PUBLIC AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/forget-password" element={<ResetPassword />} />
        <Route path="/forget-password-request" element={<ResetPasswordRequest />} />
        <Route path="/verifytoken" element={<VerifyOtp />} />
        
        {/* PROTECTED ROUTES */}
        <Route element={<PrivateRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/user-profile" element={<UserProfile />} />
            {/* Add other protected routes here */}
          </Route>
        </Route>

        {/* Catch-all for other routes defined in AllRoutes */}
        <Route path="*" element={<AllRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
