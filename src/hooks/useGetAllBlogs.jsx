import { useState, useEffect, useCallback, useRef } from 'react';
import { http } from './../axios/axios';

const useGetAllBlogs = (page = 1, limit = 10, filters = {}, options = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
  // Cache reference to avoid unnecessary re-renders
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);

  const {
    enabled = true,
    refetchInterval = null,
    onSuccess = () => {},
    onError = () => {},
    keepPreviousData = false
  } = options;

  // Generate cache key based on parameters
  const getCacheKey = useCallback(() => {
    return JSON.stringify({ page, limit, filters });
  }, [page, limit, filters]);

  // Fetch blogs function
  const getAllBlogs = useCallback(async (isRefetch = false) => {
    if (!enabled) return;
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    if (!isRefetch) {
      setLoading(true);
    } else {
      setIsFetchingMore(true);
    }
    
    setError(null);
    
    try {
      // Clean filters (remove empty values)
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      // Build query parameters
      const queryParams = {
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters
      };
      
      // Handle search query specially
      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }
      
      // Handle date range
      if (filters.startDate) queryParams.startDate = filters.startDate;
      if (filters.endDate) queryParams.endDate = filters.endDate;
      
      const query = new URLSearchParams(queryParams).toString();
      const cacheKey = getCacheKey();
      
      // Check cache
      if (!isRefetch && cacheRef.current.has(cacheKey) && !keepPreviousData) {
        const cachedData = cacheRef.current.get(cacheKey);
        setBlogs(cachedData.blogs);
        setPagination(cachedData.pagination);
        setLoading(false);
        setIsFetchingMore(false);
        onSuccess(cachedData);
        return;
      }
      
      const response = await http.get(`/blogs?${query}`, {
        signal: abortController.signal
      });
      
      if (response.data.success) {
        const newBlogs = response.data.data;
        const newPagination = response.data.pagination;
        
        // Update cache
        cacheRef.current.set(cacheKey, {
          blogs: newBlogs,
          pagination: newPagination
        });
        
        setBlogs(newBlogs);
        setPagination(newPagination);
        onSuccess(response.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Request cancelled');
        return;
      }
      setError(err.message || "Failed to fetch blogs");
      onError(err);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      abortControllerRef.current = null;
    }
  }, [page, limit, filters, enabled, keepPreviousData, getCacheKey, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    getAllBlogs();
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [getAllBlogs]);

  // Auto-refetch on interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;
    
    const intervalId = setInterval(() => {
      getAllBlogs(true);
    }, refetchInterval);
    
    return () => clearInterval(intervalId);
  }, [refetchInterval, enabled, getAllBlogs]);

  // Fetch next page
  const fetchNextPage = useCallback(() => {
    if (pagination.page < pagination.totalPages && !loading && !isFetchingMore) {
      // This would need to be implemented with a separate function
      // For now, just call getAllBlogs with updated page
      getAllBlogs(true);
    }
  }, [pagination.page, pagination.totalPages, loading, isFetchingMore, getAllBlogs]);

  // Fetch previous page
  const fetchPreviousPage = useCallback(() => {
    if (pagination.page > 1 && !loading && !isFetchingMore) {
      getAllBlogs(true);
    }
  }, [pagination.page, loading, isFetchingMore, getAllBlogs]);

  // Go to specific page
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages && !loading) {
      // This would need to be implemented with a separate function
      // For now, just call getAllBlogs with updated page
      getAllBlogs(true);
    }
  }, [pagination.totalPages, loading, getAllBlogs]);

  // Refetch data
  const refetch = useCallback(() => {
    getAllBlogs(true);
  }, [getAllBlogs]);

  // Clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    // This would need to be implemented in the parent component
    // For now, just return a function that can be used
    return () => {
      getAllBlogs(true);
    };
  }, [getAllBlogs]);

  return {
    // Data
    blogs,
    pagination,
    loading,
    error,
    isFetchingMore,
    
    // Actions
    getAllBlogs,
    refetch,
    fetchNextPage,
    fetchPreviousPage,
    goToPage,
    clearCache,
    resetFilters,
    
    // Helpers
    hasNextPage: pagination.page < pagination.totalPages,
    hasPreviousPage: pagination.page > 1,
    totalPages: pagination.totalPages,
    currentPage: pagination.page,
    totalBlogs: pagination.total
  };
};

// Alternative: Simplified version with just essential features
export const useGetAllBlogsSimple = (page = 1, limit = 10, filters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
      );

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters
      }).toString();

      const response = await http.get(`/blogs?${query}`);
      
      if (response.data.success) {
        setBlogs(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error(response.data.message || "Failed to fetch blogs");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return { 
    blogs, 
    pagination, 
    loading, 
    error, 
    refetch: fetchBlogs 
  };
};

export default useGetAllBlogs;