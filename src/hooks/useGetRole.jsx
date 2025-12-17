import { useEffect, useState } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { useToast } from "../model/SuccessToasNotification";

const useGetRole = (page, limit, filters) => {
  const [Roles, setRole] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [RolesPermessionData, setRolesPermissionData] = useState([]);
  const { addToast } = useToast();
  const [permissions, setPermissions] = useState(new Map());

  const debouncedFilters = useDebounce(filters, 200);
  // create Role
  const createRole = async (data) => {
    try {
      const res = await http.post("/createrole", data, { withCredentials: true });
      if (res.data.success === true) {
        await fetchRole(); // ✅ works now
        addToast(res.data.message || "Role created successfully", "success");
      }
    } catch (error) {
      addToast(error.message || "Error creating role", "error");
    }
  };

  // fetch Role
  const fetchRole = async () => {
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

      const response = await http.get(`/getrole?${query}`, {
        withCredentials: true,
      });

      setRole(response.data.data || []);
      setPagination(response.data.pagination || {});
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [page, limit, debouncedFilters]);



  const updateRole = async (id, roleName) => {
    try {
      const response = await http.put(`/updaterole/${id}`, { roleName }, {
        withCredentials: true,
      });
      if (response.data.success === true) {
        addToast("Role Updated Successfully", "success");
        fetchRole()
      } else {
        // Handle case where success is false or not provided
        addToast("Failed to update role", "error");
      }
    } catch (error) {
      console.error(error);
      addToast("Error Updating Role", "error");
    }
  };
  //  deleteRole
  const deleteRole = async (id) => {
    try {
      const response = await http.delete(`/deleterole/${id}`, {
        withCredentials: true,
      });
      if (response.data.success === true) {
        await fetchRole(); // ✅ works now
        addToast(response.data.message || "Role deleted successfully", "success");
      }
    } catch (err) {
      addToast(err.message || "Error deleting role", "error");
    }
  };

  const fetchRolePermessionData = async () => {
    try {
      const res = await http.get("/getpermessionrole", {
        withCredentials: true,
      });
      if (res.data?.success === true) {
        setRolesPermissionData(res.data.data);
      }
    } catch (error) {
      console.log("internal server error");
    }
  };

  const createPermission = async (roleId, permissionName) => {
    try {
      const payload = { roleId, permissionName };
      const res = await http.post("/craeterolepermession", payload, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        addToast(res.data.message || "Role Permission created successfully", "success");
        await fetchPermissions(roleId);
      }
    } catch (error) {
      addToast(error.message || "Error creating permission", "error");
    }
  };

  const fetchPermissions = async (roleId, roleName) => {
    try {
      const params = {};
      if (roleId) params.roleId = roleId;
      if (roleName) params.roleName = roleName;

      const response = await http.get('/getrolepermession', {
        params,
        withCredentials: true,
      });

      if (response.data?.success === true) {
        const roleData = response.data.data?.[0] || {};
        const result = {
          adminId: roleData.adminId || null,
          roleName: roleData.roleName || null,
          _id: roleData._id,
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

      return { adminId: null, roleName: null, permissions: [] };
    } catch (error) {
      console.error("Error fetching permissions:", error);
      return { adminId: null, roleName: null, permissions: [] };
    }
  };

  const deletePermission = async (id) => {
    try {
      const res = await http.delete(`/deleterolepermession/${id}`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        addToast(res.data.message || "Role Permission removed successfully", "success");
      }
    } catch (error) {
      addToast(error.message || "Error deleting permission", "error");
    }
  };

  useEffect(() => {
    fetchRolePermessionData();
  }, []);

  return {
    deletePermission,
    Roles,
    createPermission,
    pagination,
    RolesPermessionData,
    loading,
    error,
    createRole,
    deleteRole,
    fetchPermissions,
    permissions,
    setPermissions,
    updateRole
  };
};

export default useGetRole;
