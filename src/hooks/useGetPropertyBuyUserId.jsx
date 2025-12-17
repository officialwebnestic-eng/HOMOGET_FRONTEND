

import { useEffect, useState, useCallback, useContext } from "react";
import { http } from "../axios/axios";


import useDebounce from './useDebounce';

 import { useToast } from "../model/SuccessToasNotification";
 
const useGetPropertyBuyUserId = (page, limit, filters) => {
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 const {addToast}=useToast()
  const debouncedFilters = useDebounce(filters, 1000);
  const fetchProperty = useCallback(async () => {
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

const response = await http.get(`/getpropertybyuser?${query}`, {
    withCredentials: true
});


    

      setPropertyList(response.data.data || []);
      setPagination(response.data.pagination || {});
      setError(null);
    } catch (err) {
      console.error("fetchProperty error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedFilters]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  const deletePropertyById = async (id) => {
    try {
      const response = await http.delete(`/deleteproperty/${id}`,{
     withCredentials:true
      });

      if (response.data.success === true) {
  addToast(response.data.message,"success");
        fetchProperty();
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.message || "Failed to delete property");
    }
  };

  return { propertyList, pagination, loading, error, deletePropertyById };
};

export default useGetPropertyBuyUserId;
