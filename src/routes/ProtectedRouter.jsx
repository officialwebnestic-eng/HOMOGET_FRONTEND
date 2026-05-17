
;
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PermissionContext } from "../context/PermessionContenx";
import { AuthContext } from "../context/AuthContext";

const ProtectRoutes = ({ restrictedTo, action, module }) => {
    const { user } = useContext(AuthContext);
    const { hasPermission, isLoading } = useContext(PermissionContext);

     console.log(hasPermission)

    if (isLoading) {
        return  <>...loading</>;
    }

    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // Check permission if action and module are provided
    if (action && module && !hasPermission(action, module)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Check role restriction
    if (restrictedTo && user?.role === restrictedTo) {
        return <Navigate to="/unauthorized" replace />;
    }
    
    return <Outlet />;
};

export default ProtectRoutes;