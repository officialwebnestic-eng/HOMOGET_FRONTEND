import { useEffect, useState, useCallback, useContext } from "react";
import { http } from "../axios/axios";

import { useToast } from "../model/SuccessToasNotification";

const useGetAllAgent = (page, limit, filters) => {
  const [agentList, setAgentList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
   const [agent,setAgent]=useState([])


  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const res = await http.get(`/getallagent?${query}`, {
        withCredentials: true
      });
      setAgentList(Array.isArray(res.data.data) ? res.data.data : []);

      setPagination(res.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);




  const getOneAgent = useCallback(async (id) => {
    setLoading(true);
    try {

      const res = await http.get(`/getoneagent/${id}`, {
        withCredentials: true
      });

       console.log(res,"this is  one agent")
      setAgent( res.data.data ||  []);

     
      setError(null);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  },[]);




  useEffect(() => {
    fetchAgents();
  }, [fetchAgents, refreshToggle]);




  const deleteAgent = async (agentId) => {
    try {
      await http.delete(`/deleteagent/${agentId}`, {
        withCredentials: true

      });


      setRefreshToggle((prev) => !prev);
      return { success: true };
    } catch (err) {

      return { success: false, message: err.message || "Delete failed" };
    }
  };

  const UpdateStatus = async (newStatus, agentId) => {
    try {
      await http.put(`/updatestatus?status=${newStatus}&id=${agentId}`, {},
        {
          withCredentials: true
        })
      setRefreshToggle((prev) => !prev);
      return { success: true }
    } catch (error) {
      return { success: false, messagfe: error.message }

    }
  }



   const updateAgent = async (id, data) => {
    try {
      await http.put(`/updateagent/${id}`,data,
        {
          withCredentials: true
        })
      setRefreshToggle((prev) => !prev);
      return { success: true }
    } catch (error) {
      return { success: false, messagfe: error.message }

    }
  }

  

  return {
    agentList,
    pagination,
    loading,
    error,
    deleteAgent,
    UpdateStatus,
    getOneAgent,
    agent,
    updateAgent
  };
};

export default useGetAllAgent;
