import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield, CheckCircle2, ChevronDown, Lock, Unlock, AlertCircle, Sparkles, Layers
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
  }, [RolesPermessionData, selectedRole]);

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
      setError("Failed to update security matrix. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedRole, permissionsSet, loading, permissions, deletePermission, createPermission, fetchPerms]);

  const handleModuleBulkToggle = async (moduleName) => {
    if (!selectedRole || loading) return;
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

  // Luxury UI Classes
  const ct = {
    bg: isDark ? 'bg-[#0B0F1A]' : 'bg-slate-50',
    card: isDark ? 'bg-slate-900/40 border-slate-800/60' : 'bg-white border-slate-100 shadow-xl',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    accent: 'text-amber-500',
    btnActive: 'bg-amber-500 text-black',
    btnInactive: isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
  };

  return (
    <div className={`min-h-screen p-6 md:p-10 transition-colors duration-700 ${ct.bg} ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-amber-500 rounded-[2.5rem] shadow-2xl shadow-amber-500/20 text-black">
              <Shield size={32} strokeWidth={2.5} />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <div className="h-[1px] w-6 bg-amber-500" />
                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em]">Vault Security</span>
                </div>
              <h1 className="text-4xl font-black tracking-tighter">PERMISSION <span className="font-serif italic font-light text-amber-600">Matrix.</span></h1>
            </div>
          </div>

          <div className="w-full md:w-80 group">
            <label className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2 block">Governance Role</label>
            <div className="relative">
              <select 
                value={selectedRole?.roleName || ''}
                onChange={(e) => setSelectedRole(RolesPermessionData.find(r => r.roleName === e.target.value))}
                className={`w-full pl-6 pr-12 py-5 rounded-[2rem] border-none shadow-2xl font-black text-[11px] uppercase tracking-widest appearance-none outline-none focus:ring-2 focus:ring-amber-500 transition-all ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}
              >
                {RolesPermessionData?.map(role => <option key={role._id} value={role.roleName}>{role.roleName}</option>)}
              </select>
              <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-amber-500" size={18} />
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex p-1.5 bg-black/20 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl w-fit mb-12 border border-white/5">
          {['Core Module', 'Dashboard'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-amber-500 shadow-xl text-black' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-8 p-5 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-3 text-rose-500 font-bold text-xs uppercase tracking-widest">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-8">
          {(activeTab === 'Dashboard' ? dashboardPermissions : Module)?.map((mod) => (
            <div 
              key={mod.id} 
              className={`group p-8 rounded-[3.5rem] border transition-all duration-500 ${ct.card} hover:scale-[1.01]`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className={`p-4 rounded-[1.5rem] transition-colors ${isDark ? 'bg-slate-800/50 text-amber-500' : 'bg-amber-50 text-amber-600'}`}>
                    {mod.icon ? <mod.icon size={28} /> : <Layers size={28} />}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{mod.name}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Resource Authority</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleModuleBulkToggle(mod.name)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all bg-slate-950 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-black"
                >
                  <Sparkles size={14} /> Global Sync
                </button>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {['create', 'view', 'update', 'delete'].map((action) => {
                  const active = checkPermission(permissionsSet, action, mod.name);
                  
                  return (
                    <button
                      key={action}
                      onClick={() => handlePermissionToggle(action, mod.name)}
                      disabled={loading}
                      className={`group relative flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all duration-300
                        ${active 
                          ? `border-amber-500/40 bg-amber-500/5 text-amber-500 shadow-lg shadow-amber-500/5` 
                          : 'border-slate-800/20 dark:border-slate-800/40 text-slate-500 hover:border-slate-700'
                        }
                      `}
                    >
                      <div className={`p-3 rounded-xl mb-3 transition-all duration-500 ${active ? `bg-amber-500 text-black rotate-[360deg]` : 'bg-slate-800/40'}`}>
                        {active ? <Lock size={16} /> : <Unlock size={16} />}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{action}</span>
                      {active && (
                        <div className="absolute top-4 right-4">
                             <CheckCircle2 size={12} className="text-amber-500" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Syncing Notification */}
      {loading && (
        <div className="fixed bottom-12 right-12 bg-amber-500 text-black px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 z-50 animate-in slide-in-from-bottom-20">
          <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syncing Matrix...</span>
        </div>
      )}
    </div>
  );
};

export default Permissions;