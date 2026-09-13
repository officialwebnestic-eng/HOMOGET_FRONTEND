// LeadsManagementTable.jsx
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
  memo,
} from "react";
import { createPortal } from "react-dom";
import {
  Search as SearchIcon,
  Download,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  DollarSign,
  Home,
  RefreshCw,
  Loader2,
  Inbox,
  Users,
  AlertCircle,
  TrendingUp,
  MoreVertical,
  Check,
  History,
  X,
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import useInquiry from "../../../hooks/useInquiry";
import useDebounce from "../../../hooks/useDebounce";

// ============================================
// Helpers
// ============================================
const cleanPhone = (phone = "") => String(phone).replace(/[^\d]/g, "");

const openWhatsApp = (phone) => {
  const num = cleanPhone(phone);
  if (!num) return;
  window.open(`https://wa.me/${num}`, "_blank", "noopener,noreferrer");
};

const openEmail = (email) => {
  if (!email) return;
  window.location.href = `mailto:${email}`;
};

const openDial = (phone) => {
  if (!phone) return;
  window.location.href = `tel:${phone}`;
};

const formatDate = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================
// ⭐ Budget formatter — fixes "2-39" and "4 AED"
// ============================================
const formatMoney = (n, currency = "AED") => {
  if (n == null || isNaN(n)) return "";
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M ${currency}`;
  }
  if (n >= 1_000) {
    const k = n / 1_000;
    return `${Number.isInteger(k) ? k : k.toFixed(0)}K ${currency}`;
  }
  return `${n.toLocaleString()} ${currency}`;
};

/**
 * ⭐ Normalize budget for display.
 * Detects broken/legacy display strings and rebuilds them from min/max.
 *
 * Handles:
 *   { min: 2,   max: 39,   display: "2-39"    } → "2 AED – 39 AED"
 *   { min: 4,   max: 4,    display: "4 AED"   } → "4 AED"
 *   { min: 2M,  max: 3M,   display: "2-3M AED"} → "2M AED – 3M AED" (already good)
 *   { min: null,max: null, display: ""        } → "—"
 */
const getBudgetDisplay = (budget) => {
  if (!budget) return "—";

  const { min, max, currency = "AED", display = "" } = budget;

  // If no numbers at all, fall back to display or em-dash
  if (min == null && max == null) {
    return display && display.trim() ? display.trim() : "—";
  }

  // ✅ If min & max exist, prefer rebuilding — more reliable than stored display
  if (min != null && max != null) {
    // Single value (min === max)
    if (min === max) {
      return formatMoney(min, currency);
    }
    // Range
    if (max > min) {
      return `${formatMoney(min, currency)} – ${formatMoney(max, currency)}`;
    }
    // Broken range (max < min) — just show min
    return formatMoney(min, currency);
  }

  // Only one side present
  if (min != null) return formatMoney(min, currency);
  if (max != null) return formatMoney(max, currency);

  // Absolute fallback — raw display
  return display && display.trim() ? display.trim() : "—";
};

// ============================================
// Constants
// ============================================
const STATUS_MAP = {
  pending: { key: "pending", label: "Pending", color: "yellow", icon: Clock },
  follow_up: {
    key: "follow_up",
    label: "Follow Up",
    color: "green",
    icon: CheckCircle,
  },
  rejected: { key: "rejected", label: "Rejected", color: "red", icon: XCircle },
};

const ROW_COLORS = {
  pending: {
    text: "text-yellow-600",
    bg: "hover:bg-yellow-500/10",
    icon: "text-yellow-500",
    border: "border-yellow-500",
  },
  follow_up: {
    text: "text-green-600",
    bg: "hover:bg-green-500/10",
    icon: "text-green-500",
    border: "border-green-500",
  },
  rejected: {
    text: "text-red-600",
    bg: "hover:bg-red-500/10",
    icon: "text-red-500",
    border: "border-red-500",
  },
};

const BADGE_COLORS = {
  green: "bg-green-500/10 text-green-500 border-green-500/20",
  yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  red: "bg-red-500/10 text-red-500 border-red-500/20",
};

// ============================================
// ⭐ Status history normalizer — handles legacy data
// ============================================
const normalizeHistory = (rawHistory = []) => {
  return rawHistory.map((entry) => {
    // Legacy entry has `status`, new entry has `to`/`from`
    const to = entry.to || entry.status || "pending";
    const from = entry.from ?? null;
    return {
      from,
      to,
      note: entry.note || "",
      changedAt: entry.changedAt || entry.createdAt || new Date().toISOString(),
      changedBy: entry.changedBy || null,
    };
  });
};

// ============================================
// Status Badge
// ============================================
const StatusBadge = memo(function StatusBadge({ status }) {
  const cfg = STATUS_MAP[status] || STATUS_MAP.pending;
  const Icon = cfg.icon;
  const colorCls = BADGE_COLORS[cfg.color];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${colorCls}`}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
});

// ============================================
// Status Dropdown — Portal
// ============================================
const StatusDropdown = memo(function StatusDropdown({
  isDark,
  currentStatus,
  onSelect,
  loading,
  onDelete,
  onHardDelete,
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUpward: false });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownWidth = 256;
    const dropdownHeight = 320;
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUpward = spaceBelow < dropdownHeight;

    setCoords({
      top: openUpward ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(
        8,
        Math.min(
          rect.right - dropdownWidth,
          window.innerWidth - dropdownWidth - 8
        )
      ),
      openUpward,
    });
  }, []);

  const handleToggle = useCallback(() => {
    if (!open) updatePosition();
    setOpen((o) => !o);
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = () => updatePosition();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const inTrigger = triggerRef.current?.contains(e.target);
      const inDropdown = dropdownRef.current?.contains(e.target);
      if (!inTrigger && !inDropdown) {
        setOpen(false);
        setPendingStatus(null);
        setNote("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setPendingStatus(null);
        setNote("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const handleSelect = useCallback(
    (statusKey) => {
      if (statusKey === currentStatus) {
        setOpen(false);
        return;
      }
      setPendingStatus(statusKey);
    },
    [currentStatus]
  );

  const handleConfirm = useCallback(async () => {
    if (!pendingStatus) return;
    await onSelect(pendingStatus, note);
    setOpen(false);
    setPendingStatus(null);
    setNote("");
  }, [pendingStatus, note, onSelect]);

  const handleCancel = useCallback(() => {
    setPendingStatus(null);
    setNote("");
  }, []);

  const PendingIcon = pendingStatus ? STATUS_MAP[pendingStatus].icon : null;

  const dropdown = open
    ? createPortal(
        <div
          ref={dropdownRef}
          className={`fixed w-64 rounded-xl shadow-2xl border overflow-hidden ${
            isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"
          }`}
          style={{
            top: coords.openUpward ? undefined : coords.top,
            bottom: coords.openUpward
              ? window.innerHeight - coords.top
              : undefined,
            left: coords.left,
            zIndex: 2147483647,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`px-3 py-2 border-b ${
              isDark ? "border-zinc-700" : "border-gray-200"
            }`}
          >
            <p
              className={`text-[10px] font-bold uppercase tracking-wider ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {pendingStatus ? "Add a note (optional)" : "Update Status"}
            </p>
          </div>

          {!pendingStatus && (
            <div className="py-1">
              {Object.values(STATUS_MAP).map((s) => {
                const Icon = s.icon;
                const colors = ROW_COLORS[s.key];
                const isCurrent = currentStatus === s.key;
                return (
                  <button
                    type="button"
                    key={s.key}
                    onClick={() => handleSelect(s.key)}
                    disabled={isCurrent || loading}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${colors.bg} ${
                      isCurrent ? "opacity-40 cursor-not-allowed" : ""
                    } ${isDark ? "text-slate-100" : "text-slate-800"}`}
                  >
                    <Icon size={14} className={colors.icon} />
                    <span className="flex-1 text-left font-medium">
                      {s.label}
                    </span>
                    {isCurrent && <Check size={12} className="text-slate-400" />}
                  </button>
                );
              })}

              <div
                className={`my-1 border-t ${
                  isDark ? "border-zinc-700" : "border-gray-200"
                }`}
              />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onDelete?.();
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-500/10 font-medium"
              >
                Delete (soft)
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onHardDelete?.();
                }}
                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-500/10 font-medium"
              >
                Delete (permanent)
              </button>
            </div>
          )}

          {pendingStatus && PendingIcon && (
            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <PendingIcon
                  size={14}
                  className={ROW_COLORS[pendingStatus].icon}
                />
                <span
                  className={`text-xs font-bold ${ROW_COLORS[pendingStatus].text}`}
                >
                  {STATUS_MAP[pendingStatus].label}
                </span>
              </div>

              <textarea
                rows={2}
                placeholder="Optional note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`w-full px-2 py-1.5 rounded-lg border text-xs outline-none resize-none focus:ring-2 focus:ring-amber-500 ${
                  isDark
                    ? "bg-zinc-800 border-zinc-700 text-white placeholder-slate-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-slate-400"
                }`}
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold ${
                    isDark
                      ? "bg-zinc-800 text-slate-300 hover:bg-zinc-700"
                      : "bg-gray-100 text-slate-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading}
                  className="flex-1 py-1.5 rounded-lg text-[11px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 disabled:opacity-60 flex items-center justify-center gap-1"
                >
                  {loading ? (
                    <>
                      <Loader2 size={11} className="animate-spin" /> Saving…
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap ${
          isDark
            ? "bg-zinc-800 border-zinc-700 text-slate-200 hover:bg-zinc-700"
            : "bg-white border-gray-200 text-slate-700 hover:bg-gray-50"
        }`}
        title="Change status"
      >
        <MoreVertical size={12} />
        <span>Change</span>
      </button>
      {dropdown}
    </>
  );
});

// ============================================
// Timeline Modal
// ============================================
const TimelineModal = memo(function TimelineModal({ lead, isDark, onClose }) {
  if (!lead) return null;

  const timeline = normalizeHistory(lead.statusHistory).slice().reverse();
  const budgetText = getBudgetDisplay(lead.budget);

  return createPortal(
    <div
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl shadow-2xl border max-h-[85vh] overflow-hidden flex flex-col ${
          isDark ? "bg-zinc-900 border-zinc-700" : "bg-white border-gray-200"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-start justify-between gap-3 px-5 py-4 border-b ${
            isDark ? "border-zinc-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <History size={16} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <h3
                className={`text-sm font-bold truncate ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Status Timeline
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {lead.fullName} · {lead.phone}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Summary */}
        <div
          className={`px-5 py-3 border-b grid grid-cols-2 gap-2 text-[11px] ${
            isDark
              ? "border-zinc-700 bg-zinc-950/30"
              : "border-gray-100 bg-gray-50"
          }`}
        >
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">
              Status
            </span>
            <StatusBadge status={lead.status} />
          </div>
          <div>
            <span className="block text-[9px] uppercase font-bold text-slate-400">
              Budget
            </span>
            <span className="text-amber-600 font-bold">{budgetText}</span>
          </div>
        </div>

        {/* Timeline body */}
        <div className="p-5 overflow-y-auto flex-1">
          {timeline.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-8">
              No status history yet.
            </p>
          ) : (
            <ol className="relative">
              <span
                className={`absolute left-[11px] top-2 bottom-2 w-px ${
                  isDark ? "bg-zinc-700" : "bg-gray-200"
                }`}
              />
              {timeline.map((entry, i) => {
                const cfg = STATUS_MAP[entry.to] || STATUS_MAP.pending;
                const colors = ROW_COLORS[entry.to] || ROW_COLORS.pending;
                const Icon = cfg.icon;
                const isLatest = i === 0;

                return (
                  <li key={i} className="relative pl-9 pb-5 last:pb-0">
                    <span
                      className={`absolute left-[5px] top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                        isDark ? "bg-zinc-900" : "bg-white"
                      } ${colors.border}`}
                    />
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Icon size={13} className={colors.icon} />
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {cfg.label}
                      </span>
                      {entry.from && (
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <ArrowRight size={10} />
                          from {STATUS_MAP[entry.from]?.label || entry.from}
                        </span>
                      )}
                      {isLatest && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 font-bold uppercase">
                          Latest
                        </span>
                      )}
                    </div>
                    {entry.note ? (
                      <p
                        className={`text-[11px] italic mb-1 break-words ${
                          isDark ? "text-slate-300" : "text-slate-600"
                        }`}
                      >
                        {entry.note}
                      </p>
                    ) : (
                      <p className="text-[11px] italic mb-1 text-slate-400">
                        No note
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400">
                      {formatDateTime(entry.changedAt)}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-5 py-3 border-t flex items-center justify-between gap-3 ${
            isDark ? "border-zinc-700" : "border-gray-200"
          }`}
        >
          <p className="text-[10px] text-slate-400">
            {timeline.length} Leads{timeline.length === 1 ? "" : "s"} · Created{" "}
            {formatDate(lead.createdAt)}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-bold hover:bg-amber-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

// ============================================
// Stat Card
// ============================================
const COLOR_MAP = {
  slate: {
    light: "bg-slate-50 border-slate-500/20 text-slate-700 ring-slate-400",
    dark: "bg-slate-500/10 border-slate-500/20 text-slate-300 ring-slate-400",
    iconBg: "bg-slate-500/15",
    iconText: "text-slate-600",
  },
  yellow: {
    light: "bg-yellow-50 border-yellow-500/20 text-yellow-700 ring-yellow-400",
    dark: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300 ring-yellow-400",
    iconBg: "bg-yellow-500/15",
    iconText: "text-yellow-600",
  },
  green: {
    light: "bg-green-50 border-green-500/20 text-green-700 ring-green-400",
    dark: "bg-green-500/10 border-green-500/20 text-green-300 ring-green-400",
    iconBg: "bg-green-500/15",
    iconText: "text-green-600",
  },
  red: {
    light: "bg-red-50 border-red-500/20 text-red-700 ring-red-400",
    dark: "bg-red-500/10 border-red-500/20 text-red-300 ring-red-400",
    iconBg: "bg-red-500/15",
    iconText: "text-red-600",
  },
  amber: {
    light: "bg-amber-50 border-amber-500/20 text-amber-700 ring-amber-400",
    dark: "bg-amber-500/10 border-amber-500/20 text-amber-300 ring-amber-400",
    iconBg: "bg-amber-500/15",
    iconText: "text-amber-600",
  },
};

const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  color,
  isDark,
  active,
  onClick,
}) {
  const c = useMemo(() => {
    const base = COLOR_MAP[color] || COLOR_MAP.slate;
    return { ...base, variant: isDark ? base.dark : base.light };
  }, [color, isDark]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${c.variant} hover:shadow-md ${
        active ? "ring-2" : ""
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${c.iconBg}`}
      >
        <Icon size={18} className={c.iconText} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
          {label}
        </p>
        <p className="text-lg font-bold leading-tight">{value ?? 0}</p>
      </div>
    </button>
  );
});

// ============================================
// Empty State
// ============================================
const EmptyState = memo(function EmptyState({
  isDark,
  onReset,
  hasFilters,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
          isDark ? "bg-amber-500/10" : "bg-amber-50"
        }`}
      >
        <Inbox size={28} className="text-amber-500" />
      </div>
      <h3
        className={`text-base font-bold mb-1 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        {hasFilters ? "No Matching Leads" : "No Leads Yet"}
      </h3>
      <p className="text-xs text-slate-400 max-w-xs mb-4">
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "New inquiries from the landing page will appear here automatically."}
      </p>
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-all"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
});

// ============================================
// Lead Row
// ============================================
const LeadRow = memo(function LeadRow({
  lead,
  isDark,
  loading,
  onStatusChange,
  onDelete,
  onHardDelete,
  onOpenHistory,
  tdCls,
}) {
  const handleSelect = useCallback(
    (newStatus, note) => onStatusChange(lead._id, newStatus, note),
    [lead._id, onStatusChange]
  );
  const handleDelete = useCallback(
    () => onDelete(lead._id),
    [lead._id, onDelete]
  );
  const handleHardDelete = useCallback(
    () => onHardDelete(lead._id),
    [lead._id, onHardDelete]
  );
  const handleHistory = useCallback(
    () => onOpenHistory(lead),
    [lead, onOpenHistory]
  );

  const historyCount = lead.statusHistory?.length || 0;
  const budgetText = getBudgetDisplay(lead.budget);
  const propLabel =
    lead.propertyType === "Other"
      ? lead.customPropertyType || "Other"
      : lead.propertyType || "-";

  return (
    <tr
      className={`border-b transition-colors ${
        isDark
          ? "border-zinc-800 hover:bg-zinc-800/50"
          : "border-gray-100 hover:bg-gray-50"
      }`}
    >
      {/* 1. Name */}
      <td className={tdCls}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <User size={12} className="text-amber-500" />
          </div>
          <span
            className={`text-xs font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {lead.fullName || "-"}
          </span>
        </div>
      </td>

      {/* 2. Phone */}
      <td className={tdCls}>
        <a
          href={`tel:${lead.phone}`}
          className="text-[11px] text-slate-500 hover:text-amber-500"
        >
          {lead.phone || "-"}
        </a>
      </td>

      {/* 3. Email */}
      <td className={tdCls}>
        <a
          href={`mailto:${lead.email}`}
          className="text-[11px] text-slate-500 hover:text-amber-500"
        >
          {lead.email || "-"}
        </a>
      </td>

      {/* 4. Property */}
      <td className={tdCls}>
        <span
          className={`text-[11px] font-medium ${
            isDark ? "text-slate-200" : "text-slate-700"
          }`}
        >
          {propLabel}
        </span>
      </td>

      {/* 5. Budget — ⭐ normalized */}
      <td className={tdCls}>
        <span className="text-[11px] font-semibold text-amber-600">
          {budgetText}
        </span>
      </td>

      {/* 6. Category */}
      <td className={tdCls}>
        <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-semibold whitespace-nowrap">
          {lead.category || "-"}
        </span>
      </td>

      {/* 7. Role */}
      <td className={tdCls}>
        <span className="inline-flex px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 text-[10px] font-semibold whitespace-nowrap">
          {lead.userType || "-"}
        </span>
      </td>

      {/* 8. Date */}
      <td className={tdCls}>
        <span className="text-[11px] text-slate-400">
          {formatDate(lead.createdAt)}
        </span>
      </td>

      {/* 9. Actions */}
      <td className={tdCls}>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => openDial(lead.phone)}
            className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-all"
            title={`Call ${lead.phone || ""}`}
          >
            <Phone size={13} />
          </button>
          <button
            type="button"
            onClick={() => openEmail(lead.email)}
            className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-all"
            title={`Email ${lead.email || ""}`}
          >
            <Mail size={13} />
          </button>
          <button
            type="button"
            onClick={() => openWhatsApp(lead.phone)}
            className="p-1.5 rounded-lg bg-green-600/10 text-green-600 hover:bg-green-600/20 transition-all"
            title={`WhatsApp ${lead.phone || ""}`}
          >
            <FaWhatsapp size={13} />
          </button>
        </div>
      </td>

      {/* 10. Status + Latest Note + History */}
      <td className={tdCls}>
        <div className="flex flex-col gap-1.5 max-w-[260px]">
          <div className="flex items-center gap-2">
            <StatusBadge status={lead.status} />
            <StatusDropdown
              isDark={isDark}
              currentStatus={lead.status}
              onSelect={handleSelect}
              loading={loading}
              onDelete={handleDelete}
              onHardDelete={handleHardDelete}
            />
          </div>
{/* 
          {lead.latestNote ? (
            <p
              className={`text-[10px] italic truncate ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
              title={lead.latestNote}
            >
              “{lead.latestNote}”
            </p>
          ) : (
            <p className="text-[10px] italic text-slate-400">No note</p>
          )} */}

          <button
            type="button"
            onClick={handleHistory}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all w-fit ${
              isDark
                ? "bg-zinc-800 border-zinc-700 text-slate-300 hover:bg-zinc-700"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
            title="View full history"
          >
            <History size={11} />
            <span>
              {historyCount} Note{historyCount === 1 ? "" : "s"}
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
});

// ============================================
// Main Component
// ============================================
const LeadsManagementTable = ({ isDark = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [historyLead, setHistoryLead] = useState(null);

  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    inquiries,
    stats,
    pagination,
    params,
    loading,
    error,
    changeStatus,
    deleteInquiry,
    updateFilters,
    refresh,
    hardDeleteInquiry,
  } = useInquiry({ page: 1, limit: 10, status: "", search: "" });

  useEffect(() => {
    if (debouncedSearch === params.search) return;
    updateFilters({ search: debouncedSearch, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // ⭐ Keep modal open lead in sync with fresh data
  useEffect(() => {
    if (!historyLead) return;
    const fresh = inquiries.find((i) => i._id === historyLead._id);
    if (fresh && fresh !== historyLead) {
      setHistoryLead(fresh);
    }
  }, [inquiries, historyLead]);

  const sortedData = useMemo(() => {
    const arr = [...inquiries];
    arr.sort((a, b) => {
      let aVal, bVal;
      if (sortField === "budget") {
        aVal = a?.budget?.max || a?.budget?.min || 0;
        bVal = b?.budget?.max || b?.budget?.min || 0;
      } else if (sortField === "date" || sortField === "createdAt") {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      } else if (sortField === "propertyType") {
        aVal = a.propertyType || "";
        bVal = b.propertyType || "";
      } else {
        aVal = a[sortField] || "";
        bVal = b[sortField] || "";
      }
      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
      return 0;
    });
    return arr;
  }, [inquiries, sortField, sortDirection]);

  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortDirection("desc");
      }
    },
    [sortField]
  );

  const handleSearchSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      updateFilters({ search: searchTerm, page: 1 });
    },
    [searchTerm, updateFilters]
  );

  const handleStatusFilter = useCallback(
    (status) => {
      setSelectedStatus(status);
      updateFilters({ status, page: 1 });
    },
    [updateFilters]
  );

  const handleStatCardClick = useCallback(
    (status) => {
      setSelectedStatus((prev) => {
        const next = prev === status ? "" : status;
        updateFilters({ status: next, page: 1 });
        return next;
      });
    },
    [updateFilters]
  );

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedStatus("");
    updateFilters({ search: "", status: "", page: 1 });
  }, [updateFilters]);

  const handleStatusChange = useCallback(
    async (id, newStatus, note = "") => {
      await changeStatus(id, newStatus, note);
    },
    [changeStatus]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Soft delete this lead?")) return;
      await deleteInquiry(id);
    },
    [deleteInquiry]
  );

  const handleHardDelete = useCallback(
    async (id) => {
      if (
        !window.confirm(
          "Permanently delete this lead? This cannot be undone."
        )
      )
        return;
      await hardDeleteInquiry(id);
    },
    [hardDeleteInquiry]
  );

  const handleClearSearch = useCallback(() => setSearchTerm(""), []);
  const handleRefreshClick = useCallback(() => refresh(), [refresh]);
  const handleOpenHistory = useCallback((lead) => setHistoryLead(lead), []);
  const handleCloseHistory = useCallback(() => setHistoryLead(null), []);

  const cardCls = `p-3 sm:p-6 rounded-2xl ${
    isDark ? "bg-zinc-900/50" : "bg-white"
  } shadow-xl`;

  const hasFilters = !!(searchTerm || selectedStatus);

  const thCls = `text-left py-2 px-2 sm:py-2.5 sm:px-3 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
    isDark ? "text-slate-400" : "text-slate-500"
  }`;

  const tdCls = "py-2 px-2 sm:py-2.5 sm:px-3 align-middle whitespace-nowrap";

  return (
    <div className={cardCls}>
      <style>{`
        .leads-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
        .leads-scroll::-webkit-scrollbar-track {
          background: ${
            isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
          };
          border-radius: 8px;
        }
        .leads-scroll::-webkit-scrollbar-thumb {
          background: ${
            isDark ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.5)"
          };
          border-radius: 8px;
        }
        .leads-scroll::-webkit-scrollbar-thumb:hover {
          background: ${
            isDark ? "rgba(245,158,11,0.6)" : "rgba(245,158,11,0.75)"
          };
        }
        .leads-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${
            isDark ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.5)"
          } transparent;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2
            className={`text-lg sm:text-xl font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Leads Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage and follow up with property inquiries
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleRefreshClick}
            className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 transition-all"
            title="Export"
          >
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <StatCard
          label="Total Leads"
          value={stats.total}
          icon={Users}
          color="amber"
          isDark={isDark}
          active={selectedStatus === ""}
          onClick={() => handleStatCardClick("")}
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          isDark={isDark}
          active={selectedStatus === "pending"}
          onClick={() => handleStatCardClick("pending")}
        />
        <StatCard
          label="Follow Up"
          value={stats.follow_up}
          icon={TrendingUp}
          color="green"
          isDark={isDark}
          active={selectedStatus === "follow_up"}
          onClick={() => handleStatCardClick("follow_up")}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircle}
          color="red"
          isDark={isDark}
          active={selectedStatus === "rejected"}
          onClick={() => handleStatCardClick("rejected")}
        />
      </div>

      {/* Filters */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        <div className="relative flex-1">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by name, phone, email, property or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-9 pr-9 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
              isDark
                ? "bg-zinc-800 border-zinc-700 text-white"
                : "bg-white border-gray-200 text-gray-900"
            }`}
          />
          {searchTerm && debouncedSearch !== searchTerm && (
            <Loader2
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 animate-spin"
            />
          )}
          {searchTerm && debouncedSearch === searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <XCircle size={14} />
            </button>
          )}
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => handleStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm ${
            isDark
              ? "bg-zinc-800 border-zinc-700 text-white"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="follow_up">Follow Up</option>
          <option value="rejected">Rejected</option>
        </select>
      </form>

      {/* Error */}
      {error && (
        <div className="mb-4 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && sortedData.length === 0 && (
        <div className="flex justify-center py-16">
          <Loader2 size={28} className="animate-spin text-amber-500" />
        </div>
      )}

      {/* Empty */}
      {!loading && sortedData.length === 0 && (
        <EmptyState
          isDark={isDark}
          onReset={handleResetFilters}
          hasFilters={hasFilters}
        />
      )}

      {/* Table */}
      {sortedData.length > 0 && (
        <>
          <div
            className="leads-scroll overflow-x-auto overflow-y-auto rounded-xl border"
            style={{
              maxHeight: "min(65vh, 640px)",
              borderColor: isDark ? "rgb(39 39 42)" : "rgb(229 231 235)",
            }}
          >
            <table className="w-full border-collapse min-w-[1000px]">
              <thead
                className={`sticky top-0 z-10 ${
                  isDark
                    ? "bg-zinc-900/95 backdrop-blur-sm"
                    : "bg-white/95 backdrop-blur-sm"
                }`}
              >
                <tr
                  className={`border-b ${
                    isDark ? "border-zinc-800" : "border-gray-200"
                  }`}
                >
                  <th className={thCls}>
                    <button
                      type="button"
                      onClick={() => handleSort("fullName")}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      Name <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className={thCls}>Phone</th>
                  <th className={thCls}>Email</th>
                  <th className={thCls}>
                    <button
                      type="button"
                      onClick={() => handleSort("propertyType")}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      Property <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className={thCls}>
                    <button
                      type="button"
                      onClick={() => handleSort("budget")}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      Budget <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className={thCls}>Category</th>
                  <th className={thCls}>Role</th>
                  <th className={thCls}>
                    <button
                      type="button"
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-1 whitespace-nowrap"
                    >
                      Date <ArrowUpDown size={11} />
                    </button>
                  </th>
                  <th className={thCls}>Actions</th>
                  <th className={thCls}>Status</th>
                </tr>
              </thead>

              <tbody>
                {sortedData.map((lead) => (
                  <LeadRow
                    key={lead._id}
                    lead={lead}
                    isDark={isDark}
                    loading={loading}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                    onHardDelete={handleHardDelete}
                    onOpenHistory={handleOpenHistory}
                    tdCls={tdCls}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <p
            className={`text-[10px] mt-2 ${
              isDark ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {sortedData.length} shown · scroll horizontally if needed
          </p>
        </>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-center mt-6 pt-4 border-t ${
            isDark ? "border-zinc-800" : "border-gray-200"
          }`}
        >
          <p className="text-xs text-slate-400">
            Page {pagination.page} of {pagination.pages} — {pagination.total}{" "}
            total
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => updateFilters({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1 rounded-lg bg-amber-500 text-black text-sm font-bold">
              {pagination.page}
            </span>
            <button
              type="button"
              onClick={() => updateFilters({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.pages}
              className="p-2 rounded-lg bg-zinc-800 text-white disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      {historyLead && (
        <TimelineModal
          lead={historyLead}
          isDark={isDark}
          onClose={handleCloseHistory}
        />
      )}
    </div>
  );
};

export default memo(LeadsManagementTable);