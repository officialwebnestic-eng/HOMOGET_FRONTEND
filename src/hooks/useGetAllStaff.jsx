

import { useEffect, useState, useCallback } from "react";
import { http } from "../axios/axios";

import useDebounce from './useDebounce';
 import { useToast } from "../model/SuccessToasNotification";

const useGetAllStaff = (page, limit, filters) => {
  const [StaffList,setStaffList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const {addToast}=useToast()

  const debouncedFilters = useDebounce(filters, 1000); 
  const fetchStaff = useCallback(async () => {
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

      const response = await http.get(`/getstaff?${query}`);
      

      setStaffList(response.data.data || []);
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
    fetchStaff();
  }, [fetchStaff]);

  const deleteEmployeeStaff = async (id) => {
    try {
      const response = await http.delete(`/deleteemployee/${id}`);

      if (response.data.success === true) {
       addToast(response.data.message,"success");
        fetchStaff();
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      setError(err.message || "Failed to delete property");
    }
  };

  return { StaffList, pagination, loading, error, deleteEmployeeStaff };
};

export default useGetAllStaff;
