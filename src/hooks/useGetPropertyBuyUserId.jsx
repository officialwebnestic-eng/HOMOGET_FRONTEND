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
  const isInitialMount = useRef(true);

  const debouncedFilters = useDebounce(filters, 500);

  const fetchProperty = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Clean filters - remove empty, null, undefined, and "all" values
      const cleanedFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([_, v]) => 
          v !== "" && v !== null && v !== undefined && v !== "all"
        )
      );
      
      // Map frontend filters to backend expected field names
      const mappedFilters = {
        // Text search filters
        propertyTitleEn: cleanedFilters.propertyTitleEn,
        propertyname: cleanedFilters.propertyname,
        city: cleanedFilters.city,
        community: cleanedFilters.community,
        state: cleanedFilters.state,
        zipcode: cleanedFilters.zipcode,
        
        // Exact match filters
        propertytype: cleanedFilters.propertytype,
        category: cleanedFilters.category,
        offeringType: cleanedFilters.offeringType,
        furnishingType: cleanedFilters.furnishingType,
        availability: cleanedFilters.availability,
        status: cleanedFilters.status,
        permitType: cleanedFilters.permitType,
        publishingStatus: cleanedFilters.publishingStatus,
        
        // Price range
        minPrice: cleanedFilters.minPrice,
        maxPrice: cleanedFilters.maxPrice,
        
        // Size range
        minSquarefoot: cleanedFilters.minSquarefoot,
        maxSquarefoot: cleanedFilters.maxSquarefoot,
        
        // Room counts and numeric filters
        bedroom: cleanedFilters.bedroom,
        bathroom: cleanedFilters.bathroom,
        totalFloor: cleanedFilters.totalFloor,
        parkingSlots: cleanedFilters.parkingSlots,
        
        // Array filters (comma-separated strings)
        amenities: cleanedFilters.amenities,
        propertytypeList: cleanedFilters.propertytypeList,
        keywords: cleanedFilters.keywords,
        
        // Special features (boolean)
        hasVirtualTour: cleanedFilters.hasVirtualTour,
        hasVideoTour: cleanedFilters.hasVideoTour,
        
        // Sorting
        sortBy: cleanedFilters.sortBy || "createdAt",
        sortOrder: cleanedFilters.sortOrder || "desc"
      };
      
      // Remove undefined values from mapped filters
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
        withCredentials: true
      });

      console.log("API Response:", response.data);

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
      console.error("fetchProperty error:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setPropertyList([]);
      
      // Only show toast for errors on refetch, not initial load
      if (!isInitialMount.current) {
        addToast(err.response?.data?.message || "Failed to fetch properties", "error");
      }
    } finally {
      setLoading(false);
      isInitialMount.current = false;
    }
  }, [page, limit, debouncedFilters, addToast]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const deletePropertyById = async (id) => {
    try {
      const response = await http.delete(`/deleteproperty/${id}`, {
        withCredentials: true
      });

      if (response.data.success === true) {
        addToast(response.data.message || "Property deleted successfully", "success");
        await fetchProperty(); // Refresh the list
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
        await fetchProperty(); // Refresh the list
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