import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  AdminRoutes,
  AgentRoutes,
  ProfileRoutes,
  PropertyRoutes,
  BlogRoute,
  SessionRoute,
  AppoinmentRoute,
  BookingRoute,
  ShellPropertyRoute,
  PaymentRoutes,
  VirtualTourRoute,
  InqueryRoutes,
  CustomersReviews,
  PublicRoutes,
  AgentCallSupport,
  agentDashboardRoute,
  HomeLoans,

} from "./RouteConfig";

const AllRoutes = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;

  return (
    <Routes>

      {PublicRoutes()}

      {/* TEST ROUTE - FOR DEBUGGING */}
      <Route path="/test" element={<div className="flex justify-center bg-red-200">Test route</div>} />

      {/* PROTECTED ROUTES */}
      {user && (
        <>
          {/* ADMIN ROUTES - Hardcoded role */}
          {role === "admin" && AdminRoutes()}
          
          {/* DYNAMIC ROLE ROUTES - All non-admin, non-user roles */}
          {role && role !== "admin" && role !== "user" && (
            
            <>
              {agentDashboardRoute()}
              {AgentRoutes()}
              {ProfileRoutes()}
              {PropertyRoutes()}
              {BlogRoute()}
              {SessionRoute()}
              {AppoinmentRoute()}
              {BookingRoute()}
              {ShellPropertyRoute()}
              {PaymentRoutes()}
              {VirtualTourRoute()}
              {InqueryRoutes()}
              {CustomersReviews()}
              {AgentCallSupport()}
              {HomeLoans()}


            </>
          )}


        </>
      )}


    </Routes>
  );
};

export default AllRoutes;