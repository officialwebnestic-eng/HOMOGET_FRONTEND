import { useEffect, useState, useCallback, useRef } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { useToast } from "../model/SuccessToasNotification";

const useGetPropertyBuyUserId = (page = 1, limit = 12, filters = {}) => {
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  
  const abortControllerRef = useRef(null);
  const isFirstRender = useRef(true);

  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperty = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    
    try {
      // Clean filters - remove empty values
      const cleanedFilters = {};
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined && value !== "all") {
          cleanedFilters[key] = value;
        }
      });
      
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters
      }).toString();

      console.log("📡 Fetching properties:", queryParams);

      const response = await http.get(`/getpropertybyuser?${queryParams}`, {
        withCredentials: true,
        signal: abortControllerRef.current.signal
      });

      console.log("📥 API Response:", response.data);

      if (response.data.success) {
        setPropertyList(response.data.data || []);
        setPagination(response.data.pagination || {
          total: response.data.data?.length || 0,
          page: page,
          limit: limit,
          totalPages: 1
        });
      } else {
        setError(response.data.message || "Failed to fetch properties");
        setPropertyList([]);
      }
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        console.log("Request cancelled");
        return;
      }
      console.error("fetchProperty error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setPropertyList([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedFilters]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchProperty();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchProperty]);

  const deletePropertyById = async (id) => {
    try {
      const response = await http.delete(`/deleteproperty/${id}`, {
        withCredentials: true
      });

      if (response.data.success === true) {
        addToast(response.data.message || "Property deleted successfully", "success");
        await fetchProperty();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting property:", err);
      addToast(err.response?.data?.message || "Failed to delete property", "error");
      return false;
    }
  };

  const updatePropertyStatus = async (id, status) => {
    try {
      const response = await http.patch(`/updateproperty/${id}`, 
        { status },
        { withCredentials: true }
      );

      if (response.data.success === true) {
        addToast(response.data.message || "Property status updated successfully", "success");
        await fetchProperty();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating property status:", err);
      addToast(err.response?.data?.message || "Failed to update property status", "error");
      return false;
    }
  };

  return { 
    propertyList, 
    pagination, 
    loading, 
    error, 
    deletePropertyById,
    updatePropertyStatus,
    refetch: fetchProperty 
  };
};

export default useGetPropertyBuyUserId;