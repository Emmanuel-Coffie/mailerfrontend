import { useState } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  Avatar,
  Button as MuiButton,
  Drawer,
  IconButton,
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
import MailOutline from "@mui/icons-material/MailOutline";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";

export function Brand() {
  return (
    <div className="brand" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <GreenHaulLogo
        size={28}
        style={{
          borderRadius: 7,
          boxShadow: "0 2px 8px rgba(14, 122, 75, 0.2)",
          flexShrink: 0,
        }}
      />
      <span style={{ fontWeight: 750, letterSpacing: "-0.4px" }}>GreenHaul Solutions</span>
    </div>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
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
    "GreenHaul Solutions";
  const initials = username.slice(0, 2).toUpperCase();

  const sidebar = (
    <div className="sidebar">
      <div className="sidebar-brand-wrap">
        <Link
          to="/dashboard"
          onClick={() => setOpen(false)}
          aria-label="GreenHaul Solutions dashboard"
        >
          <Brand />
        </Link>
        <span className="brand-subtitle">Campaign management</span>
      </div>
      <nav aria-label="Main navigation">
        {nav.map(([section, name, path, Icon]) => (
          <div key={path}>
            {section && <div className="sidebar-label">{section}</div>}
            <NavLink
              className={({ isActive }) =>
                "nav-link" + (isActive ? " active" : "")
              }
              to={path}
              onClick={() => setOpen(false)}
            >
              <Icon sx={{ fontSize: 19 }} />
              <span>{name}</span>
            </NavLink>
          </div>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="sidebar-system-pill">
          <span className="system-status-dot" />
          <span>GreenHaul Engine v2.4</span>
        </div>
        <div style={{ fontSize: 11, lineHeight: 1.5, color: "#6A8B7A", marginTop: 8 }}>
          Precision audience, templates, and delivery telemetry.
        </div>
      </div>
    </div>
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Drawer
        variant="permanent"
        className="desktop-sidebar"
        sx={{
          "& .MuiDrawer-paper": {
            width: 264,
            border: 0,
            height: "100%",
            overflowY: "auto",
          },
        }}
      >
        {sidebar}
      </Drawer>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 272,
            height: "100%",
            overflowY: "auto",
          },
        }}
      >
        {sidebar}
      </Drawer>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-context">
            <IconButton
              className="mobile-menu"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
            >
              <MenuOutlined />
            </IconButton>
            <span className="context-kicker">Workspace /</span>
            <span className="context-title">{current}</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="topbar-live-badge">
              <span className="pulse-dot" />
              <span>Engine Active</span>
            </div>
            <MuiButton
              component={Link}
              to="/campaigns/create"
              size="small"
              variant="contained"
              startIcon={<SendOutlined sx={{ fontSize: 15 }} />}
              sx={{
                fontSize: 12.5,
                fontWeight: 650,
                minHeight: 36,
                display: { xs: "none", sm: "inline-flex" },
              }}
            >
              New Campaign
            </MuiButton>

            <div className="topbar-user">
              <Avatar
                sx={{
                  width: 31,
                  height: 31,
                  bgcolor: "#EAF8F0",
                  color: "#075C39",
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 650,
                  display: { xs: "none", sm: "block" },
                  maxWidth: 140,
                }}
                noWrap
              >
                {username}
              </Typography>
              <MuiButton
                variant="text"
                size="small"
                startIcon={<LogoutOutlined />}
                onClick={logout}
                aria-label="Sign out"
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
