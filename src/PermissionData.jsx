// PermissionData.js
import { 
  BarChart3, CheckCircle2, Database, Edit, Settings, 
  Settings2, Users, PieChart, TrendingUp, Wallet, Award, Building, BookOpen, Shield, Star
} from "lucide-react";

export const Module = [
  { name: 'Team Management', icon: Users },
  { name: 'Profile Management', icon: CheckCircle2 },
  { name: 'Property Management', icon: Building },  // ✅ Must match EXACTLY "Property Management"
  { name: 'Blog Management', icon: BookOpen },      // ✅ Must match EXACTLY "Blog Management"
  { name: 'Booking Management', icon: BarChart3 },
  { name: 'Review Management', icon: Star },
  { name: 'AgentSupport Management', icon: Shield },
];

export const dashboardPermissions = [
  { name: 'total property', icon: Settings2, color: 'text-green-500' },
  { name: 'total Revenue', icon: TrendingUp, color: 'text-green-500' },
  { name: 'total sales', icon: BarChart3, color: 'text-yellow-500' },
  { name: 'total user', icon: Users, color: 'text-indigo-500' },
  { name: 'monthely Earnings', icon: Wallet, color: 'text-indigo-500' },
  { name: 'transaction history', icon: Database, color: 'text-indigo-500' },
  { name: 'Achievements', icon: Award, color: 'text-indigo-500' },
  { name: 'Revenue Breakdown', icon: PieChart, color: 'text-indigo-500' },
];