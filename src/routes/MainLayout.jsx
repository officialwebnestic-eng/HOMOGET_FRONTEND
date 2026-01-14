import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <>
      <Navbar />
  <div className="  mt-7 md:mt-12 lg:mt-16">
    <Outlet />
  </div>
      <Footer />
    </>
  );
};

export default MainLayout;
