// hooks/useGetAllProperty.js
import { useEffect, useState, useCallback, useContext } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../model/SuccessToasNotification";

const useGetAllProperty = (page, limit, filters) => {
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviewsPropertyData, setReviewsPropertyData] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();

  const debouncedFilters = useDebounce(filters, 500); // Reduced from 1000ms for better responsiveness

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    try {
      // Clean filters - remove empty values
      const cleanedFilters = {};
      
      Object.entries(debouncedFilters).forEach(([key, value]) => {
        // Skip empty values
        if (value === "" || value === null || value === undefined) return;
        
        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) return;
        
        // Handle array filters - convert to comma-separated strings
        if (key === "propertytypeList" || key === "amenities" || key === "keywords") {
          if (Array.isArray(value) && value.length > 0) {
            cleanedFilters[key] = value.join(',');
          }
        } 
        // Handle numeric filters
        else if (key === "minPrice" || key === "maxPrice" || 
                 key === "minSquarefoot" || key === "maxSquarefoot") {
          if (value !== "" && !isNaN(value)) {
            cleanedFilters[key] = value;
          }
        }
        // Handle "10+" values for bedroom/bathroom
        else if ((key === "bedroom" || key === "bathroom") && value === "10+") {
          cleanedFilters[key] = "10+";
        }
        // Regular string/number filters
        else {
          cleanedFilters[key] = value;
        }
      });

      console.log("Sending filters to API:", cleanedFilters); // Debug log

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters,
      });

      const response = await http.get(`/getallproperty?${query}`, {
        withCredentials: true
      });
      
      console.log("API Response:", response.data); // Debug log
     
      setPropertyList(response.data.data || []);
      setPagination(response.data.pagination || {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
      setError(null);
    } catch (err) {
      console.error("fetchProperty error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
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

      if (response.data.success === true) {
        addToast(response.data.message, "success");
        fetchProperty(); // Refresh after deletion
        return { success: true };
      }
      return { success: false };
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.message || "Failed to delete property");
      addToast(err.message || "Failed to delete property", "error");
      return { success: false };
    }
  };

  // const getProperty = async () => {
  //   try {
  //     const response = await http.get("/getproperty");
  //     if (response.data.success === true) {
  //       setReviewsPropertyData(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error("getProperty error:", error);
  //     throw error;
  //   }
  // };

  // useEffect(() => {
  //   getProperty();
  // }, []);

  const refetch = () => {
    fetchProperty();
  };

  return { 
    propertyList, 
    pagination, 
    loading, 
    error, 
    deletePropertyById, 
    refetch 
  };
};

export default useGetAllProperty;