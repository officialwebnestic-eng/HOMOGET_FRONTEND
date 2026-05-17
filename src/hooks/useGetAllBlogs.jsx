import { useState, useEffect, useCallback } from 'react';
import { http } from './../axios/axios';

const useGetAllBlogs = (page , limit , filters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const getAllBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const cleanedFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== "")
      );

      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...cleanedFilters,
      });

      const response = await http.get(`/getblog?${query.toString()}`);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]); 

  useEffect(() => {
    getAllBlogs();
  }, [getAllBlogs]);




  



  return { blogs, pagination, loading, error, getAllBlogs };
};

export default useGetAllBlogs;



