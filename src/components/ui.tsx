import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Alert,
  Box,
  Button as MuiButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import InboxOutlined from "@mui/icons-material/InboxOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import type { ApiError } from "../api/types";
import { label, number } from "../hooks";

const NoticeContext = createContext<(message: string) => void>(() => {});
export function NoticeProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  return (
    <NoticeContext.Provider value={setMessage}>
      {children}
      <Snackbar
        open={!!message}
        autoHideDuration={4500}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" onClose={() => setMessage("")} role="status">
          {message}
        </Alert>
      </Snackbar>
    </NoticeContext.Provider>
  );
}
export const useNotice = () => useContext(NoticeContext);
export function PageHeading({
  title,
  description,
  actions,
  kicker,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  kicker?: string;
}) {
  useEffect(() => {
    document.title = `${title} · GreenHaul Solutions`;
  }, [title]);
  return (
    <header className="page-heading">
      <div className="page-heading-content">
        <div className="page-title-eyebrow">
          <span className="page-title-dot" aria-hidden="true" />
          <span className="page-title-kicker">
            {kicker || "Campaign Workspace"}
          </span>
        </div>
        <div className="page-title-row">
          <Typography variant="h1" className="page-title-text">
            {title}
          </Typography>
        </div>
        {description && <p className="page-title-sub">{description}</p>}
      </div>
      {actions && <div className="page-heading-actions actions">{actions}</div>}
    </header>
  );
}
export function StatusChip({ status }: { status: string }) {
  const tone: Record<string, [string, string]> = {
    active: ["#ECFDF3", "#166534"],
    configured: ["#ECFDF3", "#166534"],
    not_configured: ["#FFFAEB", "#93370D"],
    completed: ["#ECFDF3", "#166534"],
    delivered: ["#ECFDF3", "#166534"],
    sent: ["#ECFDF3", "#166534"],
    queued: ["#FFFAEB", "#93370D"],
    scheduled: ["#F0FDF4", "#166534"],
    sending: ["#EFF8FF", "#175CD3"],
    failed: ["#FEF3F2", "#B42318"],
    bounced: ["#FFFAEB", "#93370D"],
  };
  const [bg, fg] = tone[status] || ["#F2F4F7", "#475467"];
  return (
    <Chip
      label={"● " + label(status)}
      size="small"
      sx={{ bgcolor: bg, color: fg }}
    />
  );
}
export function ErrorNotice({
  error,
  retry,
}: {
  error?: ApiError;
  retry?: () => void;
}) {
  if (!error) return null;
  const context =
    error.statusCode === 401
      ? "Your session may have expired. Sign in again and retry."
      : error.statusCode === 403
        ? "Your account does not have permission for this action."
        : error.statusCode === 404
          ? "The requested record may have been removed or the link may be outdated."
          : error.statusCode && error.statusCode >= 500
            ? "An unexpected issue occurred. Your saved information remains safe. Please try again."
            : !error.statusCode
              ? "Unable to reach the service. Please check your internet connection and try again."
              : undefined;
  return (
    <Alert
      severity="error"
      icon={<ErrorOutlineOutlined fontSize="inherit" />}
      sx={{ mb: 2.5 }}
      action={
        retry ? (
          <MuiButton color="inherit" variant="text" onClick={retry}>
            Try again
          </MuiButton>
        ) : undefined
      }
    >
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {error.message}
      </Typography>
      {context && (
        <Typography
          variant="caption"
          sx={{ display: "block", mt: 0.35, opacity: 0.86 }}
        >
          {context}
        </Typography>
      )}
    </Alert>
  );
}
export function Loading({ rows = 4 }: { rows?: number }) {
  return (
    <Box
      aria-label="Loading content"
      aria-busy="true"
      sx={{
        p: 3,
        border: "1px solid var(--border)",
        borderRadius: 3.5,
        bgcolor: "var(--surface)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
        <Skeleton
          variant="circular"
          width={30}
          height={30}
          sx={{ bgcolor: "rgba(18, 61, 51, 0.08)" }}
        />
        <Skeleton
          variant="text"
          width="32%"
          height={24}
          sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1 }}
        />
      </Box>
      {Array.from({ length: rows }, (_, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0.8,
            py: 1,
            borderBottom: i === rows - 1 ? "none" : "1px solid #edf4f0",
          }}
        >
          <Skeleton
            variant="text"
            width={`${Math.max(50, 92 - i * 12)}%`}
            height={20}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.07)", borderRadius: 1 }}
          />
          <Skeleton
            variant="text"
            width={`${Math.max(28, 55 - i * 10)}%`}
            height={15}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.04)", borderRadius: 1 }}
          />
        </Box>
      ))}
    </Box>
  );
}

export function TableSkeleton({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div
      className="table-container"
      aria-label="Loading table"
      aria-busy="true"
      style={{ margin: 0, border: "none" }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {Array.from({ length: cols }, (_, i) => (
              <th key={i} style={{ padding: "14px 20px" }}>
                <Skeleton
                  variant="text"
                  width={i === 0 ? 110 : i === cols - 1 ? 55 : 85}
                  height={18}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1 }}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }, (_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }, (_, c) => (
                <td key={c} style={{ padding: "16px 20px" }}>
                  {c === 0 ? (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={28}
                        height={28}
                        sx={{
                          bgcolor: "rgba(18, 61, 51, 0.07)",
                          flexShrink: 0,
                        }}
                      />
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Skeleton
                          variant="text"
                          width="72%"
                          height={19}
                          sx={{
                            bgcolor: "rgba(18, 61, 51, 0.08)",
                            borderRadius: 1,
                          }}
                        />
                        <Skeleton
                          variant="text"
                          width="42%"
                          height={14}
                          sx={{
                            bgcolor: "rgba(18, 61, 51, 0.05)",
                            borderRadius: 1,
                            mt: 0.3,
                          }}
                        />
                      </Box>
                    </Box>
                  ) : c === cols - 1 ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Skeleton
                        variant="rounded"
                        width={28}
                        height={28}
                        sx={{
                          bgcolor: "rgba(18, 61, 51, 0.06)",
                          borderRadius: 1.5,
                        }}
                      />
                    </Box>
                  ) : c === 1 ? (
                    <Skeleton
                      variant="rounded"
                      width={78}
                      height={24}
                      sx={{
                        bgcolor: "rgba(18, 61, 51, 0.06)",
                        borderRadius: 999,
                      }}
                    />
                  ) : (
                    <Skeleton
                      variant="text"
                      width="58%"
                      height={18}
                      sx={{
                        bgcolor: "rgba(18, 61, 51, 0.07)",
                        borderRadius: 1,
                      }}
                    />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <section
      className="panel metric-card"
      aria-label="Loading metric"
      aria-busy="true"
    >
      <div>
        <div
          className="metric-label"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Skeleton
            variant="text"
            width={95}
            height={20}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.08)", borderRadius: 1 }}
          />
          <Skeleton
            variant="rounded"
            width={34}
            height={34}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.07)", borderRadius: 2.5 }}
          />
        </div>
        <div style={{ margin: "14px 0 6px" }}>
          <Skeleton
            variant="rounded"
            width={72}
            height={36}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.1)", borderRadius: 1.5 }}
          />
        </div>
      </div>
      <Skeleton
        variant="text"
        width={130}
        height={16}
        sx={{ bgcolor: "rgba(18, 61, 51, 0.06)", borderRadius: 1 }}
      />
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      {/* 1. Four Metric Cards */}
      <div className="grid grid-4">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>

      {/* 2. Main Grid: Recent Delivery Chart & Audience Health */}
      <div className="dashboard-main-grid">
        {/* Left: Bar Chart Card */}
        <section className="panel dashboard-chart-card">
          <div
            className="dashboard-chart-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 20,
            }}
          >
            <div>
              <Skeleton
                variant="text"
                width={200}
                height={28}
                sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1 }}
              />
              <Skeleton
                variant="text"
                width={280}
                height={18}
                sx={{
                  bgcolor: "rgba(18, 61, 51, 0.05)",
                  borderRadius: 1,
                  mt: 0.8,
                }}
              />
            </div>
            <Skeleton
              variant="rounded"
              width={92}
              height={32}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.07)", borderRadius: 2 }}
            />
          </div>

          {/* Bar Chart Simulation */}
          <div
            style={{
              height: 240,
              display: "flex",
              alignItems: "flex-end",
              gap: 20,
              padding: "20px 10px 10px",
              borderBottom: "1px solid #edf3ef",
            }}
          >
            {[65, 85, 45, 95, 70, 80].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  gap: 4,
                  alignItems: "flex-end",
                  height: "100%",
                }}
              >
                <Skeleton
                  variant="rounded"
                  width="48%"
                  height={`${h * 0.9}%`}
                  sx={{
                    bgcolor: "rgba(18, 61, 51, 0.06)",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
                <Skeleton
                  variant="rounded"
                  width="48%"
                  height={`${h}%`}
                  sx={{
                    bgcolor: "rgba(56, 123, 111, 0.18)",
                    borderRadius: "4px 4px 0 0",
                  }}
                />
              </div>
            ))}
          </div>

          <div
            className="dashboard-chart-meta"
            style={{ display: "flex", gap: 24, marginTop: 18 }}
          >
            <Skeleton
              variant="text"
              width={110}
              height={18}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.07)" }}
            />
            <Skeleton
              variant="text"
              width={110}
              height={18}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.07)" }}
            />
            <Skeleton
              variant="text"
              width={100}
              height={18}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.07)" }}
            />
          </div>
        </section>

        {/* Right: Audience Health Donut Card */}
        <section
          className="panel"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div>
            <Skeleton
              variant="text"
              width={160}
              height={28}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1 }}
            />
            <Skeleton
              variant="text"
              width={220}
              height={18}
              sx={{
                bgcolor: "rgba(18, 61, 51, 0.05)",
                borderRadius: 1,
                mt: 0.8,
              }}
            />
          </div>

          {/* Donut Simulation */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 3,
              height: 180,
            }}
          >
            <Box
              sx={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                border: "18px solid rgba(56, 123, 111, 0.14)",
                borderTopColor: "rgba(56, 123, 111, 0.32)",
                borderRightColor: "rgba(179, 147, 99, 0.28)",
              }}
            />
          </Box>

          {/* Status Breakdown Items */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 1.5,
              mt: "auto",
              pt: 1.5,
              borderTop: "1px solid #edf3ef",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <Box
                key={i}
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Skeleton
                  variant="circular"
                  width={8}
                  height={8}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.15)" }}
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={16}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.07)" }}
                />
              </Box>
            ))}
          </Box>
        </section>
      </div>

      {/* 3. Secondary Grid: Delivery Breakdown & Recent Activity */}
      <div className="dashboard-secondary">
        <section className="panel">
          <Skeleton
            variant="text"
            width={150}
            height={26}
            sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1, mb: 2 }}
          />
          <div className="delivery-summary">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="delivery-tile">
                <Skeleton
                  variant="text"
                  width="50%"
                  height={16}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.06)" }}
                />
                <Skeleton
                  variant="text"
                  width="40%"
                  height={32}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.1)", my: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width="70%"
                  height={14}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.05)" }}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Skeleton
              variant="text"
              width={160}
              height={26}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.09)", borderRadius: 1 }}
            />
            <Skeleton
              variant="text"
              width={60}
              height={18}
              sx={{ bgcolor: "rgba(18, 61, 51, 0.06)", borderRadius: 1 }}
            />
          </div>
          {[1, 2, 3].map((i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1.5,
                borderBottom: i === 3 ? "none" : "1px solid #edf3ef",
              }}
            >
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Skeleton
                  variant="text"
                  width="55%"
                  height={19}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.08)" }}
                />
                <Skeleton
                  variant="text"
                  width="35%"
                  height={14}
                  sx={{ bgcolor: "rgba(18, 61, 51, 0.05)", mt: 0.3 }}
                />
              </Box>
              <Skeleton
                variant="rounded"
                width={68}
                height={22}
                sx={{
                  bgcolor: "rgba(18, 61, 51, 0.07)",
                  borderRadius: 999,
                }}
              />
            </Box>
          ))}
        </section>
      </div>
    </Box>
  );
}
export interface EmptyStateFeature {
  title: string;
  description: string;
  icon?: ReactNode;
}

export function EmptyState({
  title = "No items found",
  description = "Get started by adding your first entry.",
  icon,
  badgeText,
  action,
  secondaryAction,
  features,
}: {
  title?: string;
  description?: string;
  icon?: ReactNode;
  badgeText?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  features?: EmptyStateFeature[];
}) {
  return (
    <div className="empty-state-container">
      {badgeText && (
        <div className="empty-state-badge">
          <span className="empty-state-badge-dot" />
          <span>{badgeText}</span>
        </div>
      )}

      <div className="empty-state-icon-wrap">
        {icon || <InboxOutlined sx={{ fontSize: 32, color: "#0E7A4B" }} />}
      </div>

      <Typography variant="h2" className="empty-state-title">
        {title}
      </Typography>

      <Typography variant="body1" className="empty-state-desc">
        {description}
      </Typography>

      {(action || secondaryAction) && (
        <div className="empty-state-actions">
          {action}
          {secondaryAction}
        </div>
      )}

      {features && features.length > 0 && (
        <div className="empty-state-features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="empty-feature-card">
              <div className="empty-feature-header">
                {feat.icon && (
                  <div className="empty-feature-icon">{feat.icon}</div>
                )}
                <div className="empty-feature-title">{feat.title}</div>
              </div>
              <div className="empty-feature-desc">{feat.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function Empty({
  title = "No results",
  description = "Try another search or clear your filters.",
  action,
  secondaryAction,
  icon,
  badgeText,
  features,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  icon?: ReactNode;
  badgeText?: string;
  features?: EmptyStateFeature[];
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      action={action}
      secondaryAction={secondaryAction}
      icon={icon}
      badgeText={badgeText}
      features={features}
    />
  );
}
export function Metric({
  title,
  value,
  caption,
}: {
  title: string;
  value: number | string;
  caption?: string;
}) {
  return (
    <div className="panel metric-card">
      <div>
        <div className="metric-label">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 600 }}
          >
            {title}
          </Typography>
        </div>
        <div className="metric">
          {typeof value === "number" ? number(value) : value}
        </div>
      </div>
      <div className="metric-caption">
        {caption && (
          <Typography variant="caption" color="text.secondary">
            {caption}
          </Typography>
        )}
      </div>
    </div>
  );
}
export function Detail({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="detail-row">
      <Typography color="text.secondary" variant="body2">
        {name}
      </Typography>
      <Typography
        component="div"
        variant="body2"
        sx={{ textAlign: "right", fontWeight: 500 }}
      >
        {children || "—"}
      </Typography>
    </div>
  );
}
export function ConfirmDialog({
  open,
  title,
  description,
  action = "Delete",
  danger = true,
  busy = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description: string;
  action?: string;
  danger?: boolean;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
    >
      <DialogTitle id="confirmation-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <MuiButton
          autoFocus
          variant="outlined"
          disabled={busy}
          onClick={onClose}
        >
          Cancel
        </MuiButton>
        <MuiButton
          color={danger ? "error" : "primary"}
          loading={busy}
          onClick={onConfirm}
        >
          {action}
        </MuiButton>
      </DialogActions>
    </Dialog>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(value);
  const [composing, setComposing] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const callback = useRef(onChange);
  callback.current = onChange;
  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (composing || text === value) return;
    const timer = setTimeout(() => callback.current(text), 300);
    return () => clearTimeout(timer);
  }, [text, composing, value]);
  return (
    <TextField
      inputRef={input}
      label="Search"
      placeholder={placeholder}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onCompositionStart={() => setComposing(true)}
      onCompositionEnd={() => setComposing(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing)
          callback.current(text);
      }}
      sx={{ minWidth: 200, flex: "1 1 260px" }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlined fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: text ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                size="small"
                onClick={() => {
                  setText("");
                  callback.current("");
                  input.current?.focus();
                }}
              >
                <CloseOutlined fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null,
        },
      }}
    />
  );
}
export function Filter({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <TextField
      select
      label={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ width: 175 }}
    >
      <MenuItem value="">All {name.toLowerCase()}</MenuItem>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
export function DataTable<T>({
  rows,
  columns,
  empty,
}: {
  rows: T[];
  columns: { name: string; render: (row: T) => ReactNode }[];
  empty?: ReactNode;
}) {
  return (
    <div className="table-wrap">
      {!rows.length ? (
        empty || <Empty />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.name}>{c.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={(row as { id?: number }).id || i} hover>
                {columns.map((c) => (
                  <TableCell key={c.name}>{c.render(row)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
export function Pager({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (n: number) => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 2,
        p: 2,
        flexWrap: "wrap",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {count
          ? `${(page - 1) * 50 + 1}–${Math.min(page * 50, count)} of ${number(count)}`
          : "0 results"}
      </Typography>
      <Pagination
        count={Math.max(1, Math.ceil(count / 50))}
        page={page}
        onChange={(_, v) => onChange(v)}
      />
    </Box>
  );
}
export function EmailPreview({ html, text }: { html: string; text?: string }) {
  const [images, setImages] = useState(false);
  const policy = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:${images ? " https:" : ""};">`;
  return (
    <>
      {/<img\s/i.test(html) && (
        <MuiButton
          type="button"
          variant="text"
          size="small"
          onClick={() => setImages(!images)}
          sx={{ mb: 1 }}
        >
          {images ? "Hide external images" : "Load external images"}
        </MuiButton>
      )}
      {html ? (
        <iframe
          title="Email content preview"
          className="preview"
          sandbox=""
          referrerPolicy="no-referrer"
          srcDoc={policy + html}
        />
      ) : (
        <Typography color="text.secondary">
          No formatted message provided. The plain text version will be used.
        </Typography>
      )}
      {text && (
        <Box
          component="pre"
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            fontFamily: "inherit",
            fontSize: 13,
            bgcolor: "#F7FAF8",
            p: 2,
            borderRadius: 2,
          }}
        >
          {text}
        </Box>
      )}
    </>
  );
}
export function Summary({ data }: { data: Record<string, number> }) {
  return (
    <div className="grid grid-4">
      {Object.entries(data).map(([key, value]) => (
        <Metric key={key} title={label(key)} value={value} />
      ))}
    </div>
  );
}
