import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthContext } from "./AuthContext";
import { http } from "../axios/axios"; 

export const PermissionContext = createContext({
  hasPermission: () => false,
  removePermissions: async () => {},
  isLoading: true,
});

export const PermissionProvider = ({ children }) => {
  const { user } = useContext(AuthContext);


  const [permission, setPermission] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  console.log("Initial permission state:", permission);


  const loadPermissions = async () => {
    console.log("Calling loadPermissions...");
    if (!user?.role) {
      setPermission([]);
      setIsLoading(false);
      console.log("No user role, permissions cleared");
      return;
    }

    try {

      const response = await http.get('/getrolepermession', {
        params: { roleName: user.role }, 
        withCredentials: true,
      });

      if (response.data?.success === true) {
        const roleData = response.data.data?.[0] || {};
        const permissionsArray = (roleData.permissions || [])
          .map(perm => ({
            id: perm?._id,
            name: perm?.permissionName,
          }))
          .filter(perm => perm.id && perm.name);

        console.log("Processed permissions:", permissionsArray);
        setPermission(permissionsArray);
      } else {

        setPermission([]);
      }
    } catch (err) {
      console.error("Permission fetch error:", err);
      setPermission([]);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    console.log("useEffect fired. user?.role:", user?.role);
    if (user?.role) {
      setIsLoading(true);
      loadPermissions();
    } else {

      setPermission([]);
    }
  }, [user?.role]);




  const removePermissions = async () => {
    sessionStorage.removeItem("permissions");

    await loadPermissions();
  };


  const hasPermission = (action, module) => {
    if (user?.role === "admin") return true;
    if (!permission || permission.length === 0) return false;
    return permission.some((perm) => perm.name === `${action}:${module}`);
  };


  const value = useMemo(
    () => ({
      hasPermission,
      removePermissions,
      isLoading,
    }),
    [permission, user?.role, isLoading]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};