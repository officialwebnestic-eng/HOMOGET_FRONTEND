
import { Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./BaseLayout";



import HomePage from "../components/common/HomePage";
import Gallery from "../components/common/Gallery";
import AboutUs from "../components/common/AbouteUS";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import AgentDashboard from "../components/Dashboard/AgentDashboard";
import AddProperty from "../components/admin/Property/AddProperty";

import { AuthContext } from "../context/AuthContext";
import ViewAllAgentList from "../components/admin/Agent/ViewAllAgentList";
import AgentDetails from "../components/admin/Agent/AgentDetails";
import ViewPropertyList from "../components/admin/Property/ViewPropertyList";
import PropertyDetails from "../components/admin/Property/PropertyDetails";
import VideoCallRoom from "../components/admin/VideoCallRoom";
import ViewAllSession from "../components/admin/session/ViewAllSession";
import CreateSession from "../components/admin/session/CreateSession";
import CustomerReviews from "../components/admin/reviews/CustomerReviews";
import { useNavigate } from "react-router-dom"
import ViewAllInquary from "../components/agent/inquary/ViewAllInquary";
import ViewBookingDetails from "../components/agent/Booking/ViewBookingDetails";
import ViewAllBookings from "../components/agent/Booking/ViewAllBookings";
import CreateBooking from "../components/agent/Booking/CreateBooking";
import Projects from "../components/common/homecommon/projects";
import PropertyListing from "../components/common/PropertyListing";
import AgentSupport from "../components/common/AgentSupport";
import LegalDocumentationSupport from "../components/common/LegalDocumentationSupport";
import VirtualTourAndWalkthrough from "../components/common/VirtualToureAnd Walkthrough";
import VirtualToureBookingForm from "../components/VirtualToureBookingForm";
import HomeLoanAssistantForm from "../components/common/HomeLoanAssistentForm";
import ContactUs from "../components/common/ContactUs";
import Blog from "../components/common/Blog";
import CraeteBlog from "../components/admin/blog/CreateBlog";
import ViewBlogList from "../components/admin/blog/ViewlBlogList";
import UpdateBlog from "../components/admin/blog/UpdateBlog";
import UpdateProperty from "../components/admin/Property/UpdateProperty";
import CreateAppoinment from "../components/Appoinment/CreateAppoinment";
import GetAppoinment from "../components/Appoinment/GetAppoinment";
import SelctAppoinmentProperty from "../components/Appoinment/SelectAppoinmentProperty";
import ShowUserAppoinment from "../components/Appoinment/ShowUserAppoinment"

import TourList from "../components/admin/Tour/TourList";
import PropertyDetailsAgent from "../components/agent/property/PropertyDetailsAgent";
import { AddStaff } from "../components/admin/Staff/AddStaff"
import ViewStaff from "../components/admin/Staff/ViewStaff";
import RequestTable from "../components/agent/RequestTable/RequsetTable";
import PaymentConfirmationForm from "../components/agent/Booking/PaymentConfirmationForm";
import PropertyByAgent from "../components/agent/property/PropertyByAgent";
import BookingUpdateForm from "../components/agent/Booking/BookingUpdateForm";
import PropertyRegistrationForm from "../components/ShellProperty/PropertyRegistrationForm";
import GetShellPropertyRequest from "../components/ShellProperty/GetShellPropertyRequest";
import ViewSherBooking from "../components/agent/Booking/ViewShereBooking";
import ViewAllTransationData from "../components/admin/Transation/ViewAllTransationData";
import LatestAgentBookingDetails from "../components/agent/Booking/LatestAgentBookingDetails";
import UserTestimonial from "../components/admin/reviews/UserTestimonial";
import GetAllTransaction from "../components/admin/Transation/GetAllTransaction";
import PrivateRoutes from "./PrivateRoutes";
import HelpCenter from "../components/common/HelpCenter";
import Roles from "../Authorization/Roles";
import Permissions from "../Authorization/Permissions";
import AddAgent from "../components/admin/Agent/AddAgent";
import Test from "../Testfile"
import ProtectRoutes from "./ProtectedRouter";



const AllRoutes = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate()



  return (
    <>

      {user.role === "admin" ? (
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<BaseLayout userRole="admin" />}>
              <Route path="/" element={<AdminDashboard />} />
              <Route path="/addagent" element={<AddAgent />} />
              <Route path="/viewallagentlist" element={<ViewAllAgentList />} />
              <Route path="/agentdetails" element={<AgentDetails />} />
              <Route path="/addproperty" element={<AddProperty />} />
              <Route path="/viewpropertylist" element={<ViewPropertyList />} />
              <Route path="/propertydetails" element={<PropertyDetails />} />
              <Route path="/session/:roomName" element={<VideoCallRoom />} />
              <Route path="/viewallsession" element={<ViewAllSession />} />
              <Route path="/createsession" element={<CreateSession isOpen={true} onClose={() => navigate(-1)} />} />
              <Route path="/customerreviews" element={<CustomerReviews />} />
              <Route path="/createblog" element={<CraeteBlog />} />
              <Route path="/viewbloglist" element={<ViewBlogList />} />
              <Route path="/updateblog/:id" element={<UpdateBlog />} />
              <Route path="/updatepropertydetails/:id" element={<UpdateProperty />} />
              <Route path="/gettourbooking" element={<TourList />} />
              <Route path="/viewallbookings" element={<ViewAllBookings />} />
              <Route path="/createappoinment" element={<CreateAppoinment />} />
              <Route path="/getappoinment" element={<GetAppoinment />} />
              <Route path="/selectappoinmentproperty" element={<SelctAppoinmentProperty />} />
              <Route path="/showuserappoinment" element={<ShowUserAppoinment />} />
              <Route path="/addstaff" element={<AddStaff />} />
              <Route path="/viewstaff" element={<ViewStaff />} />
              <Route path="/bookings" element={<CreateBooking />} />
              <Route path="/viewpropertyrequest" element={<GetShellPropertyRequest />} />
              <Route path="/confirmBooking" element={<PaymentConfirmationForm />} />
              <Route path="/viewsherebooking" element={<ViewSherBooking />} />
              <Route path="/getresquset" element={<RequestTable />} />
              <Route path="/viewalltransiondata/:id" element={<ViewAllTransationData />} />
              <Route path="/getalltransaction" element={<GetAllTransaction />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/permissions" element={<Permissions />} />
              <Route path="/testfile" element={<Test />} />
            </Route>
          </Route>
        </Routes>
      ) : user.role ? (


        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="User Management" />}>
              <Route element={<BaseLayout userRole={user.role} />}>
                <Route path="/" element={<AgentDashboard />} />
                <Route path="/addproperty" element={<AddProperty />} />
                <Route path="/viewpropertylist" element={<ViewPropertyList />} />
                <Route path="/propertydetailsagent" element={<PropertyDetailsAgent />} />
                <Route path="/session/:roomName" element={<VideoCallRoom />} />
                <Route path="/viewallsession" element={<ViewAllSession />} />
                <Route path="/createsession" element={<CreateSession isOpen={true} onClose={() => navigate(-1)} />} />
                <Route path="/customerreviews" element={<CustomerReviews />} />
                <Route path="/viewallinquary" element={<ViewAllInquary />} />
                <Route path="/viewallbookingdetails" element={<ViewBookingDetails />} />
                <Route path="/viewallbookings" element={<ViewAllBookings />} />
                <Route path="/bookings" element={<CreateBooking />} />
                <Route path="/createappoinment" element={<CreateAppoinment />} />
                <Route path="/getappoinment" element={<GetAppoinment />} />
                <Route path="/selectappoinmentproperty" element={<SelctAppoinmentProperty />} />
                <Route path="/showuserappoinment" element={<ShowUserAppoinment />} />
                <Route path="/getresquset" element={<RequestTable />} />
                <Route path="/bookings" element={<CreateBooking />} />

                <Route path="/createbookingByAgent" element={<PropertyByAgent />} />
                <Route path="/bookingupdate/:id" element={<BookingUpdateForm />} />
                <Route path="/viewsherebooking" element={<ViewSherBooking />} />
                <Route path="/agentlatestboking/:id" element={<LatestAgentBookingDetails />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      ) : (



        <Routes>
          <Route >
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/propertylisting" element={<PropertyListing />} />
            <Route path="/agentsupport" element={<AgentSupport />} />
            <Route path="/documentationsupport" element={<LegalDocumentationSupport />} />
            <Route path="/walkthrough" element={<VirtualTourAndWalkthrough />} />
            <Route path="/virtualtoure" element={<VirtualToureBookingForm />} />
            <Route path="/homeloanrequestform" element={<HomeLoanAssistantForm />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/bookings" element={<CreateBooking />} />
            <Route path="/createappoinment" element={<CreateAppoinment />} />
            <Route path="/selectappoinmentproperty" element={<SelctAppoinmentProperty />} />
            <Route path="/showuserappoinment" element={<ShowUserAppoinment />} />
            <Route path="/showuserappoinment" element={<ShowUserAppoinment />} />
            <Route path="/testimonials" element={<UserTestimonial />} />
            <Route path="/helpcenter" element={<HelpCenter />} />


          </Route>
        </Routes>
      )}
    </>
  );
};

