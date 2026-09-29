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
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  useEffect(() => {
    document.title = `${title} · GreenHaul Solutions`;
  }, [title]);
  return (
    <div className="page-heading">
      <div>
        <Typography variant="h1">{title}</Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </div>
      <div className="actions">{actions}</div>
    </div>
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
            ? "The server returned an unexpected error. Your saved data has not been changed."
            : !error.statusCode
              ? "Check your internet connection and confirm that the backend is running."
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
export function Empty({
  title = "No results",
  description = "Try another search or clear your filters.",
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Box sx={{ textAlign: "center", py: 7, px: 3, maxWidth: 520, mx: "auto" }}>
      <Box
        sx={{
          width: 48,
          height: 48,
          display: "grid",
          placeItems: "center",
          borderRadius: 3,
          bgcolor: "#EAF8F0",
          mx: "auto",
          mb: 1.5,
        }}
      >
        <InboxOutlined sx={{ fontSize: 25, color: "#0E7A4B" }} />
      </Box>
      <Typography variant="h2">{title}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        {description}
      </Typography>
      {action}
    </Box>
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
  const policy =
    "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; style-src 'unsafe-inline'; img-src data:;\">";
  return (
    <>
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
          No HTML content. The plain text version will be used.
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
