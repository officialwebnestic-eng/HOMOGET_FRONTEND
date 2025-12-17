import { color } from "framer-motion";
import { BarChart3, CheckCircle2, Database, Edit, Eye, Settings, Settings2, Shield, Sparkles, Users } from "lucide-react";

export const Module = [
  { name: 'Team Management', icon: Users, view: true, update: true, delete: true },
  { name: 'Profile Management', icon: CheckCircle2, color: 'text-teal-500', view: true, update: true, delete: true },
  { name: 'CustomerSupport Management', icon: Edit, view: true, update: true, delete: true },
  { name: 'Property Management', icon: Database, view: true, update: true, delete: true },
  { name: 'Blog  Management', icon: BarChart3, view: true, update: true, delete: true },
  { name: 'Session Management', icon: Database, view: true, update: true, delete: true },
  { name: 'Appoinment Management', icon: Settings, view: true, update: true, delete: true },
  { name: 'Booking Management', icon: BarChart3, view: true, update: true, delete: true },
  { name: 'Review Management', icon: BarChart3, view: true, update: true, delete: true },
  { name: "Property Shell Management", icon: BarChart3, view: true, update: true, delete: true },
  { name: 'Payment Management', icon: BarChart3, view: true, update: true, delete: true },
  { name: 'Virtual Tour Management', icon: BarChart3, view: true, update: true, delete: true },
 { name: 'AgentSupport Management', icon: BarChart3, view: true, update: true, delete: true },
  { name: 'Home Loan Management', icon: BarChart3, view: true, update: true, delete: true },


];

export const dashboardPermissions = [
  { name: 'total property', icon: <Settings2 />, color: 'text-green-500' },
  { name: 'total Revenue', icon: <Settings2 />, color: 'text-green-500' },
  { name: 'total sales', icon: <Settings2 />, color: 'text-yellow-500' },
  { name: 'total user', icon: <Settings2 />, color: 'text-indigo-500' },
  { name: 'monthely Earnings', icon: <Settings2 />, color: 'text-indigo-500' },
  { name: 'transaction history', icon: <Settings2 />, color: 'text-indigo-500' },
  { name: 'Achievements', icon: <Settings2 />, color: 'text-indigo-500' },
  { name: 'Revenue Breakdown ', icon: <Settings2 />, color: 'text-indigo-500' },
];







