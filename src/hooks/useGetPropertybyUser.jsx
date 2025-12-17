import { useEffect, useState, useCallback } from "react";
import { http } from "../axios/axios";
import { useToast } from "../model/SuccessToasNotification";
import useDebounce from "./useDebounce";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const userGetPropertyByUser = (page, limit, filters = {}) => {
  const [propertyList, setPropertyList] = useState([]);
  const { addToast } = useToast()
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    results: 0,
  });

  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => v !== "")
      );

      const query = new URLSearchParams({
        page: page?.toString() || "1",
        limit: limit?.toString() || "10",
        ...cleanedFilters,
      });

      const response = await http.get(`/getdatabyuserid?${query}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const res = response.data;

      setPropertyList(res.data || []);
      setPagination({
        currentPage: res.currentPage || 1,
        totalPages: res.totalPages || 1,
        totalResults: res.totalResults || 0,
        results: res.results || 0,
      });
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
        withCredentials: true
      });

      if (response.data.success) {
        addToast(response.data.message, "success");
        fetchProperty(); // Refresh after deletion
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
