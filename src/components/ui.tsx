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
        p: 2.5,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 4,
        bgcolor: "background.paper",
      }}
    >
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} height={48} sx={{ mb: i === rows - 1 ? 0 : 1 }} />
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
    <Box
      aria-label="Loading table"
      aria-busy="true"
      sx={{
        border: "1px solid #dce8e1",
        borderRadius: 3.5,
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      {/* Header row */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          px: 2.5,
          py: 2,
          bgcolor: "#f6faf7",
          borderBottom: "1px solid #e2ede7",
        }}
      >
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === 0 ? "28%" : `${68 / (cols - 1)}%`}
            height={22}
          />
        ))}
      </Box>
      {/* Body rows */}
      <Box sx={{ p: 1 }}>
        {Array.from({ length: rows }, (_, r) => (
          <Box
            key={r}
            sx={{
              display: "flex",
              gap: 2,
              px: 2,
              py: 1.8,
              borderBottom: r === rows - 1 ? "none" : "1px solid #edf4f0",
              alignItems: "center",
            }}
          >
            {Array.from({ length: cols }, (_, c) => (
              <Skeleton
                key={c}
                variant={c === 0 ? "rectangular" : "text"}
                width={c === 0 ? "28%" : `${68 / (cols - 1)}%`}
                height={c === 0 ? 20 : 22}
                sx={{ borderRadius: 1 }}
              />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export function MetricSkeleton() {
  return (
    <Box
      className="panel metric-card"
      sx={{
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton variant="text" width="45%" height={22} />
        <Skeleton variant="circular" width={28} height={28} />
      </Box>
      <Skeleton
        variant="rectangular"
        width="40%"
        height={38}
        sx={{ borderRadius: 1.5 }}
      />
      <Skeleton variant="text" width="65%" height={18} />
    </Box>
  );
}

export function DashboardSkeleton() {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", gap: 3.2 }}
      aria-label="Loading dashboard"
      aria-busy="true"
    >
      {/* Executive Banner */}
      <Skeleton
        variant="rectangular"
        height={68}
        sx={{ borderRadius: 3.5, bgcolor: "rgba(7, 30, 19, 0.08)" }}
      />
      {/* 4 Metric Cards */}
      <div className="grid grid-4">
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
        <MetricSkeleton />
      </div>
      {/* Main Grid: Chart and Status Panel */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "2fr 1fr" },
          gap: 3,
        }}
      >
        <Box
          className="panel"
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Skeleton variant="text" width="40%" height={28} />
            <Skeleton
              variant="rectangular"
              width={90}
              height={32}
              sx={{ borderRadius: 2 }}
            />
          </Box>
          <Skeleton
            variant="rectangular"
            height={250}
            sx={{ borderRadius: 2 }}
          />
        </Box>
        <Box
          className="panel"
          sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <Skeleton variant="text" width="55%" height={28} />
          <Skeleton
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 2 }}
          />
          <Skeleton
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 2 }}
          />
        </Box>
      </Box>
      {/* Table Skeleton */}
      <TableSkeleton rows={5} cols={5} />
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
