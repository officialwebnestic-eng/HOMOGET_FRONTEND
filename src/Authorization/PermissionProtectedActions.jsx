import { useContext } from 'react';
import { PermissionContext } from '../context/PermessionContenx';


const PermissionProtectedAction = ({ 
  children, 
  action, 
  module, 
  fallback = null, 
 
}) => {
  const { hasPermission } = useContext(PermissionContext);
  
  return hasPermission(action, module) ? children : fallback;
};

export default PermissionProtectedAction;