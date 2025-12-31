import { 
  BarChart3, CheckCircle2, Database, Edit, Settings, 
  Settings2, Users, PieChart, TrendingUp, Wallet, Award 
} from "lucide-react";

export const Module = [
  { name: 'Team Management', icon: Users, view: true, update: true, delete: true },
  { name: 'Profile Management', icon: CheckCircle2, view: true, update: true, delete: true },
  { name: 'CustomerSupport Management', icon: Edit, view: true, update: true, delete: true },
  { name: 'Property Management', icon: Database, view: true, update: true, delete: true },
  { name: 'Blog Management', icon: BarChart3, view: true, update: true, delete: true },
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
  // FIXED: Removed < /> brackets to pass the component reference, not the element
  { name: 'total property', icon: Settings2, color: 'text-green-500' },
  { name: 'total Revenue', icon: TrendingUp, color: 'text-green-500' },
  { name: 'total sales', icon: BarChart3, color: 'text-yellow-500' },
  { name: 'total user', icon: Users, color: 'text-indigo-500' },
  { name: 'monthely Earnings', icon: Wallet, color: 'text-indigo-500' },
  { name: 'transaction history', icon: Database, color: 'text-indigo-500' },
  { name: 'Achievements', icon: Award, color: 'text-indigo-500' },
  { name: 'Revenue Breakdown', icon: PieChart, color: 'text-indigo-500' },
];