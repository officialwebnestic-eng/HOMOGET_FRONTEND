import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { http } from "../axios/axios";

/**
 * useInquiry — handles all inquiry operations with toasts + auto-refresh
 *
 * Operations:
 *  - list, stats, getById
 *  - create, update
 *  - changeStatus (pending / follow_up / rejected)
 *  - bulkChangeStatus (batch update)
 *  - fetchStatusHistory (audit timeline)
 *  - softDelete, hardDelete
 *
 * @param {object} initialParams - initial list filters
 * @param {object} options
 * @param {boolean} [options.autoFetch=true]      - fetch list+stats on mount
 * @param {boolean} [options.toastOnError=true]   - show error toasts
 * @param {boolean} [options.toastOnSuccess=true] - show success toasts
 * @param {boolean} [options.autoRefresh=true]    - refetch list+stats after mutations
 * @param {Function} [options.onSuccess]          - callback on any successful op
 * @param {Function} [options.onError]            - callback on any error
 */
const useInquiry = (initialParams = {}, options = {}) => {
  const {
    autoFetch = true,
    toastOnError = true,
    toastOnSuccess = true,
    autoRefresh = true,
    onSuccess,
    onError,
  } = options;

  // ---- State ----
  const [inquiries, setInquiries] = useState([]);
  const [inquiry, setInquiry] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    follow_up: 0,
    rejected: 0,
    total: 0,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [params, setParams] = useState({ page: 1, limit: 10, ...initialParams });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ NEW — status history cache: { [inquiryId]: { currentStatus, timeline, ... } }
  const [statusHistory, setStatusHistory] = useState({});

  // ---- Mount guard ----
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ============================================
  // Internal runner — wraps async calls
  //
  // opts:
  //   - silentSuccess: skip success toast (for background fetches)
  //   - silentError:   skip error toast
  //   - successMessage: custom success toast text
  //   - errorMessage:   custom error toast text
  // ============================================
  const run = useCallback(
    async (fn, opts = {}) => {
      const {
        silentSuccess = false,
        silentError = false,
        successMessage,
        errorMessage,
      } = opts;

      setLoading(true);
      setError(null);

      try {
        const result = await fn();

        if (mountedRef.current) {
          if (!silentSuccess && toastOnSuccess && successMessage) {
            toast.success(successMessage);
          }
          onSuccess?.(result, opts);
        }
        return { success: true, data: result };
      } catch (err) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong";

        if (mountedRef.current) {
          if (!silentError && toastOnError) {
            toast.error(errorMessage || message);
          }
          setError(message);
          onError?.(message, err);
        }
        return { success: false, error: message };
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [onSuccess, onError, toastOnSuccess, toastOnError]
  );

  // ============================================
  // ✅ LIST — GET /api/inquiries
  // ============================================
  const fetchInquiries = useCallback(
    async (overrideParams) => {
      const finalParams = overrideParams || params;
      const res = await run(
        () => http.get("/inquiries", { params: finalParams }),
        { silentSuccess: true, silentError: true }
      );

      if (res.success && mountedRef.current) {
        const payload = res.data?.data || res.data;
        setInquiries(payload?.data || payload || []);
        setPagination({
          page: payload?.page || 1,
          pages: payload?.pages || 1,
          total: payload?.total || 0,
        });
      }
      return res;
    },
    [params, run]
  );

  // ============================================
  // ✅ STATS — GET /api/inquiries/stats  (silent)
  // ============================================
  const fetchStats = useCallback(async () => {
    try {
      const res = await http.get("/inquiries/stats");
      const data = res.data?.data || res.data;
      if (mountedRef.current) setStats(data);
      return { success: true, data };
    } catch {
      return { success: false };
    }
  }, []);

  // ============================================
  // ✅ GET ONE — GET /api/inquiries/:id  (silent)
  // ============================================
  const fetchInquiryById = useCallback(
    async (id) => {
      const res = await run(() => http.get(`/inquiries/${id}`), {
        silentSuccess: true,
        silentError: true,
      });
      if (res.success && mountedRef.current) {
        setInquiry(res.data?.data || res.data);
      }
      return res;
    },
    [run]
  );

  // ============================================
  // ✅ CREATE — POST /api/inquiries
  // ============================================
  const createInquiry = useCallback(
    async (payload, opts = {}) => {
      const res = await run(() => http.post("/inquiries", payload), {
        successMessage:
          opts.successMessage || "Inquiry submitted successfully ✅",
        errorMessage: opts.errorMessage,
      });

      if (res.success && mountedRef.current) {
        const created = res.data?.data || res.data;
        setInquiry(created);
        setInquiries((prev) => [created, ...prev]);

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [run, autoRefresh, fetchInquiries, fetchStats, params]
  );

  // ============================================
  // ✅ UPDATE — PUT /api/inquiries/:id
  // ============================================
  const updateInquiry = useCallback(
    async (id, payload, opts = {}) => {
      const res = await run(() => http.put(`/inquiries/${id}`, payload), {
        successMessage: opts.successMessage || "Inquiry updated ✅",
        errorMessage: opts.errorMessage,
      });

      if (res.success && mountedRef.current) {
        const updated = res.data?.data || res.data;
        setInquiry(updated);
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? updated : i))
        );

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [run, autoRefresh, fetchInquiries, fetchStats, params]
  );

  // ============================================
  // ✅ CHANGE STATUS — PATCH /api/inquiries/:id/status
  // ============================================
  const changeStatus = useCallback(
    async (id, status, note = "", opts = {}) => {
      const res = await run(
        () => http.patch(`/inquiries/${id}/status`, { status, note }),
        {
          successMessage:
            opts.successMessage || `Status changed to ${status} ✅`,
          errorMessage: opts.errorMessage,
        }
      );

      if (res.success && mountedRef.current) {
        const updated = res.data?.data || res.data;
        setInquiry(updated);
        setInquiries((prev) =>
          prev.map((i) => (i._id === id ? updated : i))
        );

        // Invalidate cached history for this inquiry
        setStatusHistory((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [run, autoRefresh, fetchInquiries, fetchStats, params]
  );

  // ============================================
  // ⭐ NEW — BULK CHANGE STATUS
  // PATCH /api/inquiries/status/bulk
  // ============================================
  const bulkChangeStatus = useCallback(
    async (ids, status, note = "", opts = {}) => {
      if (!Array.isArray(ids) || ids.length === 0) {
        const msg = "No leads selected";
        if (toastOnError) toast.error(msg);
        return { success: false, error: msg };
      }

      const res = await run(
        () => http.patch(`/inquiries/status/bulk`, { ids, status, note }),
        {
          successMessage:
            opts.successMessage ||
            `${ids.length} lead${ids.length > 1 ? "s" : ""} updated ✅`,
          errorMessage: opts.errorMessage,
        }
      );

      if (res.success && mountedRef.current) {
        // Optimistically patch matched leads in the current list
        const updatedIds = res.data?.data?.ids || ids;
        setInquiries((prev) =>
          prev.map((i) =>
            updatedIds.includes(i._id) ? { ...i, status } : i
          )
        );

        // Clear history caches for all updated ids
        setStatusHistory((prev) => {
          const next = { ...prev };
          updatedIds.forEach((id) => delete next[id]);
          return next;
        });

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [
      run,
      autoRefresh,
      fetchInquiries,
      fetchStats,
      params,
      toastOnError,
    ]
  );

  // ============================================
  // ⭐ NEW — FETCH STATUS HISTORY
  // GET /api/inquiries/:id/history  (silent)
  // ============================================
  const fetchStatusHistory = useCallback(
    async (id, opts = {}) => {
      const res = await run(
        () => http.get(`/inquiries/${id}/history`),
        { silentSuccess: true, silentError: true }
      );

      if (res.success && mountedRef.current) {
        const data = res.data?.data || res.data;
        setStatusHistory((prev) => ({ ...prev, [id]: data }));
      }
      return res;
    },
    [run]
  );

  // ============================================
  // ✅ SOFT DELETE — DELETE /api/inquiries/:id
  // ============================================
  const deleteInquiry = useCallback(
    async (id, opts = {}) => {
      const res = await run(() => http.delete(`/inquiries/${id}`), {
        successMessage: opts.successMessage || "Inquiry deleted ✅",
        errorMessage: opts.errorMessage,
      });

      if (res.success && mountedRef.current) {
        setInquiries((prev) => prev.filter((i) => i._id !== id));
        setInquiry((prev) => (prev?._id === id ? null : prev));

        setStatusHistory((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [run, autoRefresh, fetchInquiries, fetchStats, params]
  );

  // ============================================
  // ✅ HARD DELETE — DELETE /api/inquiries/:id/hard
  // ============================================
  const hardDeleteInquiry = useCallback(
    async (id, opts = {}) => {
      const res = await run(() => http.delete(`/inquiries/${id}/hard`), {
        successMessage:
          opts.successMessage || "Inquiry permanently deleted 🗑️",
        errorMessage: opts.errorMessage,
      });

      if (res.success && mountedRef.current) {
        setInquiries((prev) => prev.filter((i) => i._id !== id));
        setInquiry((prev) => (prev?._id === id ? null : prev));

        setStatusHistory((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });

        if (autoRefresh) {
          fetchInquiries(params);
          fetchStats();
        }
      }
      return res;
    },
    [run, autoRefresh, fetchInquiries, fetchStats, params]
  );

  // ============================================
  // Filters + refresh + reset
  // ============================================
  const updateFilters = useCallback(
    (newParams) => {
      setParams((prev) => {
        const next = { ...prev, ...newParams };
        fetchInquiries(next);
        return next;
      });
    },
    [fetchInquiries]
  );

  const refresh = useCallback(() => {
    fetchInquiries(params);
    fetchStats();
  }, [fetchInquiries, fetchStats, params]);

  const reset = useCallback(() => {
    setInquiry(null);
    setError(null);
    setLoading(false);
    setStatusHistory({});
  }, []);

  // ============================================
  // Initial load
  // ============================================
  useEffect(() => {
    if (autoFetch) {
      fetchInquiries(params);
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // Return
  // ============================================
  return {
    // state
    inquiries,
    inquiry,
    stats,
    pagination,
    params,
    loading,
    error,
    statusHistory,       // ⭐ { [id]: { currentStatus, timeline, ... } }

    // actions
    fetchInquiries,
    fetchInquiryById,
    fetchStats,
    createInquiry,
    updateInquiry,
    changeStatus,
    bulkChangeStatus,    // ⭐ new
    fetchStatusHistory,  // ⭐ new
    deleteInquiry,
    hardDeleteInquiry,
    updateFilters,
    refresh,
    reset,

    // aliases
    create: createInquiry,
    update: updateInquiry,
    remove: deleteInquiry,
    hardRemove: hardDeleteInquiry,
    bulkStatus: bulkChangeStatus,   // ⭐ nicer alias
    getHistory: fetchStatusHistory, // ⭐ nicer alias
  };
};

export default useInquiry;