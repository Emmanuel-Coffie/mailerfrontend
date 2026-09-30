import { createTheme } from "@mui/material/styles";
export const colors = {
  primary: "#14805e",
  dark: "#0e6349",
  bright: "#10b981",
  soft: "#eaf6f0",
  greenBorder: "#c6e3d5",
  background: "#f4f6f8",
  surface: "#ffffff",
  text: "#1e293b",
  secondary: "#64748b",
  muted: "#94a3b8",
  border: "#e2e8f0",
  subtle: "#f8fafc",
  sidebar: "#0f2e2b",
  sidebarSurface: "#164440",
  sidebarText: "#f8fafc",
  sidebarMuted: "#94a3b8",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};
export const theme = createTheme({
  palette: {
    primary: { main: colors.primary, dark: colors.dark, light: colors.bright },
    background: { default: colors.background, paper: colors.surface },
    text: { primary: colors.text, secondary: colors.secondary },
    divider: colors.border,
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    h1: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontSize: 34,
      lineHeight: 1.2,
      fontWeight: 700,
      letterSpacing: "-.03em",
    },
    h2: {
      fontFamily: "'Manrope', 'Inter', sans-serif",
      fontSize: 19,
      lineHeight: 1.4,
      fontWeight: 700,
      letterSpacing: "-.02em",
    },
    h3: { fontSize: 15, lineHeight: 1.5, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600, letterSpacing: "-.01em" },
    body1: { lineHeight: 1.65 },
    body2: { fontSize: 13, lineHeight: 1.6 },
    caption: { fontSize: 12, lineHeight: 1.6 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": Object.fromEntries(
          Object.entries(colors).map(([key, value]) => [
            `--color-${key}`,
            value,
          ]),
        ),
        body: { backgroundColor: colors.background, color: colors.text },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "contained" },
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 42,
          paddingInline: 18,
          transition: "background-color .16s ease",
          boxShadow: "none",
        },
        outlined: {
          borderColor: colors.border,
          color: colors.text,
          background: colors.surface,
          "&:hover": {
            background: colors.soft,
            borderColor: colors.greenBorder,
          },
        },
        text: { "&:hover": { background: colors.soft } },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 8, minWidth: 40, minHeight: 40 },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: 12 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          boxShadow: "none",
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true, variant: "outlined" },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: 13 } } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: 14, minHeight: 44 },
        input: { "&::placeholder": { color: colors.secondary, opacity: 1 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, background: colors.surface },
        notchedOutline: { borderColor: colors.border },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.subtle,
          padding: "17px 22px",
          fontSize: 13,
        },
        head: {
          background: "#f8fafb",
          color: colors.secondary,
          fontSize: 12,
          fontWeight: 600,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&.MuiTableRow-hover:hover": { background: "#f7faf9" } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { height: 27, borderRadius: 6, fontSize: 11.5, fontWeight: 600 },
      },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 8, alignItems: "center" } },
    },
    MuiDialog: {
      defaultProps: { fullWidth: true, maxWidth: "sm" },
      styleOverrides: {
        paper: {
          maxHeight: "calc(100dvh - 32px)",
          margin: 16,
          width: "calc(100% - 32px)",
          boxShadow: "0 24px 80px rgba(23,63,64,.18)",
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { borderRadius: 0 } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${colors.border}`,
          boxShadow: "0 12px 32px rgba(23,63,64,.12)",
          maxHeight: 340,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: 12, borderRadius: 6, background: colors.text },
      },
    },
    MuiPagination: { defaultProps: { shape: "rounded", color: "primary" } },
    MuiTabs: { styleOverrides: { indicator: { height: 2 } } },
    MuiTab: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 600 } },
    },
    MuiCheckbox: { defaultProps: { size: "small" } },
    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 6, background: colors.subtle } },
    },
  },
});
