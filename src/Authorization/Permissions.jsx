// Permissions.jsx - Complete working version
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Shield, CheckCircle2, ChevronDown, Lock, Unlock, AlertCircle, Sparkles, Layers,
  Eye, Edit, Trash2, Plus, RefreshCw, UserCog, Globe, Building, Home, Settings,
  Users, BookOpen, Star, BarChart3
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useGetRole from '../hooks/useGetRole';
import { Module, dashboardPermissions } from '../PermissionData';
import { http } from '../axios/axios';

const Permissions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    allRoles,
    permissions: rolePermissions, // Rename to avoid confusion
    createPermission,
    deletePermission,
    fetchPermissions: fetchPerms,
    loading,
  } = useGetRole();

  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Core Module');
  const [loadingPermissions, setLoadingPermissions] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [directPermissions, setDirectPermissions] = useState([]); // Store permissions directly
  
  const abortControllerRef = useRef(null);
  const prevRoleIdRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Fetch permissions directly - bypass the hook's structure
  const fetchDirectPermissions = useCallback(async (roleId) => {
    if (!roleId) return;
    
    try {
      setLoadingPermissions(true);
      const response = await http.get('/role-permissions', {
        params: { roleId },
        withCredentials: true
      });
      
      console.log("📥 Direct permissions response:", response.data);
      
      if (response.data?.success && response.data.data) {
        const permissionsList = response.data.data.map(p => p.permissionName);
        setDirectPermissions(permissionsList);
        console.log("✅ Direct permissions loaded:", permissionsList);
      }
    } catch (err) {
      console.error("Failed to fetch permissions:", err);
      setError("Failed to load permissions");
    } finally {
      setLoadingPermissions(false);
    }
  }, []);

  // Set initial role only once
  useEffect(() => {
    if (!isInitialized && allRoles?.length > 0 && !selectedRole) {
      setSelectedRole(allRoles[0]);
      setIsInitialized(true);
    }
  }, [allRoles, selectedRole, isInitialized]);

  // Fetch permissions when role changes
  useEffect(() => {
    if (selectedRole?._id) {
      fetchDirectPermissions(selectedRole._id);
    }
  }, [selectedRole?._id, fetchDirectPermissions]);

  // Memoize permissions into a Set for quick lookup
  const permissionsSet = useMemo(() => {
    return new Set(directPermissions);
  }, [directPermissions]);

  const showToast = useCallback((message, type = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ message, type });
    toastTimeoutRef.current = setTimeout(() => setToast(null), 2000);
  }, []);

  const checkPermission = useCallback((action, moduleName) => {
    const permissionKey = `${action}:${moduleName}`;
    const hasPermission = permissionsSet.has(permissionKey);
    
    // Debug for Property Management
    if (moduleName === 'Property Management') {
      console.log(`🔍 Checking ${permissionKey}: ${hasPermission ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    return hasPermission;
  }, [permissionsSet]);

  const handlePermissionToggle = useCallback(async (action, moduleName) => {
    if (!selectedRole || loadingPermissions) return;

    const permissionKey = `${action}:${moduleName}`;
    const isActive = checkPermission(action, moduleName);

    console.log(`🔄 Toggling: ${permissionKey}, currently: ${isActive ? 'ACTIVE' : 'INACTIVE'}`);

    try {
      setLoadingPermissions(true);
      setError(null);
      
      if (isActive) {
        // Find the permission to delete - need to get the ID first
        const response = await http.get('/role-permissions', {
          params: { roleId: selectedRole._id },
          withCredentials: true
        });
        
        const perm = response.data?.data?.find(p => p.permissionName === permissionKey);
        if (perm) {
          await deletePermission(perm._id);
          showToast(`✅ Removed ${action} permission for ${moduleName}`, 'success');
        }
      } else {
        // Create new permission
        await createPermission(selectedRole._id, permissionKey);
        showToast(`✅ Added ${action} permission for ${moduleName}`, 'success');
      }
      
      // Refresh permissions
      await fetchDirectPermissions(selectedRole._id);
    } catch (err) {
      console.error("Permission update error:", err);
      setError("Failed to update permission");
      showToast("❌ Failed to update permission", 'error');
    } finally {
      setLoadingPermissions(false);
    }
  }, [selectedRole, loadingPermissions, checkPermission, deletePermission, createPermission, fetchDirectPermissions, showToast]);

  const handleModuleBulkToggle = useCallback(async (moduleName) => {
    if (!selectedRole || loadingPermissions) return;
    
    const actions = ['view', 'create', 'update', 'delete'];
    const allActive = actions.every(a => checkPermission(a, moduleName));
    
    setLoadingPermissions(true);
    try {
      // Get current permissions to find IDs
      const response = await http.get('/role-permissions', {
        params: { roleId: selectedRole._id },
        withCredentials: true
      });
      
      const currentPerms = response.data?.data || [];
      
      for (const action of actions) {
        const isActive = checkPermission(action, moduleName);
        const permissionKey = `${action}:${moduleName}`;
        
        if (allActive && isActive) {
          // Remove permission
          const perm = currentPerms.find(p => p.permissionName === permissionKey);
          if (perm) {
            await deletePermission(perm._id);
          }
        } else if (!allActive && !isActive) {
          // Add permission
          await createPermission(selectedRole._id, permissionKey);
        }
      }
      
      await fetchDirectPermissions(selectedRole._id);
      showToast(allActive ? `🔓 Revoked all permissions for ${moduleName}` : `🔒 Granted all permissions for ${moduleName}`, 'success');
    } catch (err) {
      console.error("Bulk toggle error:", err);
      setError("Failed to update module permissions");
      showToast("❌ Failed to update permissions", 'error');
    } finally {
      setLoadingPermissions(false);
    }
  }, [selectedRole, loadingPermissions, checkPermission, deletePermission, createPermission, fetchDirectPermissions, showToast]);

  const handleRoleChange = useCallback((e) => {
    const newRole = allRoles?.find(r => r.roleName === e.target.value);
    if (newRole && newRole._id !== selectedRole?._id) {
      setSelectedRole(newRole);
      setError(null);
      setDirectPermissions([]); // Clear while loading
    }
  }, [allRoles, selectedRole]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const getModuleIcon = useCallback((moduleName) => {
    const icons = {
      'Team Management': Users,
      'Profile Management': CheckCircle2,
      'Property Management': Building,
      'Blog Management': BookOpen,
      'Booking Management': BarChart3,
      'Review Management': Star,
      'AgentSupport Management': Shield,
      'User': UserCog,
      'Agent': Home,
      'Dashboard': Globe,
      'Settings': Settings,
    };
    const Icon = icons[moduleName] || Layers;
    return <Icon size={22} />;
  }, []);

  const getActionIcon = useCallback((action) => {
    switch(action) {
      case 'view': return <Eye size={14} />;
      case 'create': return <Plus size={14} />;
      case 'update': return <Edit size={14} />;
      case 'delete': return <Trash2 size={14} />;
      default: return <Lock size={14} />;
    }
  }, []);

  const themeClasses = useMemo(() => ({
    bg: isDark ? 'bg-[#0A0A0A]' : 'bg-gray-50',
    card: isDark ? 'bg-[#111111] border-gray-800' : 'bg-white border-gray-200',
    text: isDark ? 'text-gray-200' : 'text-gray-800',
    textMuted: isDark ? 'text-gray-500' : 'text-gray-400',
    border: isDark ? 'border-gray-800' : 'border-gray-200',
  }), [isDark]);

  if (loading && allRoles.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className={`text-sm ${themeClasses.textMuted}`}>Loading roles...</p>
        </div>
      </div>
    );
  }

  if (!loading && allRoles.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.bg}`}>
        <div className="text-center p-8">
          <Shield size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className={`text-xl font-bold ${themeClasses.text} mb-2`}>No Roles Found</h2>
          <p className={`text-sm ${themeClasses.textMuted} mb-4`}>
            Please create a role first to manage permissions.
          </p>
          <button
            onClick={() => window.location.href = '/roles'}
            className="px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-medium"
          >
            Go to Roles
          </button>
        </div>
      </div>
    );
  }

  // Add index to modules if they don't have id
  const modulesWithId = Module.map((mod, index) => ({
    ...mod,
    id: mod.id || index + 1
  }));

  return (
    <div className={`min-h-screen ${themeClasses.bg} transition-colors duration-300`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`px-5 py-3 text-xs font-medium flex items-center gap-2 shadow-lg ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500">
              <Shield size={24} className="text-black" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${themeClasses.text}`}>
                Permission Management
              </h1>
              <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
                Control access rights for different roles
              </p>
            </div>
          </div>

          {/* Role Selector */}
          <div className="w-full lg:w-80">
            <label className={`text-[10px] font-semibold uppercase tracking-wider ${themeClasses.textMuted} block mb-2`}>
              Select Role
            </label>
            <div className="relative">
              <select
                value={selectedRole?.roleName || ''}
                onChange={handleRoleChange}
                className={`w-full px-4 py-3 text-sm font-medium appearance-none cursor-pointer border ${themeClasses.border} ${themeClasses.card} ${themeClasses.text} focus:outline-none focus:border-amber-500 transition-colors`}
              >
                {allRoles.map(role => (
                  <option key={role._id} value={role.roleName}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-gray-800">
          {['Core Module', 'Dashboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-amber-500 text-amber-500'
                  : `${themeClasses.textMuted} hover:text-gray-600 dark:hover:text-gray-300`
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Loading State for Permissions */}
        {loadingPermissions && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <RefreshCw size={24} className="text-amber-500 animate-spin" />
              <p className={`text-xs ${themeClasses.textMuted}`}>Loading permissions...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loadingPermissions && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle size={16} className="text-red-500" />
            <span className="text-xs text-red-500">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-xs text-red-500 hover:text-red-600"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Permissions Grid */}
        {!loadingPermissions && selectedRole && (
          <div className="space-y-4">
            {(activeTab === 'Dashboard' ? dashboardPermissions : modulesWithId)?.map((mod, idx) => {
              const actions = ['view', 'create', 'update', 'delete'];
              const allActive = actions.every(a => checkPermission(a, mod.name));
              
              // Debug for Property Management
              if (mod.name === 'Property Management') {
                console.log(`📦 Module: ${mod.name} - All Active: ${allActive}`);
                console.log(`📦 Direct permissions:`, directPermissions);
              }
              
              return (
                <div key={mod.id || idx} className={`border ${themeClasses.border} ${themeClasses.card} overflow-hidden transition-all ${
                  allActive ? 'shadow-md' : ''
                }`}>
                  {/* Module Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-5 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-all ${allActive ? 'bg-amber-500/20 text-amber-500' : 'bg-gray-200 dark:bg-gray-800 text-gray-500'}`}>
                        {getModuleIcon(mod.name)}
                      </div>
                      <div>
                        <h3 className={`font-semibold text-base ${themeClasses.text}`}>
                          {mod.name}
                        </h3>
                        <p className={`text-[10px] ${themeClasses.textMuted} mt-0.5`}>
                          {allActive ? 'All permissions granted' : 'Some permissions restricted'}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleModuleBulkToggle(mod.name)}
                      disabled={loadingPermissions}
                      className={`flex items-center gap-2 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider transition-all ${
                        allActive 
                          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20'
                          : 'bg-amber-500 text-black hover:bg-amber-600'
                      }`}
                    >
                      <Sparkles size={12} />
                      {allActive ? 'Revoke All' : 'Grant All'}
                    </button>
                  </div>

                  {/* Permission Actions */}
                  <div className="p-5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {actions.map((action) => {
                        const isActive = checkPermission(action, mod.name);
                        
                        return (
                          <button
                            key={action}
                            onClick={() => handlePermissionToggle(action, mod.name)}
                            disabled={loadingPermissions}
                            className={`flex items-center justify-between p-3 border transition-all cursor-pointer ${
                              isActive
                                ? 'border-amber-500 bg-amber-500/5 shadow-sm'
                                : `${themeClasses.border} hover:border-gray-400 dark:hover:border-gray-600`
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`${isActive ? 'text-amber-500' : themeClasses.textMuted}`}>
                                {getActionIcon(action)}
                              </div>
                              <span className={`text-xs font-medium uppercase tracking-wide ${
                                isActive ? 'text-amber-500' : themeClasses.text
                              }`}>
                                {action}
                              </span>
                            </div>
                            {isActive ? (
                              <Lock size={12} className="text-amber-500" />
                            ) : (
                              <Unlock size={12} className={themeClasses.textMuted} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info Footer */}
        <div className={`mt-8 pt-6 border-t ${themeClasses.border} flex justify-between items-center`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className={`text-[10px] ${themeClasses.textMuted}`}>
              Changes are applied immediately
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={10} className={themeClasses.textMuted} />
            <p className={`text-[10px] ${themeClasses.textMuted}`}>
              {selectedRole?.roleName || 'No role selected'} • {directPermissions.length} active permissions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Permissions;