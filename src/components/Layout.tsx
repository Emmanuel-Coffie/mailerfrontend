import { useState, useEffect } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button as MuiButton,
  Drawer,
  IconButton,
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
import MenuOpenOutlined from "@mui/icons-material/MenuOpenOutlined";
import ChevronLeftOutlined from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";

export function Brand({ collapsed = false }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="brand-collapsed" style={{ display: "grid", placeItems: "center" }}>
        <GreenHaulLogo
          size={32}
          style={{
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(7, 30, 19, 0.4)",
            flexShrink: 0,
          }}
        />
      </div>
    );
  }

  return (
    <div className="brand" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <GreenHaulLogo
        size={32}
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 12px rgba(7, 30, 19, 0.4)",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 800, fontSize: 15.5, letterSpacing: "-0.4px", color: "#FFFFFF", lineHeight: 1.2 }}>
          GreenHaul
        </span>
        <span style={{ fontWeight: 650, fontSize: 11, letterSpacing: "0.4px", color: "#4ADE80", lineHeight: 1.2 }}>
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
  const initials = username.slice(0, 2).toUpperCase();

  const renderSidebarContent = (isMobile = false) => {
    const isCollapsed = !isMobile && collapsed;

    return (
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            aria-label="GreenHaul Solutions dashboard"
            style={{ textDecoration: "none" }}
          >
            <Brand collapsed={isCollapsed} />
          </Link>

          {!isMobile && (
            <Tooltip
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              placement={isCollapsed ? "right" : "bottom"}
              arrow
            >
              <IconButton
                size="small"
                onClick={toggleCollapsed}
                className="sidebar-toggle-btn"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? (
                  <ChevronRightOutlined sx={{ fontSize: 17 }} />
                ) : (
                  <ChevronLeftOutlined sx={{ fontSize: 17 }} />
                )}
              </IconButton>
            </Tooltip>
          )}
        </div>

        {/* Navigation */}
        <nav aria-label="Main navigation" style={{ flex: 1 }}>
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
                  <Tooltip title={name} placement="right" arrow enterDelay={200}>
                    {linkContent}
                  </Tooltip>
                ) : (
                  linkContent
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-foot">
          {isCollapsed ? (
            <Tooltip title="System Active" placement="right" arrow>
              <div className="sidebar-system-dot-wrap">
                <span className="system-status-dot" />
              </div>
            </Tooltip>
          ) : (
            <>
              <div className="sidebar-system-pill">
                <span className="system-status-dot" />
                <span>System Active</span>
              </div>
              <div className="sidebar-engine-desc">
                Precision campaign workspace.
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Desktop Permanent Drawer (Collapsible) */}
      <Drawer
        variant="permanent"
        className="desktop-sidebar"
        sx={{
          width: collapsed ? 74 : 260,
          transition: "width 0.22s cubic-bezier(0.2, 0, 0, 1)",
          "& .MuiDrawer-paper": {
            width: collapsed ? 74 : 260,
            border: 0,
            backgroundColor: "#061810",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            boxSizing: "border-box",
            transition: "width 0.22s cubic-bezier(0.2, 0, 0, 1)",
          },
        }}
      >
        {renderSidebarContent(false)}
      </Drawer>

      {/* Mobile Drawer (Slide in from left) */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 270,
            height: "100%",
            backgroundColor: "#061810",
            overflowY: "auto",
          },
        }}
      >
        {renderSidebarContent(true)}
      </Drawer>

      {/* Main Workspace */}
      <div className={`workspace ${collapsed ? "collapsed" : ""}`}>
        <header className="topbar">
          <div className="topbar-context">
            {/* Mobile Hamburger Button */}
            <IconButton
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              size="small"
              sx={{
                display: { xs: "inline-flex", md: "none" },
                color: "#476254",
                mr: 0.5,
              }}
            >
              <MenuOutlined />
            </IconButton>

            <span className="context-kicker">Workspace /</span>
            <span className="context-title">{current}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="topbar-live-badge">
              <span className="pulse-dot" />
              <span>System Online</span>
            </div>

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
                boxShadow: "0 6px 18px rgba(14, 122, 75, 0.2)",
              }}
            >
              New Campaign
            </MuiButton>

            <div className="topbar-user">
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: "#EAF8F0",
                  color: "#075C39",
                  fontSize: 11.5,
                  fontWeight: 750,
                  border: "1px solid #caebd8",
                }}
              >
                {initials}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 650,
                  display: { xs: "none", sm: "block" },
                  maxWidth: 130,
                  color: "#183226",
                }}
                noWrap
              >
                {username}
              </Typography>
              <MuiButton
                variant="text"
                size="small"
                startIcon={<LogoutOutlined sx={{ fontSize: 16 }} />}
                onClick={logout}
                aria-label="Sign out"
                sx={{
                  minHeight: 32,
                  px: 1,
                  color: "#6B8477",
                  fontSize: 12,
                  "&:hover": { color: "#C0392B", bgcolor: "#FDEAEA" },
                }}
              >
                <span className="signout-label">Sign out</span>
              </MuiButton>
            </div>
          </div>
        </header>

        <main id="main" className="page">
          <Outlet />
        </main>
      </div>
    </>
  );
}
