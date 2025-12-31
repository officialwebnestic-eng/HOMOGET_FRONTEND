import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield, CheckCircle2, ChevronDown, Lock, Unlock, AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import useGetRole from '../hooks/useGetRole';
import { Module, dashboardPermissions } from '../PermissionData';

// Optimized permission check using a Set for O(1) lookups
const checkPermission = (permissionsSet, action, moduleName) => {
  return permissionsSet.has(`${action}:${moduleName}`);
};

const Permissions = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    RolesPermessionData,
    permissions,
    createPermission,
    deletePermission,
    fetchPermissions: fetchPerms,
  } = useGetRole();

  const [selectedRole, setSelectedRole] = useState(null);
  const [activeTab, setActiveTab] = useState('Core Module');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoize permissions into a Set for performance
  const permissionsSet = useMemo(() => {
    const list = permissions?.permissions || [];
    return new Set(list.map(p => p.name));
  }, [permissions]);

  useEffect(() => {
    if (RolesPermessionData?.length && !selectedRole) {
      setSelectedRole(RolesPermessionData[0]);
    }
  }, [RolesPermessionData]);

  useEffect(() => {
    if (selectedRole) {
      fetchPerms(selectedRole._id);
    }
  }, [selectedRole, activeTab, fetchPerms]);

  const handlePermissionToggle = useCallback(async (action, moduleName) => {
    if (!selectedRole || loading) return;

    const permissionKey = `${action}:${moduleName}`;
    const isActive = checkPermission(permissionsSet, action, moduleName);

    try {
      setLoading(true);
      setError(null);
      if (isActive) {
        const perm = permissions.permissions.find(p => p.name === permissionKey);
        if (perm) await deletePermission(perm.id);
      } else {
        await createPermission(selectedRole._id, permissionKey);
      }
      await fetchPerms(selectedRole._id);
    } catch (err) {
      setError("Failed to update permission. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, permissionsSet, loading, permissions, deletePermission, createPermission, fetchPerms]);

  // Bulk toggle for a specific module
  const handleModuleBulkToggle = async (moduleName, currentActions) => {
    const actions = ['view', 'create', 'update', 'delete'];
    const allActive = actions.every(a => checkPermission(permissionsSet, a, moduleName));
    
    setLoading(true);
    try {
      for (const action of actions) {
        const isActive = checkPermission(permissionsSet, action, moduleName);
        if (allActive && isActive) {
            const perm = permissions.permissions.find(p => p.name === `${action}:${moduleName}`);
            await deletePermission(perm.id);
        } else if (!allActive && !isActive) {
            await createPermission(selectedRole._id, `${action}:${moduleName}`);
        }
      }
      await fetchPerms(selectedRole._id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Top Branding & Selection */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-600 rounded-[2rem] shadow-xl shadow-indigo-500/20 text-white">
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Security Matrix</h1>
              <p className="text-slate-500 font-medium">Fine-tune access levels for {selectedRole?.roleName || 'roles'}</p>
            </div>
          </div>

          <div className="w-full md:w-72">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 block">Active Identity Role</label>
            <div className="relative">
              <select 
                value={selectedRole?.roleName || ''}
                onChange={(e) => setSelectedRole(RolesPermessionData.find(r => r.roleName === e.target.value))}
                className={`w-full pl-5 pr-12 py-4 rounded-2xl border-none shadow-lg font-bold appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
              >
                {RolesPermessionData?.map(role => <option key={role._id} value={role.roleName}>{role.roleName}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1.5 bg-slate-200/50 dark:bg-slate-900 rounded-2xl w-fit mb-10">
          {['Core Module', 'Dashboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-800 shadow-md text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 font-bold text-sm animate-in fade-in slide-in-from-top-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Permission Grid */}
        <div className="grid grid-cols-1 gap-6">
          {(activeTab === 'Dashboard' ? dashboardPermissions : Module)?.map((mod) => (
            <div 
              key={mod.id} 
              className={`group p-6 rounded-[2.5rem] border transition-all hover:shadow-2xl ${isDark ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-100'}`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                    {mod.icon && <mod.icon size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{mod.name}</h3>
                    <p className="text-xs text-slate-500 font-medium">Control actions for this resource</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleModuleBulkToggle(mod.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <Unlock size={14} /> Bulk Toggle
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['create', 'view', 'update', 'delete'].map((action) => {
                  const active = checkPermission(permissionsSet, action, mod.name);
                  const colors = {
                    create: 'emerald', view: 'blue', update: 'amber', delete: 'rose'
                  }[action];

                  return (
                    <button
                      key={action}
                      onClick={() => handlePermissionToggle(action, mod.name)}
                      disabled={loading}
                      className={`relative flex flex-col items-center justify-center p-5 rounded-3xl border-2 transition-all overflow-hidden
                        ${active 
                          ? `border-${colors}-500/50 bg-${colors}-500/5 text-${colors}-500` 
                          : 'border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                        }
                      `}
                    >
                      <div className={`p-2 rounded-lg mb-2 ${active ? `bg-${colors}-500 text-white` : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {active ? <Lock size={16} /> : <Unlock size={16} />}
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest">{action}</span>
                      {active && <div className={`absolute bottom-0 left-0 h-1 bg-${colors}-500 w-full`} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Persistence Loading Indicator */}
      {loading && (
        <div className="fixed bottom-10 right-10 bg-indigo-600 text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-10">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-black uppercase tracking-widest">Syncing Matrix...</span>
        </div>
      )}
    </div>
  );
};

export default Permissions;