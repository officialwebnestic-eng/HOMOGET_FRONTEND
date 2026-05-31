import { useEffect, useState, useCallback } from "react";
import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";
import useDebounce from "./useDebounce";

const userGetPropertyByUser = (page = 1, limit = 10, filters = {}) => {
  const [propertyList, setPropertyList] = useState([]);
  const { addToast } = useToast();
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Clean empty filters
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      // Build query string
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters,
      });

      // 🔁 Replace with your actual backend endpoint
      const endpoint = `/getpropertybyuser?${queryParams}`;

      const response = await http.get(endpoint, { withCredentials: true });

      const { data, pagination: paginationData, success, message } = response.data;

      if (success) {
        setPropertyList(data || []);
        setPagination({
          total: paginationData?.total || 0,
          page: paginationData?.page || page,
          limit: paginationData?.limit || limit,
          totalPages: paginationData?.totalPages || 1,
        });
      } else {
        setError(message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error("fetchProperty error:", err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedFilters]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const deletePropertyById = async (id) => {
    try {
      const response = await http.delete(`/deleteproperty/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        addToast(response.data.message, "success");
        fetchProperty(); // Refresh list after deletion
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.response?.data?.message || "Failed to delete property");
    }
  };

  return {
    propertyList,
    pagination,
    loading,
    error,
    deletePropertyById,
    refetch: fetchProperty,
  };
};

export default userGetPropertyByUser;