// hooks/useGetAllAgent.js
import { useEffect, useState, useCallback, useRef } from "react";
import { http } from "../axios/axios";
import useDebounce from "../hooks/useDebounce";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getImageUrl = (filename) => {
  if (!filename) return null;
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/agents/${filename}`;
};

// Global cache to prevent duplicate requests across multiple hook instances
const pendingRequests = new Map();
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const useGetAllAgent = (page = 1, limit = 10, filters = {}, isAdmin = false) => {
  const [agentList, setAgentList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshToggle, setRefreshToggle] = useState(false);
  const [agent, setAgent] = useState(null);
  
  const abortControllerRef = useRef(null);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(null);

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  // Create a unique cache key based on request parameters
  const getCacheKey = useCallback(() => {
    const filterString = JSON.stringify(debouncedFilters);
    return `agents_${page}_${limit}_${filterString}_${isAdmin}`;
  }, [page, limit, debouncedFilters, isAdmin]);

  const fetchAgents = useCallback(async () => {
    const cacheKey = getCacheKey();
    
    // Check if we have a valid cached response
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Using cached agents data");
      setAgentList(cached.data.agentList);
      setPagination(cached.data.pagination);
      setLoading(false);
      return;
    }
    
    // Check if there's already a pending request for this exact query
    if (pendingRequests.has(cacheKey)) {
      console.log("Waiting for pending request...");
      const pendingPromise = pendingRequests.get(cacheKey);
      try {
        const result = await pendingPromise;
        if (isMountedRef.current) {
          setAgentList(result.agentList);
          setPagination(result.pagination);
        }
        return;
      } catch (err) {
        // If pending request fails, continue to make a new request
        console.log("Pending request failed, making new request");
      }
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    
    // Create the promise and store it in pending requests
    const requestPromise = (async () => {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('page', page);
        queryParams.append('limit', limit);
        
        Object.keys(debouncedFilters).forEach(key => {
          if (debouncedFilters[key] && debouncedFilters[key] !== '') {
            queryParams.append(key, debouncedFilters[key]);
          }
        });

        const endpoint = isAdmin ? '/getallagents-admin' : '/getallagent';
        
        const res = await http.get(`${endpoint}?${queryParams.toString()}`, {
          withCredentials: isAdmin,
          signal: abortControllerRef.current.signal
        });
        
        if (res.data.success && isMountedRef.current) {
          const agentsWithImages = (res.data.data || []).map(agent => ({
            ...agent,
            profilePhotoUrl: getImageUrl(agent.profilePhoto),
            isActive: agent.status === "Active" && !agent.isBlocked,
            canShowPublic: agent.isPublic && agent.status === "Active" && !agent.isBlocked
          }));
          
          const result = {
            agentList: agentsWithImages,
            pagination: res.data.pagination
          };
          
          // Store in cache
          cache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
          
          return result;
        }
        return { agentList: [], pagination: {} };
      } catch (err) {
        if (err.name === 'AbortError') {
          throw err;
        }
        console.error("Fetch agents error:", err);
        throw err;
      }
    })();
    
    pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      if (isMountedRef.current) {
        setAgentList(result.agentList);
        setPagination(result.pagination);
        setError(null);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return;
      }
      if (isMountedRef.current) {
        console.error("Fetch agents error:", err);
        setError(err.message || "Something went wrong");
        setAgentList([]);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      pendingRequests.delete(cacheKey);
    }
  }, [page, limit, debouncedFilters, isAdmin, getCacheKey]);

  const getOneAgent = useCallback(async (id) => {
    if (!id) return;
    
    const cacheKey = `agent_${id}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Using cached agent data");
      setAgent(cached.data);
      return cached.data;
    }
    
    // Check pending request
    if (pendingRequests.has(cacheKey)) {
      console.log("Waiting for pending agent request...");
      return pendingRequests.get(cacheKey);
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    
    const requestPromise = (async () => {
      try {
        const res = await http.get(`/getoneagent/${id}`, {
          withCredentials: true,
          signal: abortControllerRef.current.signal
        });

        if (res.data.success) {
          const agentData = res.data.data;
          const agentWithImage = {
            ...agentData,
            profilePhotoUrl: getImageUrl(agentData.profilePhoto),
            isActive: agentData.status === "Active" && !agentData.isBlocked,
            canShowPublic: agentData.isPublic && agentData.status === "Active" && !agentData.isBlocked
          };
          
          // Store in cache
          cache.set(cacheKey, {
            data: agentWithImage,
            timestamp: Date.now()
          });
          
          return agentWithImage;
        }
        return null;
      } catch (err) {
        if (err.name === 'AbortError') {
          throw err;
        }
        console.error("Get one agent error:", err);
        throw err;
      }
    })();
    
    pendingRequests.set(cacheKey, requestPromise);
    
    try {
      const result = await requestPromise;
      if (isMountedRef.current) {
        setAgent(result);
        setError(null);
      }
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        return null;
      }
      if (isMountedRef.current) {
        console.error("Get one agent error:", err);
        setError(err.message || "Something went wrong");
        setAgent(null);
      }
      return null;
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      pendingRequests.delete(cacheKey);
    }
  }, []);

  const getPublicAgent = useCallback(async (id) => {
    if (!id) return;
    
    const cacheKey = `public_agent_${id}`;
    
    // Check cache
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setAgent(cached.data);
      return cached.data;
    }
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    try {
      const res = await http.get(`/getpublicagent/${id}`, {
        signal: abortControllerRef.current.signal
      });

      if (res.data.success) {
        const agentData = res.data.data;
        const agentWithImage = {
          ...agentData,
          profilePhotoUrl: getImageUrl(agentData.profilePhoto)
        };
        
        // Store in cache
        cache.set(cacheKey, {
          data: agentWithImage,
          timestamp: Date.now()
        });
        
        setAgent(agentWithImage);
        return agentWithImage;
      }
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        return null;
      }
      console.error("Get public agent error:", err);
      setError(err.message || "Something went wrong");
      setAgent(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgent = async (id, data) => {
    try {
      const formData = new FormData();
      
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
          if (key === 'skills' || key === 'languages') {
            const arr = typeof data[key] === 'string' 
              ? data[key].split(",").map(s => s.trim()).filter(Boolean)
              : data[key];
            if (arr.length > 0) {
              formData.append(key, JSON.stringify(arr));
            }
          } else if (key === 'currentSalary') {
            const salary = Number(data[key]);
            if (!isNaN(salary) && salary > 0) {
              formData.append(key, salary);
            }
          } else if (key !== 'profilePhoto' && key !== 'profilePhotoUrl') {
            formData.append(key, data[key]);
          }
        }
      });
      
      if (data.profilePhotoFile) {
        formData.append('profilePhoto', data.profilePhotoFile);
      }
      
      if (data.removeImage === true) {
        formData.append('removeImage', 'true');
      }

      const res = await http.put(`/updateagent/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      
      if (res.data.success) {
        // Clear all caches on update
        cache.clear();
        pendingRequests.clear();
        setRefreshToggle(prev => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Update failed" };
    } catch (error) {
      console.error("Update agent error:", error);
      return { success: false, message: error.message || "Update failed" };
    }
  };

  const deleteAgent = async (agentId) => {
    try {
      const res = await http.delete(`/deleteagent/${agentId}`, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        pendingRequests.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Delete failed" };
    } catch (err) {
      console.error("Delete agent error:", err);
      return { success: false, message: err.message || "Delete failed" };
    }
  };

  const updateStatus = async (newStatus, agentId) => {
    try {
      const res = await http.put(`/updatestatus?status=${newStatus}&id=${agentId}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        // Clear specific agent cache
        cache.delete(`agent_${agentId}`);
        cache.delete(`public_agent_${agentId}`);
        setRefreshToggle((prev) => !prev);
        return { success: true };
      }
      return { success: false, message: res.data.message || "Status update failed" };
    } catch (error) {
      console.error("Update status error:", error);
      return { success: false, message: error.message };
    }
  };

  const blockAgent = async (agentId, reason = "") => {
    try {
      const res = await http.put(`/block-agent/${agentId}`, { reason }, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Block failed" };
    } catch (error) {
      console.error("Block agent error:", error);
      return { success: false, message: error.message };
    }
  };

  const unblockAgent = async (agentId) => {
    try {
      const res = await http.put(`/unblock-agent/${agentId}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Unblock failed" };
    } catch (error) {
      console.error("Unblock agent error:", error);
      return { success: false, message: error.message };
    }
  };

  const makeAgentPublic = async (agentId) => {
    try {
      const res = await http.put(`/make-public/${agentId}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to make public" };
    } catch (error) {
      console.error("Make public error:", error);
      return { success: false, message: error.message };
    }
  };

  const makeAgentPrivate = async (agentId) => {
    try {
      const res = await http.put(`/make-unpublic/${agentId}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Failed to make private" };
    } catch (error) {
      console.error("Make private error:", error);
      return { success: false, message: error.message };
    }
  };

  const approveAgent = async (agentId) => {
    try {
      const res = await http.put(`/approve-agent/${agentId}`, {}, {
        withCredentials: true
      });
      
      if (res.data.success) {
        cache.clear();
        setRefreshToggle((prev) => !prev);
        return { success: true, data: res.data.data };
      }
      return { success: false, message: res.data.message || "Approve failed" };
    } catch (error) {
      console.error("Approve agent error:", error);
      return { success: false, message: error.message };
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents, refreshToggle]);

  return {
    agentList,
    pagination,
    loading,
    error,
    deleteAgent,
    updateStatus,
    getOneAgent,
    getPublicAgent,
    agent,
    updateAgent,
    blockAgent,
    unblockAgent,
    makeAgentPublic,
    makeAgentPrivate,
    approveAgent,
    refreshToggle,
    setRefreshToggle,
    refetch: fetchAgents
  };
};

export default useGetAllAgent;