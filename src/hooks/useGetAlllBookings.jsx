import {  useEffect, useState } from "react";
import { http } from "../axios/axios";


  import { useToast } from "../model/SuccessToasNotification";
  

const useGetAllBookings = (page, limit, searchTerm) => {
  const [BookingList, setBookigList] = useState([]);
   const [agentBookingData,setAgentBookingDate]=useState([])
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {addToast}=useToast();
  const [refreshToggle, setRefreshToggle] = useState(false);


  const fetchBookings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit,
        ...searchTerm,
      }).toString();

      const res = await http.get(`/getallbooking?${query}`, {
          withCredentials: true
      });

      setBookigList(res.data.data);
      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const getBookingByAgentId = async () => {
    try {
      const response = await http.get("/getbookinbygagentid", {
           withCredentials: true
      });
      if (response.data.success === true) {
        setAgentBookingDate(response.data.data);
        return { success: true };
      } else {
        return { success: false };
      }
    } catch (error) {
      console.error("Error fetching agent bookings:", error);
      return { success: false };
    }
  };
  const handleUpdateStatus = async (newStatus, bookingId) => {
    try {
      const response = await http.put(
        `/updatebookingstatus?status=${newStatus}&id=${bookingId}`,
        {},
        {
             withCredentials: true
        }
      );

      if (response.data.success === true) {
      addToast(response.data.message,"success");
        setRefreshToggle((prev) => !prev);
        return { success: true };
      } else {
      addToast(response.data.message || "Update failed","error");
        return { success: false };
      }
    } catch (error) {

   addToast("Something went wrong while updating status","error");
      return { success: false };
    }
  }; 
  const deleteBooking = async (id) => {
    try {
      const response = await http.delete(`/deletebooking/${id}`, {
          withCredentials: true
      });

      if (response.data.success === true) {
       addToast(response.data.message || "Booking deleted successfully","success");
        setRefreshToggle((prev) => !prev);
        return { success: true };
      } else {
     addToast(response.data.message || "Failed to delete booking","error");
        return { success: false };
      }
    } catch (error) {
      console.error(error);
   addToast("Something went wrong while deleting the booking","error");
      return { success: false };
    }
  };


  useEffect(() => {
    
      getBookingByAgentId();
      fetchBookings();
    
  }, [page, limit, refreshToggle, searchTerm]);

  return {
    BookingList,
    pagination,
    loading,
    error,
    refreshToggle,
    handleUpdateStatus,
    deleteBooking,
    agentBookingData,
  };
};

export default useGetAllBookings;
