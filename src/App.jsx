import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";

import { useEffect } from "react";

import Login from "./pages/Auth/Login";

import Signup from "./pages/Auth/Signup";

import ResetPassword from "./pages/Auth/ResetPassword";

import ResetPasswordRequest from "./pages/Auth/ResetPasswordRequest";

import VerifyOtp from "./pages/Auth/VerifyOtp";

import VerifyEmail from "./pages/VerifyEmail";

import AllRoutes from "./routes/AllRoutes";

import PrivateRoutes from "./routes/PrivateRoutes";

import MainLayout from "./routes/MainLayout";

import UserProfile from "./pages/UserProfile";

import GlobalWhatsAppChat from "./components/common/homecommon/GlobalWhatsaapChat";
import CookieBanner from "./components/common/homecommon/CookieBanner";
import GoogleAnalytics from "./components/common/homecommon/GoogleAnalytics";
import FacebookPixel from "./components/common/homecommon/FacebookPixel";

const ScrollToTop = () => {

  const { pathname } = useLocation();

  useEffect(() => {

    window.scrollTo(0, 0);

  }, [pathname]);

  return null;
};

function App() {

  return (
    <>

      <ScrollToTop />
  <GoogleAnalytics />
      <FacebookPixel />
      <ToastContainer />

      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />

        <Route path="/verifyemail" element={<VerifyEmail />} />

        <Route
          path="/forget-password"
          element={<ResetPassword />}
        />

        <Route
          path="/forget-password-request"
          element={<ResetPasswordRequest />}
        />

        <Route
          path="/verify-otp"
          element={<VerifyOtp />}
        />

        {/* Protected Routes */}

        <Route element={<PrivateRoutes />}>

          <Route element={<MainLayout />}>

            <Route
              path="/user-profile"
              element={<UserProfile />}
            />

          </Route>

        </Route>
        {/* Website Routes */}
        <Route path="/*" element={<AllRoutes />} />
      </Routes>

      <GlobalWhatsAppChat />
      <CookieBanner />

    </>
  );
}

export default App;