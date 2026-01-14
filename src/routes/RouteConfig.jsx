import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BaseLayout from "./BaseLayout";

import HomePage from "../components/common/HomePage";
import Gallery from "../components/common/Gallery";
import AboutUs from "../components/common/AbouteUS";
import AdminDashboard from "../components/Dashboard/AdminDashboard";
import AgentDashboard from "../components/Dashboard/AgentDashboard";
import AddProperty from "../components/admin/Property/AddProperty";

import ViewAllAgentList from "../components/admin/Agent/ViewAllAgentList";
import AgentDetails from "../components/admin/Agent/AgentDetails";
import ViewPropertyList from "../components/admin/Property/ViewPropertyList";
import PropertyDetails from "../components/admin/Property/PropertyDetails";
import VideoCallRoom from "../components/admin/VideoCallRoom";
import ViewAllSession from "../components/admin/session/ViewAllSession";
import CreateSession from "../components/admin/session/CreateSession";

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
import CustomerReviews from "../components/admin/reviews/CustomerReviews";

import TourList from "../components/admin/Tour/TourList";
import PropertyDetailsAgent from "../components/agent/property/PropertyDetailsAgent";

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
// import Test from "../Testfile";
import ProtectRoutes from "./ProtectedRouter";
import UserProfile from "../pages/UserProfile";
import UpdateAgent from "../components/admin/Agent/UpdateAgent";
import ViewHomeLoan from "../components/HomeLoan/ViewHomeLoan";
 import MainLayout from "./MainLayout";
import Developer from "../components/Developer";
import Commercial from "../components/Comkmercial";
import Luxury from "../components/Luxury";
import Mortgage from "../components/Mortgage.JSX";
import Transactions from "../components/Transaction";
import Measurement from "../components/Mesaurment";
import RentVsBuy from "../components/RentVsByCalculator";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsOfService from "../components/TermsOfService";

export const AdminRoutes = () => {

    console.log("router i  running ")

    return (

        <Route element={<PrivateRoutes />}>
            <Route element={<BaseLayout />}>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/addagent" element={<AddAgent />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/viewallagentlist" element={<ViewAllAgentList />} />
                <Route path="/agentdetails/:id" element={<AgentDetails />} />
                <Route path="/updateagent/:id" element={<UpdateAgent />} />
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
               
                <Route path="/bookings" element={<CreateBooking />} />
                <Route path="/viewpropertyrequest" element={<GetShellPropertyRequest />} />
                <Route path="/confirmBooking" element={<PaymentConfirmationForm />} />
                <Route path="/viewsherebooking" element={<ViewSherBooking />} />
                <Route path="/getresquset" element={<RequestTable />} />
                <Route path="/viewalltransiondata/:id" element={<ViewAllTransationData />} />
                <Route path="/getalltransaction" element={<GetAllTransaction />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/permissions" element={<Permissions />} />
                <Route path="/bookingupdate/:id" element={<BookingUpdateForm />} />
                < Route path="/viewhomeloanrequest" element={<ViewHomeLoan />} />
                {/* <Route path="/testfile" element={<Test />} /> */}
            </Route>
        </Route>
    )
}
export const agentDashboardRoute = () => {
    return (


        <Route element={<PrivateRoutes />}>

            <Route element={<BaseLayout />}>

                <Route path="/agent-dashboard" element={<AgentDashboard />} />
            </Route>
        </Route>

    )

}

export const HomeLoans = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Home Loan Management" />}>
                <Route element={<BaseLayout />}>
                    < Route path="/viewhomeloanrequest" element={<ViewHomeLoan />} />
                    <Route path="/homeloanrequestform" element={<HomeLoanAssistantForm />} />

                </Route>
            </Route>
        </Route>
    )

}

export const AgentRoutes = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Team Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/addagent" element={<AddAgent />} />
                    <Route path="/viewallagentlist" element={<ViewAllAgentList />} />
                    <Route path="/agentdetails/:id" element={<AgentDetails />} />
                    <Route path="/updateagent/:id" element={<UpdateAgent />} />

                </Route>
            </Route>
        </Route>
    )

}

export const ProfileRoutes = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Profile Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/user-profile" element={<UserProfile />} />
                </Route>
            </Route>
        </Route>
    )
}
export const PropertyRoutes = () => {
    return (

        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Property Management" />}>
                <Route element={<BaseLayout />}>

                    <Route path="/addproperty" element={<AddProperty />} />
                    <Route path="/viewpropertylist" element={<ViewPropertyList />} />
                    <Route path="/propertydetails" element={<PropertyDetails />} />
                    <Route path="/updatepropertydetails/:id" element={<UpdateProperty />} />
                    <Route path="/propertydetailsagent" element={<PropertyDetailsAgent />} />
                </Route>
            </Route>
        </Route>
    )




}

export const BlogRoute = () => {
    return (

        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Blog  Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/createblog" element={<CraeteBlog />} />
                    <Route path="/viewbloglist" element={<ViewBlogList />} />
                    <Route path="/updateblog/:id" element={<UpdateBlog />} />

                </Route>
            </Route>
        </Route>

    )



}

export const SessionRoute = () => {

    return (

        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Session Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/session/:roomName" element={<VideoCallRoom />} />
                    <Route path="/viewallsession" element={<ViewAllSession />} />
                    <Route path="/createsession" element={<CreateSession isOpen={true} onClose={() => navigate(-1)} />} />


                </Route>
            </Route>
        </Route>
    )
}

export const AppoinmentRoute = () => {
    return (

        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Appoinment Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/createappoinment" element={<CreateAppoinment />} />
                    <Route path="/getappoinment" element={<GetAppoinment />} />
                    <Route path="/selectappoinmentproperty" element={<SelctAppoinmentProperty />} />
                    <Route path="/showuserappoinment" element={<ShowUserAppoinment />} />


                </Route>
            </Route>
        </Route>
    )
}

export const BookingRoute = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Booking Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/viewsherebooking" element={<ViewSherBooking />} />
                    <Route path="/bookings" element={<CreateBooking />} />
                    <Route path="/viewallbookings" element={<ViewAllBookings />} />
                    <Route path="/viewallbookingdetails" element={<ViewBookingDetails />} />
                    <Route path="/createbookingByAgent" element={<PropertyByAgent />} />
                    <Route path="/bookingupdate/:id" element={<BookingUpdateForm />} />
                    <Route path="/agentlatestboking/:id" element={<LatestAgentBookingDetails />} />
                    <Route path="/viewsherebooking" element={<ViewSherBooking />} />
                    <Route path="/agentlatestboking/:id" element={<LatestAgentBookingDetails />} />
                </Route>
            </Route>
        </Route>
    )
}

export const ShellPropertyRoute = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="Property Shell Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/viewpropertyrequest" element={<GetShellPropertyRequest />} />
                </Route>
            </Route>
        </Route>
    )

}


export const PaymentRoutes = () => {
    return (
        <>
            <Route element={<PrivateRoutes />}>
                <Route element={<ProtectRoutes action="view" module="Payment Management" />}>
                    <Route element={<BaseLayout />}>
                        <Route path="/viewalltransiondata/:id" element={<ViewAllTransationData />} />
                        <Route path="/getalltransaction" element={<GetAllTransaction />} />
                    </Route>
                </Route>
            </Route>
        </>
    );
};



export const VirtualTourRoute = () => {
    return (
        <Route element={<ProtectRoutes action="view" module="Virtual Tour Management" />}>
            <Route element={<BaseLayout />}>
                <Route path="/viewalltransiondata/:id" element={<ViewAllTransationData />} />
                <Route path="/getalltransaction" element={<GetAllTransaction />} />


            </Route>
        </Route>
    )



}
export const InqueryRoutes = () => {
    return (
        <Route element={<PrivateRoutes />}>
            <Route element={<ProtectRoutes action="view" module="CustomerSupport Management" />}>
                <Route element={<BaseLayout />}>
                    <Route path="/viewallinquary" element={<ViewAllInquary />} />
                </Route>
            </Route>
        </Route>
    )

}

export const CustomersReviews = () => {

    return (

        <>

            <Route element={<PrivateRoutes />}>
                <Route element={<ProtectRoutes action="view" module="Review Management" />}>
                    <Route element={<BaseLayout />}>

                        <Route path="/customerreviews" element={<CustomerReviews />} />

                    </Route>
                </Route>
            </Route>
        </>

    )
}

export const AgentCallSupport = () => {
    return (

        <>
            <Route element={<PrivateRoutes />}>
                <Route element={<ProtectRoutes action="view" module="AgentSupport Management" />}>
                    <Route element={<BaseLayout />}>

                        <Route path="/getresquset" element={<RequestTable />} />
                    </Route>
                </Route>
            </Route>
        </>

    )
}
export const PublicRoutes = () => {
    return (
        <>
             <Route element={<MainLayout />}>

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
            <Route path="/testimonials" element={<UserTestimonial />} />
            <Route path="/helpcenter" element={<HelpCenter />} />
            <Route path="/find-developer" element={<Developer />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/luxury" element={<Luxury />} />
            <Route path="/mortgage" element={<Mortgage />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/measurement" element={<Measurement />} />
            <Route path="/calculator" element={<RentVsBuy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
             <Route path="/terms-of-service" element={<TermsOfService />} /> 
            {/* <Route path="/rera-compliance" element={<ReraCompliance />} />  */}
             </Route>
        </>
    );
};








