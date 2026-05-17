import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useCallback,
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
  const abortControllerRef = useRef(null);

  // Load permissions from API
  const loadPermissions = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    try {
      if (!user?.role) {
        setPermission([]);
        return;
      }

      // Admin has all permissions – no need to call API
      if (user.role === "admin") {
        setPermission([{ name: "*" }]); // wildcard
        return;
      }

      const response = await http.get("/getrolepermession", {
        params: { roleName: user.role },
        withCredentials: true,
        signal: abortControllerRef.current.signal,
      });

      if (response.data?.success === true) {
        const roleData = response.data.data?.[0] || {};
        const permissionsArray = (roleData.permissions || [])
          .map((perm) => ({
            id: perm?._id,
            name: perm?.permissionName,
          }))
          .filter((perm) => perm.id && perm.name);
        setPermission(permissionsArray);
      } else {
        setPermission([]);
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Permission fetch error:", err);
      }
      setPermission([]);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [user?.role]);

  // Reload when user role changes (login, logout, role switch)
  useEffect(() => {
    loadPermissions();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadPermissions]);

  // Helper to force a reload (e.g., after role permissions are updated)
  const removePermissions = async () => {
    await loadPermissions();
  };

  // Permission check: admin always true, otherwise check array
  const hasPermission = useCallback(
    (action, module) => {
      if (user?.role === "admin") return true;
      if (!permission || permission.length === 0) return false;
      // Special case: if you stored a wildcard "*", treat as true
      if (permission.some((p) => p.name === "*")) return true;
      return permission.some((perm) => perm.name === `${action}:${module}`);
    },
    [permission, user?.role]
  );

  const value = useMemo(
    () => ({
      hasPermission,
      removePermissions,
      isLoading,
    }),
    [hasPermission, isLoading]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};