import { useState, type MouseEvent } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import MenuOutlined from "@mui/icons-material/MenuOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import WestOutlined from "@mui/icons-material/WestOutlined";
import EastOutlined from "@mui/icons-material/EastOutlined";
import AddOutlined from "@mui/icons-material/AddOutlined";
import AddCircleOutlineOutlined from "@mui/icons-material/AddCircleOutlineOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import MoreVertOutlined from "@mui/icons-material/MoreVertOutlined";
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";
import avatarImg from "../assets/images/avatar_executive_user_1790806357489.jpg";

export function Brand() {
  return (
    <span className="brand">
      <GreenHaulLogo size={36} />
      <span>
        <strong>GreenHaul</strong>
        <small>Solutions</small>
      </span>
    </span>
  );
}

const navigation = [
  ["Workspace", "Dashboard", "/dashboard", DashboardOutlined],
  ["", "Campaigns", "/campaigns", SendOutlined],
  ["", "Templates", "/templates", ArticleOutlined],
  ["Audience", "Contacts", "/contacts", PeopleOutline],
  ["", "Contact Lists", "/contact-lists", FolderOutlined],
  ["Manage", "Settings", "/settings", SettingsOutlined],
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("greenhaul_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const { username, logout } = useAuth();
  const location = useLocation();

  const current =
    navigation.find(([, , path]) => location.pathname.startsWith(path))?.[1] ||
    "Workspace";

  const toggle = () => {
    const value = !collapsed;
    setCollapsed(value);
    try {
      localStorage.setItem("greenhaul_sidebar_collapsed", String(value));
    } catch {
      /* Preference storage is optional. */
    }
  };

  const displayName = username || "Stan Elorm";
  const displayEmail = username ? `${username}@greenhaul.io` : "stanelorm@gmail.com";
  const initials = (username || "SE").slice(0, 2).toUpperCase();

  const renderNavLinks = (mobile = false) => (
    <nav aria-label="Main navigation">
      {navigation.map(([section, name, path, Icon]) => (
        <div key={path}>
          {section && (
            <div className="sidebar-label">
              {!mobile && collapsed ? (
                <span className="sidebar-divider" />
              ) : (
                section
              )}
            </div>
          )}
          <Tooltip
            title={!mobile && collapsed ? name : ""}
            placement="right"
            arrow
          >
            <NavLink
              aria-label={name}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              to={path}
              onClick={() => setOpen(false)}
            >
              <span className="active-indicator-bar" />
              <div className="nav-icon-wrap">
                <Icon fontSize="small" />
                <span className="active-dot" />
              </div>
              {(mobile || !collapsed) && (
                <>
                  <span>{name}</span>
                  <EastOutlined
                    className="nav-arrow"
                    sx={{ fontSize: 14 }}
                  />
                </>
              )}
            </NavLink>
          </Tooltip>
        </div>
      ))}
    </nav>
  );

  const sidebar = (mobile = false) => (
    <div className={`sidebar ${!mobile && collapsed ? "collapsed" : ""}`}>
      {mobile && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px 16px" }}>
          <Brand />
          <IconButton
            className="drawer-close"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            sx={{ color: "#fff" }}
          >
            <CloseOutlined />
          </IconButton>
        </div>
      )}

      {/* Collapse Toggle Bar at the very TOP of the sidebar */}
      {!mobile && (
        <div className={`sidebar-header-bar ${collapsed ? "collapsed" : ""}`}>
          {!collapsed && (
            <span className="sidebar-section-title">Navigation</span>
          )}
          <IconButton
            size="small"
            className="sidebar-collapse-btn"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggle}
          >
            {collapsed ? (
              <EastOutlined sx={{ fontSize: 16 }} />
            ) : (
              <WestOutlined sx={{ fontSize: 16 }} />
            )}
          </IconButton>
        </div>
      )}

      {renderNavLinks(mobile)}

      {/* Modern User Profile Card at bottom of sidebar */}
      <div className="sidebar-user-footer">
        {!mobile && collapsed ? (
          <Tooltip title={`${displayName} · Profile & Menu`} placement="right" arrow>
            <button
              type="button"
              className="sidebar-user-btn"
              onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
              aria-label="User account menu"
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#10b981",
                    color: "#10b981",
                    boxShadow: "0 0 0 2px #0f2e2b",
                    width: 8,
                    height: 8,
                  },
                }}
              >
                <Avatar
                  src={avatarImg}
                  alt={displayName}
                  sx={{
                    width: 38,
                    height: 38,
                    border: "1.5px solid #10b981",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </Badge>
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            className="sidebar-user-btn"
            onClick={(event: MouseEvent<HTMLElement>) => setAnchor(event.currentTarget)}
            aria-label="User account menu"
          >
            <div className="sidebar-user-avatar">
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#10b981",
                    color: "#10b981",
                    boxShadow: "0 0 0 2px #0f2e2b",
                    width: 8,
                    height: 8,
                  },
                }}
              >
                <Avatar
                  src={avatarImg}
                  alt={displayName}
                  sx={{
                    width: 36,
                    height: 36,
                    border: "1.5px solid #10b981",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </Badge>
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName}</div>
              <div className="sidebar-user-role">Campaign Lead</div>
            </div>
            <MoreVertOutlined sx={{ fontSize: 17, color: "#8dafa8" }} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {/* Topbar: Spans full width, brand is permanently at top left */}
      <header className="topbar">
        <div className="topbar-left">
          <IconButton
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            size="small"
          >
            <MenuOutlined />
          </IconButton>
          <Link
            to="/dashboard"
            className="topbar-brand-link"
            aria-label="GreenHaul Solutions dashboard"
          >
            <Brand />
          </Link>
          <span className="topbar-divider" />
          <span className="topbar-workspace">Workspace</span>
          <span className="topbar-slash">/</span>
          <span className="context-title">{current}</span>
        </div>

        <div className="topbar-right">
          <Button
            component={Link}
            to="/campaigns/create"
            variant="contained"
            startIcon={<AddOutlined />}
            className="topbar-create"
          >
            New campaign
          </Button>

          <Tooltip title={`${displayName} · Account`}>
            <IconButton
              aria-label="User account menu"
              aria-controls={anchor ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={!!anchor}
              onClick={(event: MouseEvent<HTMLElement>) =>
                setAnchor(event.currentTarget)
              }
              sx={{ p: 0.5 }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#10b981",
                    color: "#10b981",
                    boxShadow: "0 0 0 2px #fff",
                    width: 9,
                    height: 9,
                  },
                }}
              >
                <Avatar
                  src={avatarImg}
                  alt={displayName}
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "#14805e",
                    color: "#ffffff",
                    border: "1.5px solid #10b981",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </Badge>
            </IconButton>
          </Tooltip>
        </div>
      </header>

      {/* Sidebar: Sits under topbar */}
      <aside className="desktop-sidebar">{sidebar()}</aside>

      {/* Mobile Drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280, maxWidth: "90vw" } } }}
      >
        {sidebar(true)}
      </Drawer>

      {/* Exquisite Account Popover Menu */}
      <Menu
        id="account-menu"
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            className: "account-popover-paper",
            elevation: 8,
          },
        }}
      >
        <div className="account-popover-header">
          <Avatar
            src={avatarImg}
            alt={displayName}
            sx={{
              width: 44,
              height: 44,
              border: "2px solid #10b981",
              fontSize: 15,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
          <div className="account-popover-details">
            <div className="account-popover-name">{displayName}</div>
            <div className="account-popover-email">{displayEmail}</div>
            <span className="account-popover-badge">Workspace Owner</span>
          </div>
        </div>

        <div className="account-popover-metric">
          <span>Deliverability health</span>
          <strong>99.4% · Excellent</strong>
        </div>

        <MenuItem
          component={Link}
          to="/campaigns/create"
          onClick={() => setAnchor(null)}
          className="account-popover-item"
        >
          <AddCircleOutlineOutlined sx={{ fontSize: 18, color: "#14805e" }} />
          <span>New campaign</span>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/templates"
          onClick={() => setAnchor(null)}
          className="account-popover-item"
        >
          <ArticleOutlined sx={{ fontSize: 18, color: "#64748b" }} />
          <span>Templates</span>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/settings"
          onClick={() => setAnchor(null)}
          className="account-popover-item"
        >
          <SettingsOutlined sx={{ fontSize: 18, color: "#64748b" }} />
          <span>Settings</span>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setAnchor(null);
            logout();
          }}
          className="account-popover-item account-popover-logout"
          aria-label="Sign out"
        >
          <LogoutOutlined sx={{ fontSize: 18 }} />
          <span>Sign out</span>
        </MenuItem>
      </Menu>

      {/* Main Workspace */}
      <div className="workspace">
        <main id="main" className="page" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `mobile-bottom-item${isActive ? " active" : ""}`
          }
        >
          <DashboardOutlined sx={{ fontSize: 20 }} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/campaigns"
          className={({ isActive }) =>
            `mobile-bottom-item${isActive ? " active" : ""}`
          }
        >
          <SendOutlined sx={{ fontSize: 20 }} />
          <span>Campaigns</span>
        </NavLink>
        <NavLink
          to="/contacts"
          className={({ isActive }) =>
            `mobile-bottom-item${isActive ? " active" : ""}`
          }
        >
          <PeopleOutline sx={{ fontSize: 20 }} />
          <span>Contacts</span>
        </NavLink>
        <NavLink
          to="/templates"
          className={({ isActive }) =>
            `mobile-bottom-item${isActive ? " active" : ""}`
          }
        >
          <ArticleOutlined sx={{ fontSize: 20 }} />
          <span>Templates</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `mobile-bottom-item${isActive ? " active" : ""}`
          }
        >
          <SettingsOutlined sx={{ fontSize: 20 }} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
