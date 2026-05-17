

import { useEffect, useState, useCallback, useContext } from "react";
import { http } from "../axios/axios";
import useDebounce from './useDebounce';
import { AuthContext } from "../context/AuthContext";
 import { useToast } from "../model/SuccessToasNotification";


const useGetAllProperty = (page, limit, filters) => {
  const [propertyList, setPropertyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [reviewsPropertyData, setReviewsPropertyData] = useState([])
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext)

  const debouncedFilters = useDebounce(filters, 1000);
   const {addToast}=useToast()
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
      const response = await http.get(`/getallproperty?${query}`, {
        withCredentials: true
      });
     
      setPropertyList(response.data.data || []);
      setPagination(response.data.pagination || {});
      setError(null);
    } catch (err) {

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
      const response = await http.delete(`/deleteproperty/${id}`, {
        withCredentials: true
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



  const getProperty = async () => {
    try {
      const response = await http.get("/getproperty");

      if (response.data.success === true) {
        setReviewsPropertyData(response.data.data);
      }
    } catch (error) {

      throw error;
    }
  };

  useEffect(() => {
    getProperty()
  }, [])

  return { propertyList, pagination, loading, error, deletePropertyById, reviewsPropertyData };
};


export default useGetAllProperty;
