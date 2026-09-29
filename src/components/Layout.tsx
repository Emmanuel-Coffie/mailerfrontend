import { useState, type MouseEvent } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Box,
  Button as MuiButton,
  Divider,
  Drawer,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import KeyboardArrowDownOutlined from "@mui/icons-material/KeyboardArrowDownOutlined";
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";

export function Brand() {
  return (
    <div className="brand" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <GreenHaulLogo
        size={30}
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(22, 163, 74, 0.2)",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontWeight: 800,
            fontSize: 15.5,
            letterSpacing: "-0.4px",
            color: "#11231A",
            lineHeight: 1.15,
          }}
        >
          GreenHaul
        </span>
        <span
          style={{
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.3px",
            color: "#16A34A",
            lineHeight: 1.15,
          }}
        >
          Solutions
        </span>
      </div>
    </div>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("greenhaul_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("greenhaul_sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const { username, logout } = useAuth();
  const location = useLocation();

  const nav = [
    ["OVERVIEW", "Dashboard", "/dashboard", DashboardOutlined],
    ["AUDIENCE", "Contacts", "/contacts", PeopleOutline],
    ["", "Contact Lists", "/contact-lists", FolderOutlined],
    ["CONTENT", "Templates", "/templates", ArticleOutlined],
    ["CAMPAIGNS", "Campaigns", "/campaigns", SendOutlined],
    ["SYSTEM", "Settings", "/settings", SettingsOutlined],
  ] as const;

  const current =
    nav.find(([, , path]) => location.pathname.startsWith(path))?.[1] ||
    "Workspace";
  const initials = (username || "GH").slice(0, 2).toUpperCase();

  const renderSidebarContent = (isMobile = false) => {
    const isCollapsed = !isMobile && collapsed;

    return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Navigation */}
        <nav aria-label="Main navigation" style={{ flex: 1, paddingTop: 8 }}>
          {nav.map(([section, name, path, Icon]) => {
            const linkContent = (
              <NavLink
                className={({ isActive }) =>
                  "nav-link" + (isActive ? " active" : "")
                }
                to={path}
                onClick={() => setOpen(false)}
              >
                <Icon sx={{ fontSize: 20, flexShrink: 0 }} />
                {!isCollapsed && <span className="nav-label">{name}</span>}
                {isCollapsed && <span className="collapsed-active-indicator" />}
              </NavLink>
            );

            return (
              <div key={path}>
                {section && (
                  <div className="sidebar-label">
                    {isCollapsed ? <div className="sidebar-divider" /> : section}
                  </div>
                )}
                {isCollapsed ? (
                  <Tooltip title={name} placement="right" arrow enterDelay={150}>
                    {linkContent}
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </div>
            );
          })}
        </nav>

        {/* Minimal clean footer */}
        <div className="sidebar-foot" />
      </div>
    );
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Topbar: Fixed at top across the full width, sits ABOVE sidebar */}
      <header className="topbar">
        <div className="topbar-left">
          {/* Mobile menu hamburger */}
          <IconButton
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            size="small"
            sx={{
              display: { xs: "inline-flex", md: "none" },
              color: "#557264",
              mr: 1,
            }}
          >
            <MenuOutlined />
          </IconButton>

          {/* Logo & Brand Name: Fixed in topbar so they never retract */}
          <Link
            to="/dashboard"
            className="topbar-brand-link"
            aria-label="GreenHaul Solutions dashboard"
          >
            <Brand />
          </Link>

          {/* Sidebar collapse/expand toggle on desktop */}
          <Tooltip
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            placement="bottom"
            arrow
          >
            <IconButton
              size="small"
              onClick={toggleCollapsed}
              className="sidebar-toggle-btn"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                ml: 2,
                color: "#557264",
                border: "1px solid #DDE6E1",
                borderRadius: "8px",
                bgcolor: "#F8FAF9",
                width: 30,
                height: 30,
                "&:hover": {
                  color: "#16A34A",
                  borderColor: "#BBF7D0",
                  bgcolor: "#F0FDF4",
                },
              }}
            >
              {collapsed ? (
                <ChevronRightOutlined sx={{ fontSize: 17 }} />
              ) : (
                <ChevronLeftOutlined sx={{ fontSize: 17 }} />
              )}
            </IconButton>
          </Tooltip>

          <div className="topbar-divider" />

          {/* Breadcrumb section context */}
          <div className="topbar-context">
            <span className="context-kicker">Workspace /</span>
            <span className="context-title">{current}</span>
          </div>
        </div>

        <div className="topbar-right">
          <MuiButton
            component={Link}
            to="/campaigns/create"
            size="small"
            variant="contained"
            startIcon={<SendOutlined sx={{ fontSize: 15 }} />}
            sx={{
              fontSize: 12.5,
              fontWeight: 700,
              minHeight: 36,
              px: 2,
              borderRadius: "10px",
              display: { xs: "none", sm: "inline-flex" },
              boxShadow: "0 4px 14px rgba(22, 163, 74, 0.22)",
            }}
          >
            New Campaign
          </MuiButton>

          {/* Avatar Profile & Sign out Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Profile & account">
              <IconButton
                onClick={handleOpenUserMenu}
                aria-label="User account menu"
                aria-controls={Boolean(anchorElUser) ? "account-menu" : undefined}
                aria-haspopup="true"
                sx={{
                  p: 0.5,
                  border: "1px solid #DDE6E1",
                  borderRadius: "12px",
                  bgcolor: "#F8FAF9",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    borderColor: "#16A34A",
                    bgcolor: "#F0FDF4",
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "#DCFCE7",
                    color: "#15803D",
                    fontSize: 12.5,
                    fontWeight: 750,
                    border: "1px solid #86EFAC",
                  }}
                >
                  {initials}
                </Avatar>
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    flexDirection: "column",
                    alignItems: "flex-start",
                    ml: 1,
                    mr: 0.5,
                    textAlign: "left",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#11231A",
                      lineHeight: 1.2,
                      maxWidth: 110,
                    }}
                    noWrap
                  >
                    {username}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 10.5,
                      color: "#60796C",
                      lineHeight: 1,
                    }}
                  >
                    Administrator
                  </Typography>
                </Box>
                <KeyboardArrowDownOutlined
                  sx={{ fontSize: 16, color: "#718A7D", ml: 0.2 }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="account-menu"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1.2,
                    minWidth: 220,
                    borderRadius: "14px",
                    border: "1px solid #E2EDE7",
                    boxShadow: "0 10px 30px rgba(11, 40, 26, 0.08)",
                    p: 0.8,
                  },
                },
              }}
            >
              <Box sx={{ px: 2, py: 1.2 }}>
                <Typography
                  sx={{ fontSize: 13.5, fontWeight: 750, color: "#11231A" }}
                >
                  {username}
                </Typography>
                <Typography sx={{ fontSize: 11.5, color: "#60796C" }}>
                  Workspace Administrator
                </Typography>
              </Box>
              <Divider sx={{ my: 0.6 }} />
              <MenuItem
                component={Link}
                to="/settings"
                onClick={handleCloseUserMenu}
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#2C4639",
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#557264" }}>
                  <SettingsOutlined fontSize="small" />
                </ListItemIcon>
                Settings & Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseUserMenu();
                  logout();
                }}
                role="button"
                aria-label="Sign out"
                sx={{
                  borderRadius: "8px",
                  py: 1,
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#DC2626",
                  "&:hover": { bgcolor: "#FEF2F2" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 32, color: "#DC2626" }}>
                  <LogoutOutlined fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </Box>
        </div>
      </header>

      {/* Desktop Sidebar: Sits UNDER the topbar */}
      <Drawer
        variant="permanent"
        className="desktop-sidebar"
        sx={{
          width: collapsed ? 74 : 250,
          transition: "width 0.22s cubic-bezier(0.2, 0, 0, 1)",
          "& .MuiDrawer-paper": {
            top: "64px",
            height: "calc(100vh - 64px)",
            width: collapsed ? 74 : 250,
            borderRight: "1px solid #E2EDE7",
            backgroundColor: "#FFFFFF",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
            transition: "width 0.22s cubic-bezier(0.2, 0, 0, 1)",
            zIndex: 100,
          },
        }}
      >
        {renderSidebarContent(false)}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            top: "64px",
            height: "calc(100vh - 64px)",
            width: 260,
            backgroundColor: "#FFFFFF",
            borderRight: "1px solid #E2EDE7",
            overflowY: "auto",
            zIndex: 1300,
          },
        }}
      >
        {renderSidebarContent(true)}
      </Drawer>

      {/* Workspace Main View */}
      <div className={`workspace ${collapsed ? "collapsed" : ""}`}>
        <main id="main" className="page">
          <Outlet />
        </main>
      </div>
    </>
  );
}
