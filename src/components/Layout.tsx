import { useState, type MouseEvent } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
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
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";
export function Brand() {
  return (
    <span className="brand">
      <GreenHaulLogo size={38} />
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
  const sidebar = (mobile = false) => (
    <div className={`sidebar ${!mobile && collapsed ? "collapsed" : ""}`}>
      <Link
        to="/dashboard"
        className="sidebar-brand"
        aria-label="GreenHaul Solutions dashboard"
        onClick={() => setOpen(false)}
      >
        {!mobile && collapsed ? <GreenHaulLogo size={36} /> : <Brand />}
      </Link>
      {mobile && (
        <IconButton
          className="drawer-close"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
          sx={{ color: "#fff" }}
        >
          <CloseOutlined />
        </IconButton>
      )}
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
            <Tooltip title={!mobile && collapsed ? name : ""} placement="right">
              <span className="nav-wrapper">
                <NavLink
                  aria-label={name}
                  className={({ isActive }) =>
                    `nav-link${isActive ? " active" : ""}`
                  }
                  to={path}
                  onClick={() => setOpen(false)}
                >
                  <Icon fontSize="small" />
                  {(mobile || !collapsed) && (
                    <>
                      <span>{name}</span>
                      <EastOutlined
                        className="nav-arrow"
                        sx={{ fontSize: 15 }}
                      />
                    </>
                  )}
                </NavLink>
              </span>
            </Tooltip>
          </div>
        ))}
      </nav>
      {(mobile || !collapsed) && (
        <div className="sidebar-note">
          <ArticleOutlined />
          <strong>A better kind of email.</strong>
          <p>Make your next message feel like you.</p>
          <Link to="/templates/create" onClick={() => setOpen(false)}>
            Open the design studio <EastOutlined sx={{ fontSize: 15 }} />
          </Link>
        </div>
      )}
      <div className="sidebar-bottom">
        <span>{(mobile || !collapsed) && "Your campaign workspace"}</span>
        {!mobile && (
          <IconButton
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={toggle}
            sx={{ color: "#bfcecd" }}
          >
            {collapsed ? (
              <EastOutlined fontSize="small" />
            ) : (
              <WestOutlined fontSize="small" />
            )}
          </IconButton>
        )}
      </div>
    </div>
  );
  return (
    <div className={`app-shell ${collapsed ? "is-collapsed" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <aside className="desktop-sidebar">{sidebar()}</aside>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: 280, maxWidth: "90vw" } } }}
      >
        {sidebar(true)}
      </Drawer>
      <header className="topbar">
        <div className="topbar-left">
          <IconButton
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
          >
            <MenuOutlined />
          </IconButton>
          <span className="topbar-workspace">Campaign workspace</span>
          <span className="topbar-slash">/</span>
          <span className="context-title">{current}</span>
        </div>
        <div className="topbar-right">
          <Button
            component={Link}
            to="/campaigns/create"
            variant="outlined"
            startIcon={<AddOutlined />}
            className="topbar-create"
          >
            New campaign
          </Button>
          <Tooltip title="Account">
            <IconButton
              aria-label="User account menu"
              aria-controls={anchor ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={!!anchor}
              onClick={(event: MouseEvent<HTMLElement>) =>
                setAnchor(event.currentTarget)
              }
            >
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#e3e9e8",
                  color: "#245c58",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {(username || "GH").slice(0, 2).toUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </div>
      </header>
      <Menu
        id="account-menu"
        anchorEl={anchor}
        open={!!anchor}
        onClose={() => setAnchor(null)}
      >
        <MenuItem disabled>{username || "Workspace account"}</MenuItem>
        <MenuItem
          component={Link}
          to="/settings"
          onClick={() => setAnchor(null)}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchor(null);
            logout();
          }}
          aria-label="Sign out"
        >
          Sign out
        </MenuItem>
      </Menu>
      <div className="workspace">
        <main id="main" className="page" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
