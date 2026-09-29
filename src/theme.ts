import { createTheme } from "@mui/material/styles";

export const colors = {
  primary: "#0E7A4B",
  dark: "#075C39",
  bright: "#19A76A",
  soft: "#EAF8F0",
  greenBorder: "#C7EBD7",
  background: "#F4F7F5",
  surface: "#FFFFFF",
  text: "#11231A",
  secondary: "#5E6F66",
  muted: "#8A9991",
  border: "#DDE6E1",
  subtle: "#EEF3F0",
  sidebar: "#081711",
  sidebarSurface: "#10251B",
  sidebarText: "#E7F2EC",
  sidebarMuted: "#8DA99A",
  success: "#138A55",
  warning: "#D98C10",
  error: "#D33F3F",
  info: "#3478D4",
};

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: colors.primary, dark: colors.dark, light: colors.bright },
    background: { default: colors.background, paper: colors.surface },
    text: { primary: colors.text, secondary: colors.secondary },
    divider: colors.border,
    success: { main: colors.success },
    warning: { main: colors.warning },
    error: { main: colors.error },
    info: { main: colors.info },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily:
      "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: 31,
      lineHeight: 1.18,
      fontWeight: 700,
      letterSpacing: "-.9px",
    },
    h2: {
      fontSize: 18,
      lineHeight: 1.3,
      fontWeight: 700,
      letterSpacing: "-.35px",
    },
    h3: { fontSize: 15, lineHeight: 1.4, fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 650, letterSpacing: "-.1px" },
    body1: { lineHeight: 1.65 },
    body2: { fontSize: 13, lineHeight: 1.55 },
    caption: { fontSize: 12, lineHeight: 1.5 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: colors.background, color: colors.text },
        "::selection": { background: "#CFEEDF", color: colors.dark },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: "contained" },
      styleOverrides: {
        root: {
          borderRadius: 10,
          minHeight: 42,
          paddingInline: 17,
          boxShadow: "none",
          transition:
            "transform .16s ease, box-shadow .16s ease, background-color .16s ease",
          "&:active": { transform: "translateY(1px)" },
        },
        containedPrimary: {
          background: colors.primary,
          boxShadow: "0 8px 20px rgba(14, 122, 75, .16)",
          "&:hover": {
            background: colors.dark,
            boxShadow: "0 10px 25px rgba(14, 122, 75, .22)",
          },
        },
        outlined: {
          borderColor: colors.border,
          color: colors.text,
          background: colors.surface,
          "&:hover": { borderColor: "#B8C9C0", background: "#FAFCFB" },
        },
        text: {
          color: colors.secondary,
          "&:hover": { background: colors.soft, color: colors.dark },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          transition: "background-color .16s ease, transform .16s ease",
          "&:active": { transform: "scale(.97)" },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          boxShadow: "0 8px 30px rgba(24, 52, 38, .05)",
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none" },
        rounded: { borderRadius: 16 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small", fullWidth: true, variant: "outlined" },
    },
    MuiInputLabel: { styleOverrides: { root: { fontSize: 13.5 } } },
    MuiInputBase: {
      styleOverrides: {
        root: { fontSize: 14, minHeight: 44 },
        input: { "&::placeholder": { color: colors.secondary, opacity: 0.62 } },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: colors.border },
        root: {
          borderRadius: 10,
          background: colors.surface,
          transition: "box-shadow .16s ease",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#B8C9C0",
          },
          "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(14,122,75,.10)" },
        },
      },
    },
    MuiTable: { styleOverrides: { root: { minWidth: 640 } } },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.subtle,
          padding: "16px 20px",
          fontSize: 13,
        },
        head: {
          background: "#F8FAF9",
          color: colors.secondary,
          fontSize: 11.5,
          fontWeight: 700,
          letterSpacing: ".25px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: { "&.MuiTableRow-hover:hover": { background: "#F8FCFA" } },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontSize: 11.5, fontWeight: 650, height: 27, borderRadius: 7 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid transparent",
          alignItems: "center",
        },
        standardError: {
          borderColor: "#F4CBCB",
          background: "#FFF4F4",
          color: "#8E2626",
        },
        standardSuccess: {
          borderColor: colors.greenBorder,
          background: "#F0FAF4",
          color: colors.dark,
        },
      },
    },
    MuiDialog: {
      defaultProps: { fullWidth: true, maxWidth: "sm" },
      styleOverrides: {
        paper: {
          border: `1px solid ${colors.border}`,
          maxHeight: "calc(100dvh - 32px)",
          boxShadow: "0 28px 80px rgba(8,23,17,.18)",
        },
      },
    },
    MuiDrawer: { styleOverrides: { paper: { borderRadius: 0 } } },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: `1px solid ${colors.border}`,
          boxShadow: "0 16px 40px rgba(17,35,26,.12)",
          borderRadius: 12,
          maxHeight: 340,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { fontSize: 12, borderRadius: 7, background: colors.text },
      },
    },
    MuiPagination: { defaultProps: { shape: "rounded", color: "primary" } },
    MuiPaginationItem: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 46 },
        indicator: { height: 3, borderRadius: 3 },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", minHeight: 46, fontWeight: 650 },
      },
    },
    MuiStepper: { styleOverrides: { root: { padding: "20px 0" } } },
    MuiSwitch: { defaultProps: { color: "primary" } },
    MuiCheckbox: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { color: "#72857A" } },
    },
    MuiSkeleton: {
      styleOverrides: { root: { borderRadius: 8, background: "#E8EFEB" } },
    },
  },
});
