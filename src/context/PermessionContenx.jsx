// context/PermessionContenx.jsx
import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { http } from '../axios/axios';
import { AuthContext } from './AuthContext';

export const PermissionContext = createContext();

export const PermissionProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

  const fetchPermissions = useCallback(async () => {
    if (authLoading) {
      console.log("⏳ Waiting for auth to complete...");
      return;
    }
    
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, setting empty permissions");
      setIsLoading(false);
      setPermissions([]);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // ✅ REMOVE the token check - cookies are sent automatically
      console.log("📡 Fetching permissions with cookie...");
      const response = await http.get('/my-permissions', { 
        withCredentials: true  // Cookie is sent automatically
      });
      
      console.log("📥 Permissions response:", response.data);
      
      if (response.data.success) {
        setPermissions(response.data.permissions || []);
        setUserRole(response.data.role);
        setIsAdmin(response.data.isAdmin || response.data.role?.toLowerCase() === 'admin');
        console.log("✅ Permissions loaded:", response.data.permissions?.length);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch permissions:', error);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchPermissions();
    } else if (!authLoading && !isAuthenticated) {
      setIsLoading(false);
      setPermissions([]);
    }
  }, [fetchPermissions, authLoading, isAuthenticated]);

  const hasPermission = useCallback((action, moduleName) => {
    // Admin has all permissions
    if (isAdmin || userRole === 'admin') {
      return true;
    }
    
    // Check if permissions array exists
    if (!permissions || permissions.length === 0) {
      return false;
    }
    
    const permissionKey = `${action}:${moduleName}`;
    const hasAccess = permissions.includes(permissionKey);
    
    // Debug log for Property Management
    if (moduleName === 'Property Management') {
      console.log(`🔍 Checking ${permissionKey}: ${hasAccess ? '✅ EXISTS' : '❌ MISSING'}`);
    }
    
    return hasAccess;
  }, [permissions, isAdmin, userRole]);

  const hasAnyPermission = useCallback((permissionList) => {
    if (isAdmin || userRole === 'admin') return true;
    if (!permissions.length) return false;
    
    return permissionList.some(({ action, module }) => 
      permissions.includes(`${action}:${module}`)
    );
  }, [permissions, isAdmin, userRole]);

  const refreshPermissions = useCallback(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <PermissionContext.Provider value={{
      permissions,
      hasPermission,
      hasAnyPermission,
      isLoading: isLoading || authLoading,
      userRole,
      isAdmin,
      refreshPermissions
    }}>
      {children}
    </PermissionContext.Provider>
  );
};