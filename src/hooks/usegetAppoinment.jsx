import { useEffect, useState, useCallback } from "react";
import { http } from '../axios/axios';
import useDebounce from "./useDebounce";
import { useToast } from "../model/SuccessToasNotification";


const usegetAppoinment = (page, limit, searchTerm) => {
  const [Appointment, setAppoinment] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const { addToast } = useToast()

  const debouncedSearch = useDebounce(searchTerm, 1000);

  // Define fetch function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit,
        search: debouncedSearch || '',
      }).toString();

      const res = await http.get(`/getappinment?${query}`);
      setAppoinment(res.data.data);
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  // Trigger fetch on dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Provide refetch method
  const refetch = () => {
    fetchData();
  };



  const handleDeleteAppointment = (id) => {
    http.delete(`/delete/${id}`)
      .then(res => {
        if (res.data?.success === true) {
          addToast('Appointment deleted successfully', 'success');
          refetch()
        }
      })
      .catch(err => {
        addToast('Failed to delete appointment', 'error')
      });

  }

  return { Appointment, pagination, loading, error, refetch, handleDeleteAppointment };
};

export default usegetAppoinment;