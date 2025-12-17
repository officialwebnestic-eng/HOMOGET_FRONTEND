import React, { useState, useEffect } from 'react';
import {
  Shield, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useGetRole from '../hooks/useGetRole';
import { Module, dashboardPermissions } from '../PermissionData';

const hasPermission = (permissionsList, action, moduleName) => {
  if (!permissionsList || !Array.isArray(permissionsList)) return false;
  const permissionKey = `${action}:${moduleName}`;
  return permissionsList.some(perm => perm.name === permissionKey);
};

const getActionColor = (action, isActive, theme) => {
  const baseColors = {
    view: {
      active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105 ring-2 ring-blue-300',
      inactive: 'bg-white text-blue-600 border-2 border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200/50 hover:scale-[1.02]'
    },
    create: {
      active: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25 scale-105 ring-2 ring-green-300',
      inactive: 'bg-white text-green-600 border-2 border-green-200 hover:border-green-400 hover:shadow-lg hover:shadow-green-200/50 hover:scale-[1.02]'
    },
    update: {
      active: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105 ring-2 ring-orange-300',
      inactive: 'bg-white text-orange-600 border-2 border-orange-200 hover:border-orange-400 hover:shadow-lg hover:shadow-orange-200/50 hover:scale-[1.02]'
    },
    delete: {
      active: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 scale-105 ring-2 ring-red-300',
      inactive: 'bg-white text-red-600 border-2 border-red-200 hover:border-red-400 hover:shadow-lg hover:shadow-red-200/50 hover:scale-[1.02]'
    }
  };

  const colors = baseColors[action] || {
    active: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-500/25 scale-105 ring-2 ring-gray-300',
    inactive: 'bg-white text-gray-600 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02]'
  };

  return `${isActive ? colors.active : colors.inactive} transition-all duration-300 rounded-2xl px-6 py-3 font-semibold transform cursor-pointer`;
};

const Permissions = () => {
  const { theme } = useTheme();
  const {
    RolesPermessionData,
    permissions,
    createPermission,
    deletePermission,
    fetchPermissions: fetchPerms,
  } = useGetRole();

  const rolesArray = RolesPermessionData || [];
  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Core Module');
  const [currentData, setCurrentData] = useState(Module ?? []);
  const [loading, setLoading] = useState(false);

  // Initialize selected role
  useEffect(() => {
    if (rolesArray.length && !selectedRole) {
      setSelectedRole(rolesArray[0]);
    }
  }, [rolesArray]);

  // Fetch permissions when role or tab changes
  useEffect(() => {
    if (selectedRole) {
      fetchPerms(selectedRole._id);
    }
  }, [selectedRole, activeTab]);

  const handleRoleChange = (e) => {
    const roleObj = rolesArray.find(r => r.roleName === e.target.value);
    if (roleObj) setSelectedRole(roleObj);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentData(tab === 'Dashboard' ? dashboardPermissions : Module ?? []);
  };

  const handlePermissionToggle = async (action, moduleName) => {
    if (!selectedRole) return;

    const permissionKey = `${action}:${moduleName}`;
    const allPermissions = permissions?.permissions || [];
    const isActive = hasPermission(allPermissions, action, moduleName);

    try {
      setLoading(true);
      if (isActive) {
        const perm = allPermissions.find(p => p.name === permissionKey);
        if (perm) await deletePermission(perm.id);
      } else {
        await createPermission(selectedRole._id, permissionKey);
      }
      await fetchPerms(selectedRole._id);
    } catch (err) {
      console.error("Permission toggle error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!Array.isArray(currentData)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg font-medium">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-4 sm:p-8 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white' : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header & Role Selection */}
        <div className="mb-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-md opacity-30"></div>
              <div className={`relative p-3 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                <Shield className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-white'}`} />
              </div>
            </div>
            <div>
              <h1 className={`text-3xl sm:text-4xl font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' : 'bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent'}`}>
                Permission Management
              </h1>
              <p className={`text-lg mt-1 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-slate-600'}`}>
                Configure role-based access controls
              </p>
            </div>
          </div>
          
          {/* Role Dropdown */}
          <div className="mb-8">
            <label className={`block mb-3 text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              Select Role
            </label>
            <div className="relative w-full sm:w-1/2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-50"></div>
              <select
                value={selectedRole?.roleName || ''}
                onChange={handleRoleChange}
                className={`relative w-full p-4 rounded-2xl border-0 text-lg font-semibold shadow-xl appearance-none focus:ring-4 focus:outline-none transition-all duration-300 ${theme === 'dark' ? 'bg-gray-800/90 text-white backdrop-blur-sm focus:ring-blue-500/30' : 'bg-white text-gray-800 focus:ring-blue-500/30'}`}
              >
                {rolesArray.map(role => (
                  <option key={role._id} value={role.roleName}>{role.roleName}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 flex-wrap justify-center md:justify-start">
            {['Core Module', 'Dashboard'].map(tab => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/30'
                  : theme === 'dark' ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-600/30 hover:shadow-lg' : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 shadow-lg hover:shadow-xl'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-30 -z-10"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on tab */}
        <div className="space-y-6">
          {activeTab === 'Dashboard' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(dashboardPermissions ?? []).map((item) => {
                const isActive = hasPermission(
                  permissions?.permissions || [],
                  'view',
                  item.name
                );
                return (
                  <div
                    key={item.id}
                    className={`group relative p-6 rounded-3xl transition-all duration-300 cursor-pointer border transform hover:scale-105 ${theme === 'dark'
                      ? `${isActive ? 'bg-gradient-to-br from-gray-800 to-blue-900/30 border-blue-500/50 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/30' : 'bg-gray-800/50 border-gray-700 hover:border-blue-500/50 backdrop-blur-sm hover:shadow-xl'}`
                      : `${isActive ? 'bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/30' : 'bg-white border-gray-200 hover:shadow-2xl hover:shadow-slate-200'}`
                    }`}
                    onClick={() => handlePermissionToggle('view', item.name)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'bg-gradient-to-br from-blue-100 to-purple-100' : theme === 'dark' ? 'bg-gray-700 group-hover:bg-gradient-to-br group-hover:from-blue-500/20 group-hover:to-purple-500/20' : 'bg-slate-100 group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50'}`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1">{item.name}</h4>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Toggle view permission
                        </p>
                      </div>
                      {isActive && (
                        <div className="absolute top-4 right-4">
                          <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none"></div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {(currentData ?? []).map((module) => (
                <div key={module.id} className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className={`relative p-4 rounded-3xl shadow-lg group-hover:shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700/50' : 'bg-white shadow-xl'}`}>
                    <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                      {module.icon && <module.icon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />}
                      {module.name}
                    </h3>
                    <div className="flex justify-between mt-8 flex-wrap gap-4">
                      {['create', 'view', 'update', 'delete'].map((action) => {
                        const isActive = hasPermission(
                          permissions?.permissions || [],
                          action,
                          module.name
                        );
                        return (
                          <button
                            key={action}
                            onClick={() => handlePermissionToggle(action, module.name)}
                            disabled={loading}
                            className={`${getActionColor(action, isActive, theme)} disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {action.charAt(0).toUpperCase() + action.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`p-8 rounded-3xl shadow-2xl flex items-center gap-4 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>
                Updating permissions...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Permissions;