import { useEffect, useState, useCallback } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { useToast } from "../model/SuccessToasNotification";

const useGetRole = (page, limit, filters) => {
  const [roles, setRoles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rolesPermissionData, setRolesPermissionData] = useState([]);
  const { addToast } = useToast();
  const [permissions, setPermissions] = useState({ permissions: [], roleName: null, roleId: null });
  const [allRoles, setAllRoles] = useState([]); // For dropdown

  const debouncedFilters = useDebounce(filters, 200);

  // Fetch all roles (for dropdown/selection)
  const fetchAllRoles = useCallback(async () => {
    try {
      const response = await http.get("/all-roles", { 
        withCredentials: true
      });
      if (response.data?.success === true) {
        setAllRoles(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching all roles:", error);
    }
  }, []);

  // Create Role
  const createRole = async (data) => {
    try {
      const res = await http.post("/create-role", data, { 
        withCredentials: true
      });
      if (res.data.success === true) {
        addToast(res.data.message || "Role created successfully", "success");
        await fetchRoles();
        await fetchAllRoles();
      }
    } catch (error) {
      addToast(error.response?.data?.message || error.message || "Error creating role", "error");
    }
  };

  // Fetch Roles (with pagination)
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v !== "")
      );

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters,
      });

      const response = await http.get(`/roles?${query}`, { 
        withCredentials: true
      });

      setRoles(response.data.data || []);
      setPagination(response.data.pagination || {});
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedFilters]);

  useEffect(() => {
    fetchRoles();
    fetchAllRoles();
  }, [fetchRoles, fetchAllRoles]);

  // Update Role
  const updateRole = async (id, roleName, description) => {
    try {
      const response = await http.put(`/update-role/${id}`, { roleName, description }, {
        withCredentials: true
      });
      if (response.data.success === true) {
        addToast("Role Updated Successfully", "success");
        await fetchRoles();
        await fetchAllRoles();
      } else {
        addToast("Failed to update role", "error");
      }
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || "Error Updating Role", "error");
    }
  };

  // Delete Role
  const deleteRole = async (id) => {
    try {
      const response = await http.delete(`/delete-role/${id}`, {
        withCredentials: true
      });
      if (response.data.success === true) {
        await fetchRoles();
        await fetchAllRoles();
        addToast(response.data.message || "Role deleted successfully", "success");
      }
    } catch (err) {
      addToast(err.response?.data?.message || err.message || "Error deleting role", "error");
    }
  };

  // Fetch Role Permission Data (legacy)
  const fetchRolePermissionData = useCallback(async () => {
    try {
      const res = await http.get("/get-permission-role", { 
        withCredentials: true
      });
      if (res.data?.success === true) {
        setRolesPermissionData(res.data.data);
      }
    } catch (error) {
      console.log("Internal server error", error);
    }
  }, []);

  // Create Permission
  const createPermission = async (roleId, permissionName) => {
    try {
      const payload = { roleId, permissionName };
      const res = await http.post("/create-role-permission", payload, {
        withCredentials: true
      });
      if (res.data.success === true) {
        addToast(res.data.message || "Permission created successfully", "success");
        await fetchPermissions(roleId);
      }
    } catch (error) {
      addToast(error.response?.data?.message || error.message || "Error creating permission", "error");
    }
  };

  // Fetch Permissions by Role
  const fetchPermissions = useCallback(async (roleId, roleName) => {
    try {
      const params = {};
      if (roleId) params.roleId = roleId;
      if (roleName) params.roleName = roleName;

      const response = await http.get('/role-permissions', {
        params,
        withCredentials: true
      });

      if (response.data?.success === true) {
        const roleData = response.data.data?.[0] || {};
        const result = {
          roleId: roleData._id || roleId,
          roleName: roleData.roleName || roleName || null,
          permissions: (roleData.permissions || [])
            .map(perm => ({
              id: perm?._id,
              name: perm?.permissionName
            }))
            .filter(perm => perm.id && perm.name)
        };
        setPermissions(result);
        return result;
      }
      return { roleId: null, roleName: null, permissions: [] };
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return { roleId: null, roleName: null, permissions: [] };
    }
  }, []);

  // Delete Permission
  const deletePermission = async (id) => {
    try {
      const res = await http.delete(`/delete-role-permission/${id}`, {
        withCredentials: true
      });
      if (res.data.success === true) {
        addToast(res.data.message || "Permission removed successfully", "success");
        // Refresh permissions for current role
        if (permissions.roleId) {
          await fetchPermissions(permissions.roleId);
        }
      }
    } catch (error) {
      addToast(error.response?.data?.message || error.message || "Error deleting permission", "error");
    }
  };

  // Assign role to agent
  const assignRoleToAgent = async (agentId, roleId) => {
    try {
      const response = await http.post("/assign-role-to-agent", { agentId, roleId }, {
        withCredentials: true
      });
      if (response.data.success === true) {
        addToast(response.data.message || "Role assigned successfully", "success");
        return true;
      }
      return false;
    } catch (error) {
      addToast(error.response?.data?.message || error.message || "Error assigning role", "error");
      return false;
    }
  };

  // Get agents with their roles
  const getAgentsWithRoles = useCallback(async () => {
    try {
      const response = await http.get("/agents-with-roles", { 
        withCredentials: true 
      });
      if (response.data.success === true) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error fetching agents with roles:", error);
      return [];
    }
  }, []);

  // Get current user's permissions (for sidebar)
  const getUserPermissions = useCallback(async () => {
    try {
      const response = await http.get("/my-permissions", { 
        withCredentials: true 
      });
      if (response.data.success === true) {
        return {
          permissions: response.data.permissions || [],
          role: response.data.role,
          isAdmin: response.data.isAdmin || false
        };
      }
      return { permissions: [], role: null, isAdmin: false };
    } catch (error) {
      console.error("Error fetching user permissions:", error);
      return { permissions: [], role: null, isAdmin: false };
    }
  }, []);

  useEffect(() => {
    fetchRolePermissionData();
  }, [fetchRolePermissionData]);

  return {
    // Role management
    roles,
    allRoles,
    pagination,
    loading,
    error,
    createRole,
    updateRole,
    deleteRole,
    fetchRoles,
    fetchAllRoles,
    
    // Permission management
    permissions,
    rolesPermissionData,
    createPermission,
    deletePermission,
    fetchPermissions,
    setPermissions,
    
    // Agent role assignment
    assignRoleToAgent,
    getAgentsWithRoles,
    
    // User permissions
    getUserPermissions,
  };
};

export default useGetRole;