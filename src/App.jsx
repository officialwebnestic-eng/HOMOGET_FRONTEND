import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import { ToastContainer } from 'react-toastify';
import AllRoutes from "./routes/AllRoutes";
import Footer from "./components/common/Footer";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import PrivateRoutes from "./routes/PrivateRoutes";
import PropertyRegistrationForm from "./components/ShellProperty/PropertyRegistrationForm";
import ViewShellProperty from "./components/ShellProperty/ViewShellProperty";
import ResetPassword from "./pages/Auth/ResetPassword";
import ResetPasswordRequest from "./pages/Auth/ResetPasswordRequest";
import VerifyOtp from "./pages/Auth/VerifyOtp";
import UserProfile from "./pages/UserProfile";
import VerifyEmail from "./pages/VerifyEmail";
 import {useId} from"react"



function App() {
  const { user } = useContext(AuthContext);
 




  return (
    <Router>
      <ToastContainer />
      <Navbar />
      <AllRoutes />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ResetPassword />} />
        <Route path="/forget-password-requset" element={<ResetPasswordRequest />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/userpropertyregister" element={<PropertyRegistrationForm />} />
          <Route path="/getPropertyshell" element={<ViewShellProperty />} />

        </Route>
      </Routes>
      <Footer />

    </Router>
  );
}

export default App;
