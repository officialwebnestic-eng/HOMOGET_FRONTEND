import { useEffect, useState, useCallback, useRef } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { useToast } from "../model/SuccessToasNotification";

const useGetPropertyByUser = (page = 1, limit = 12, filters = {}) => {
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();
  
  // Refs to prevent duplicate calls
  const isMounted = useRef(true);
  const isFetching = useRef(false);
  const abortController = useRef(null);
  const initialFetchDone = useRef(false);
  const prevParamsRef = useRef({ page, limit, filters: {} });

  // Create a stable filters reference using JSON.stringify comparison
  const filtersKey = JSON.stringify(filters);
  const debouncedFiltersKey = useDebounce(filtersKey, 500);
  
  // Parse debounced filters back to object
  const debouncedFilters = useMemo(() => {
    try {
      return JSON.parse(debouncedFiltersKey);
    } catch {
      return {};
    }
  }, [debouncedFiltersKey]);

  const fetchProperty = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (isFetching.current) {
      console.log("Fetch already in progress, skipping...");
      return;
    }
    
    // Check if params actually changed
    const currentParams = { page, limit, filters: debouncedFilters };
    if (initialFetchDone.current && 
        JSON.stringify(currentParams) === JSON.stringify(prevParamsRef.current)) {
      console.log("Params unchanged, skipping fetch");
      return;
    }
    prevParamsRef.current = currentParams;
    
    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    
    abortController.current = new AbortController();
    isFetching.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // Clean filters - remove empty values
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => 
          v !== "" && v !== null && v !== undefined && v !== "all"
        )
      );
      
      const mappedFilters = {
        propertyname: cleanedFilters.propertyname,
        city: cleanedFilters.city,
        state: cleanedFilters.state,
        propertytype: cleanedFilters.propertytype,
        bedroom: cleanedFilters.bedroom,
        price: cleanedFilters.price,
        sortBy: cleanedFilters.sortBy || "createdAt",
        sortOrder: cleanedFilters.sortOrder || "desc"
      };
      
      const finalFilters = Object.fromEntries(
        Object.entries(mappedFilters).filter(([_, v]) => v !== undefined && v !== "")
      );
      
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...finalFilters,
      }).toString();

      console.log("Fetching properties with query:", query);

      const response = await http.get(`/getpropertybyuser?${query}`, {
        withCredentials: true,
        signal: abortController.current.signal
      });

      if (!isMounted.current) return;

      if (response.data.success) {
        setPropertyList(response.data.data || []);
        setPagination(response.data.pagination || {
          total: response.data.data?.length || 0,
          page: page,
          limit: limit,
          totalPages: 1
        });
        setError(null);
      } else {
        setError(response.data.message || "Failed to fetch properties");
        setPropertyList([]);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log("Request aborted");
        return;
      }
      console.error("fetchProperty error:", err);
      if (isMounted.current) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setPropertyList([]);
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
    }
  }, [page, limit, debouncedFilters]);

  // Initial fetch - only once on mount
  useEffect(() => {
    if (!initialFetchDone.current) {
      initialFetchDone.current = true;
      fetchProperty();
    }
    
    return () => {
      isMounted.current = false;
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []); // Empty dependency array - runs only once

  // Refetch only when page, limit, or debouncedFilters actually change
  useEffect(() => {
    if (initialFetchDone.current) {
      fetchProperty();
    }
  }, [page, limit, debouncedFilters]);

  const deletePropertyById = async (id) => {
    try {
      const response = await http.delete(`/deleteproperty/${id}`, {
        withCredentials: true
      });

      if (response.data.success === true) {
        addToast(response.data.message || "Property deleted successfully", "success");
        // Reset prev params to force refetch
        prevParamsRef.current = {};
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
        prevParamsRef.current = {};
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

export default useGetPropertyByUser;