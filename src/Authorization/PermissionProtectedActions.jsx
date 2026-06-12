// components/Authorization/PermissionProtectedActions.jsx
import { useContext } from 'react';
import { PermissionContext } from '../context/PermessionContenx';

const PermissionProtectedAction = ({ 
  children, 
  action, 
  module, 
  fallback = null,
}) => {
  const { hasPermission, isLoading, permissions, userRole } = useContext(PermissionContext);
  
  // Debug in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`🔐 Permission check: ${action}:${module}`, {
      isLoading,
      userRole,
      hasPermission: hasPermission ? hasPermission(action, module) : 'N/A',
      permissionsCount: permissions?.length
    });
  }
  
  // Show nothing while loading
  if (isLoading) {
    return null;
  }
  
  // If no hasPermission function, return fallback or null
  if (!hasPermission) {
    console.warn('⚠️ hasPermission function not available in PermissionContext');
    return null;
  }
  
  // Check permission
  const hasAccess = hasPermission(action, module);
  
  return hasAccess ? children : fallback;
};

export default PermissionProtectedAction;