import { useState, type ElementType, type MouseEvent } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
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
import KeyboardArrowRightOutlined from "@mui/icons-material/KeyboardArrowRightOutlined";
import { useAuth } from "../auth";
import { GreenHaulLogo } from "./Logo";
import avatarImg from "../assets/images/brother_kojo_avatar_1790812971674.jpg";

interface NavItem {
  name: string;
  path: string;
  Icon: ElementType;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navigationSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Dashboard", path: "/dashboard", Icon: DashboardOutlined },
      { name: "Campaigns", path: "/campaigns", Icon: SendOutlined },
      { name: "Templates", path: "/templates", Icon: ArticleOutlined },
    ],
  },
  {
    title: "Audience",
    items: [
      { name: "Contacts", path: "/contacts", Icon: PeopleOutline },
      { name: "Contact Lists", path: "/contact-lists", Icon: FolderOutlined },
    ],
  },
  {
    title: "System",
    items: [{ name: "Settings", path: "/settings", Icon: SettingsOutlined }],
  },
];

const layoutStyles = String.raw`
  :root {
    --gh-deep: #123d33;
    --gh-deeper: #0f332b;
    --gh-accent: #178a64;
    --gh-accent-bright: #3bc692;
    --gh-accent-soft: #eaf7f1;
    --gh-bg: #f8faf9;
    --gh-surface: #ffffff;
    --gh-text: #18251f;
    --gh-muted: #74827b;
    --gh-border: #e6ece9;
    --gh-sidebar-expanded: 220px;
    --gh-sidebar-collapsed: 76px;
    --gh-topbar-height: 68px;
  }

  .gh-app-shell {
    min-height: 100dvh;
    background: var(--gh-bg);
    color: var(--gh-text);
  }

  .gh-skip-link {
    position: fixed;
    left: 16px;
    top: -80px;
    z-index: 9999;
    padding: 10px 14px;
    border-radius: 10px;
    background: #ffffff;
    color: var(--gh-deep);
    box-shadow: 0 12px 30px rgba(18, 61, 51, 0.14);
    text-decoration: none;
  }

  .gh-skip-link:focus {
    top: 16px;
  }

  .gh-desktop-sidebar {
    position: fixed;
    inset: 0 auto 0 0;
    width: var(--gh-sidebar-expanded);
    z-index: 1200;
    background: linear-gradient(180deg, var(--gh-deep) 0%, var(--gh-deeper) 100%);
    transition: width 180ms ease;
  }

  .gh-app-shell.gh-is-collapsed .gh-desktop-sidebar {
    width: var(--gh-sidebar-collapsed);
  }

  .gh-sidebar {
    min-height: 100%;
    display: flex;
    flex-direction: column;
    padding: 17px 13px 14px;
    color: #eef8f3;
  }

  .gh-sidebar.gh-collapsed {
    padding-inline: 10px;
  }

  .gh-sidebar-brand-row {
    min-height: 52px;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px 14px;
  }

  .gh-sidebar.gh-collapsed .gh-sidebar-brand-row {
    justify-content: center;
    padding-inline: 0;
  }

  .gh-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    color: inherit;
    text-decoration: none;
  }

  .gh-brand-copy {
    min-width: 0;
  }

  .gh-brand-copy strong {
    display: block;
    color: #ffffff;
    font-size: 14px;
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  .gh-brand-copy small {
    display: block;
    margin-top: 3px;
    color: #a6c5b9;
    font-size: 10px;
    line-height: 1.1;
  }

  .gh-sidebar-collapse {
    margin-left: auto !important;
    width: 30px !important;
    height: 30px !important;
    border: 1px solid rgba(255,255,255,.10) !important;
    color: #aac8bd !important;
    background: rgba(255,255,255,.04) !important;
  }

  .gh-sidebar-collapse:hover {
    color: #ffffff !important;
    background: rgba(255,255,255,.08) !important;
  }

  .gh-sidebar.gh-collapsed .gh-sidebar-collapse {
    position: absolute;
    top: 70px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0 !important;
  }

  .gh-sidebar-nav {
    margin-top: 2px;
  }

  .gh-sidebar-section {
    margin-top: 9px;
  }

  .gh-sidebar-section:first-child {
    margin-top: 0;
  }

  .gh-sidebar-label {
    padding: 10px 10px 7px;
    color: #78a395;
    font-size: 9px;
    line-height: 1;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
  }

  .gh-sidebar-divider {
    height: 1px;
    margin: 12px 10px 8px;
    background: rgba(255,255,255,.08);
  }

  .gh-sidebar-items {
    display: grid;
    gap: 4px;
  }

  .gh-nav-link {
    position: relative;
    min-height: 43px;
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 0 11px;
    border-radius: 11px;
    color: #c6dcd3;
    text-decoration: none;
    font-size: 12px;
    font-weight: 540;
    transition: color 160ms ease, background-color 160ms ease, transform 160ms ease;
  }

  .gh-nav-link:hover {
    color: #ffffff;
    background: rgba(255,255,255,.055);
  }

  .gh-nav-link:active {
    transform: translateY(1px);
  }

  .gh-nav-link.gh-active {
    color: #ffffff;
    background: rgba(255,255,255,.10);
    font-weight: 700;
  }

  .gh-nav-link.gh-active::before {
    content: "";
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 3px;
    border-radius: 999px;
    background: var(--gh-accent-bright);
  }

  .gh-nav-icon {
    width: 22px;
    height: 22px;
    display: grid;
    place-items: center;
    flex: 0 0 22px;
  }

  .gh-nav-text {
    min-width: 0;
    flex: 1;
    white-space: nowrap;
  }

  .gh-nav-chevron {
    opacity: 0;
    transform: translateX(-3px);
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .gh-nav-link:hover .gh-nav-chevron,
  .gh-nav-link.gh-active .gh-nav-chevron {
    opacity: .72;
    transform: translateX(0);
  }

  .gh-sidebar.gh-collapsed .gh-sidebar-label,
  .gh-sidebar.gh-collapsed .gh-nav-text,
  .gh-sidebar.gh-collapsed .gh-nav-chevron,
  .gh-sidebar.gh-collapsed .gh-brand-copy {
    display: none;
  }

  .gh-sidebar.gh-collapsed .gh-nav-link {
    justify-content: center;
    padding-inline: 0;
  }

  .gh-sidebar.gh-collapsed .gh-nav-link.gh-active::before {
    left: -1px;
  }

  .gh-sidebar-user {
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid rgba(255,255,255,.09);
  }

  .gh-sidebar-user-button {
    width: 100%;
    min-height: 54px;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    border-radius: 12px;
    padding: 7px 8px;
    color: #ffffff;
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background-color 160ms ease;
  }

  .gh-sidebar-user-button:hover {
    background: rgba(255,255,255,.055);
  }

  .gh-sidebar-user-info {
    min-width: 0;
    flex: 1;
  }

  .gh-sidebar-user-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    font-weight: 700;
  }

  .gh-sidebar-user-role {
    margin-top: 3px;
    color: #93b4a8;
    font-size: 9px;
  }

  .gh-sidebar.gh-collapsed .gh-sidebar-user-button {
    justify-content: center;
    padding-inline: 0;
  }

  .gh-sidebar.gh-collapsed .gh-sidebar-user-info,
  .gh-sidebar.gh-collapsed .gh-sidebar-more {
    display: none;
  }

  .gh-workspace {
    min-height: 100dvh;
    margin-left: var(--gh-sidebar-expanded);
    transition: margin-left 180ms ease;
  }

  .gh-app-shell.gh-is-collapsed .gh-workspace {
    margin-left: var(--gh-sidebar-collapsed);
  }

  .gh-topbar {
    position: sticky;
    top: 0;
    z-index: 1100;
    height: var(--gh-topbar-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 0 24px;
    border-bottom: 1px solid var(--gh-border);
    background: rgba(255,255,255,.94);
    backdrop-filter: blur(16px);
  }

  .gh-topbar-left,
  .gh-topbar-right {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .gh-topbar-left {
    gap: 11px;
  }

  .gh-topbar-right {
    gap: 10px;
  }

  .gh-mobile-menu,
  .gh-mobile-brand {
    display: none !important;
  }

  .gh-breadcrumb {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #89968f;
    font-size: 12px;
    white-space: nowrap;
  }

  .gh-breadcrumb-separator {
    color: #c2cbc6;
  }

  .gh-breadcrumb-current {
    overflow: hidden;
    text-overflow: ellipsis;
    color: #1e2b25;
    font-weight: 720;
  }

  .gh-create-button.MuiButton-root {
    min-height: 40px;
    border-radius: 10px;
    padding-inline: 15px;
    background: #176d52;
    box-shadow: 0 6px 16px rgba(23,109,82,.15);
    font-size: 12px;
    font-weight: 760;
    text-transform: none;
  }

  .gh-create-button.MuiButton-root:hover {
    background: #135f47;
    box-shadow: 0 7px 18px rgba(23,109,82,.20);
  }

  .gh-create-button.MuiButton-root:active {
    transform: translateY(1px);
  }

  .gh-top-avatar-button.MuiIconButton-root {
    padding: 2px;
  }

  .gh-page {
    min-width: 0;
    max-width: 1480px;
    margin: 0 auto;
    padding: 28px 30px 40px;
    outline: none;
  }

  .gh-mobile-bottom-nav {
    display: none;
  }

  .gh-account-paper.MuiPaper-root {
    width: 292px;
    overflow: hidden;
    margin-top: 9px;
    border: 1px solid var(--gh-border);
    border-radius: 14px;
    box-shadow: 0 20px 55px rgba(26,53,43,.16);
  }

  .gh-account-header {
    display: flex;
    gap: 11px;
    padding: 14px 15px 12px;
  }

  .gh-account-details {
    min-width: 0;
  }

  .gh-account-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #1e2a24;
    font-size: 12px;
    font-weight: 760;
  }

  .gh-account-email {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: 2px;
    color: #7b8982;
    font-size: 10px;
  }

  .gh-account-badge {
    display: inline-flex;
    margin-top: 6px;
    padding: 4px 7px;
    border-radius: 999px;
    background: var(--gh-accent-soft);
    color: #176d52;
    font-size: 9px;
    font-weight: 740;
  }

  .gh-account-health {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 0 12px 7px;
    padding: 9px 10px;
    border-radius: 10px;
    background: #f7faf8;
    color: #73817a;
    font-size: 10px;
  }

  .gh-account-health strong {
    color: #167153;
    font-size: 10px;
  }

  .gh-account-item.MuiMenuItem-root {
    min-height: 42px;
    gap: 10px;
    padding: 8px 14px;
    color: #36443d;
    font-size: 11px;
  }

  .gh-account-item.MuiMenuItem-root:hover {
    background: #f6f9f7;
  }

  .gh-account-logout.MuiMenuItem-root {
    color: #aa3c3c;
  }

  @media (max-width: 900px) {
    .gh-desktop-sidebar {
      display: none;
    }

    .gh-workspace,
    .gh-app-shell.gh-is-collapsed .gh-workspace {
      margin-left: 0;
    }

    .gh-mobile-menu,
    .gh-mobile-brand {
      display: inline-flex !important;
    }

    .gh-mobile-brand {
      align-items: center;
      color: var(--gh-deep);
      text-decoration: none;
    }

    .gh-breadcrumb-workspace,
    .gh-breadcrumb-separator {
      display: none;
    }

    .gh-topbar {
      padding: 0 14px;
    }

    .gh-page {
      padding: 22px 16px 92px;
    }

    .gh-mobile-bottom-nav {
      position: fixed;
      left: 10px;
      right: 10px;
      bottom: 10px;
      z-index: 1250;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      min-height: 62px;
      padding: 6px;
      border: 1px solid rgba(224,233,228,.94);
      border-radius: 16px;
      background: rgba(255,255,255,.95);
      box-shadow: 0 14px 40px rgba(31,62,50,.16);
      backdrop-filter: blur(16px);
    }

    .gh-mobile-bottom-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      min-width: 0;
      border-radius: 10px;
      color: #798780;
      text-decoration: none;
      font-size: 8px;
      font-weight: 650;
    }

    .gh-mobile-bottom-item.gh-active {
      color: #176d52;
      background: #eef7f3;
    }
  }

  @media (max-width: 520px) {
    .gh-topbar {
      height: 62px;
      gap: 8px;
    }

    .gh-breadcrumb {
      display: none;
    }

    .gh-create-button.MuiButton-root {
      min-width: 40px;
      width: 40px;
      padding: 0;
    }

    .gh-create-button .MuiButton-startIcon {
      margin: 0;
    }

    .gh-create-button-label {
      display: none;
    }

    .gh-page {
      padding-inline: 12px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .gh-desktop-sidebar,
    .gh-workspace,
    .gh-nav-link,
    .gh-nav-chevron {
      transition: none !important;
    }
  }
`;

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="gh-brand">
      <GreenHaulLogo size={compact ? 31 : 36} />
      {!compact && (
        <span className="gh-brand-copy">
          <strong>GreenHaul</strong>
          <small>Mailer Workspace</small>
        </span>
      )}
    </span>
  );
}

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

  const allItems = navigationSections.flatMap((section) => section.items);
  const current =
    allItems.find((item) =>
      item.path === "/dashboard"
        ? location.pathname === "/" || location.pathname === "/dashboard"
        : location.pathname.startsWith(item.path),
    )?.name ?? "Workspace";

  const displayName = username || "Brother Kojo";
  const displayEmail = username ? `${username}@greenhaul.io` : "stanelorm@gmail.com";
  const initials = (username || "BK").slice(0, 2).toUpperCase();

  const isItemActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("greenhaul_sidebar_collapsed", String(next));
    } catch {
      // Sidebar preference storage is optional.
    }
  };

  const openAccountMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const userAvatar = (size: number, borderColor: string) => (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      variant="dot"
      sx={{
        "& .MuiBadge-badge": {
          bgcolor: "#35c98e",
          color: "#35c98e",
          boxShadow: `0 0 0 2px ${borderColor}`,
          width: 8,
          minWidth: 8,
          height: 8,
        },
      }}
    >
      <Avatar
        src={avatarImg}
        alt={displayName}
        sx={{
          width: size,
          height: size,
          border: "1.5px solid #35c98e",
          bgcolor: "#176d52",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
        }}
      >
        {initials}
      </Avatar>
    </Badge>
  );

  const renderNavigation = (mobile = false) => (
    <nav className="gh-sidebar-nav" aria-label="Main navigation">
      {navigationSections.map((section, sectionIndex) => (
        <div className="gh-sidebar-section" key={section.title}>
          {!mobile && collapsed ? (
            sectionIndex > 0 ? <div className="gh-sidebar-divider" /> : null
          ) : (
            <div className="gh-sidebar-label">{section.title}</div>
          )}

          <div className="gh-sidebar-items">
            {section.items.map(({ name, path, Icon }) => {
              const active = isItemActive(path);
              const link = (
                <NavLink
                  to={path}
                  onClick={() => setOpen(false)}
                  aria-label={name}
                  className={`gh-nav-link${active ? " gh-active" : ""}`}
                >
                  <span className="gh-nav-icon">
                    <Icon sx={{ fontSize: 19 }} />
                  </span>
                  {(mobile || !collapsed) && (
                    <>
                      <span className="gh-nav-text">{name}</span>
                      <KeyboardArrowRightOutlined
                        className="gh-nav-chevron"
                        sx={{ fontSize: 16 }}
                      />
                    </>
                  )}
                </NavLink>
              );

              if (!mobile && collapsed) {
                return (
                  <Tooltip key={path} title={name} placement="right" arrow>
                    {link}
                  </Tooltip>
                );
              }

              return <span key={path}>{link}</span>;
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const sidebar = (mobile = false) => (
    <div className={`gh-sidebar${!mobile && collapsed ? " gh-collapsed" : ""}`}>
      <div className="gh-sidebar-brand-row">
        <Link
          to="/dashboard"
          aria-label="GreenHaul Mailer dashboard"
          onClick={() => setOpen(false)}
          style={{ textDecoration: "none" }}
        >
          <Brand />
        </Link>

        {mobile ? (
          <IconButton
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            sx={{ ml: "auto", color: "#d8e9e2" }}
          >
            <CloseOutlined />
          </IconButton>
        ) : (
          <Tooltip title={collapsed ? "Expand sidebar" : "Collapse sidebar"} arrow>
            <IconButton
              className="gh-sidebar-collapse"
              size="small"
              onClick={toggleSidebar}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <EastOutlined sx={{ fontSize: 15 }} />
              ) : (
                <WestOutlined sx={{ fontSize: 15 }} />
              )}
            </IconButton>
          </Tooltip>
        )}
      </div>

      {renderNavigation(mobile)}

      <div className="gh-sidebar-user">
        {collapsed && !mobile ? (
          <Tooltip title={`${displayName} · Account`} placement="right" arrow>
            <button
              type="button"
              className="gh-sidebar-user-button"
              onClick={openAccountMenu}
              aria-label="User account menu"
            >
              {userAvatar(38, "#0f332b")}
            </button>
          </Tooltip>
        ) : (
          <button
            type="button"
            className="gh-sidebar-user-button"
            onClick={openAccountMenu}
            aria-label="User account menu"
          >
            {userAvatar(38, "#0f332b")}
            <div className="gh-sidebar-user-info">
              <div className="gh-sidebar-user-name">{displayName}</div>
              <div className="gh-sidebar-user-role">Campaign Lead</div>
            </div>
            <MoreVertOutlined
              className="gh-sidebar-more"
              sx={{ fontSize: 17, color: "#8fb2a5" }}
            />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`gh-app-shell${collapsed ? " gh-is-collapsed" : ""}`}>
      <style>{layoutStyles}</style>

      <a className="gh-skip-link" href="#main">
        Skip to content
      </a>

      <aside className="gh-desktop-sidebar" aria-label="Sidebar">
        {sidebar()}
      </aside>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 286,
              maxWidth: "88vw",
              bgcolor: "#123d33",
              color: "#eef8f3",
              overflow: "hidden",
            },
          },
        }}
      >
        {sidebar(true)}
      </Drawer>

      <div className="gh-workspace">
        <header className="gh-topbar">
          <div className="gh-topbar-left">
            <IconButton
              className="gh-mobile-menu"
              aria-label="Open navigation"
              onClick={() => setOpen(true)}
              size="small"
            >
              <MenuOutlined />
            </IconButton>

            <Link
              className="gh-mobile-brand"
              to="/dashboard"
              aria-label="GreenHaul dashboard"
            >
              <Brand compact />
            </Link>

            <div className="gh-breadcrumb" aria-label="Current page">
              <span className="gh-breadcrumb-workspace">Workspace</span>
              <span className="gh-breadcrumb-separator">/</span>
              <span className="gh-breadcrumb-current">{current}</span>
            </div>
          </div>

          <div className="gh-topbar-right">
            <Button
              component={Link}
              to="/campaigns/create"
              variant="contained"
              startIcon={<AddOutlined />}
              className="gh-create-button"
              disableElevation
            >
              <span className="gh-create-button-label">New campaign</span>
            </Button>

            <Tooltip title={`${displayName} · Account`}>
              <IconButton
                className="gh-top-avatar-button"
                aria-label="User account menu"
                aria-controls={anchor ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchor)}
                onClick={openAccountMenu}
              >
                {userAvatar(38, "#ffffff")}
              </IconButton>
            </Tooltip>
          </div>
        </header>

        <main id="main" className="gh-page" tabIndex={-1}>
          <Outlet />
        </main>
      </div>

      <Menu
        id="account-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            className: "gh-account-paper",
            elevation: 0,
          },
        }}
      >
        <div className="gh-account-header">
          {userAvatar(44, "#ffffff")}
          <div className="gh-account-details">
            <div className="gh-account-name">{displayName}</div>
            <div className="gh-account-email">{displayEmail}</div>
            <span className="gh-account-badge">Workspace Owner</span>
          </div>
        </div>

        <div className="gh-account-health">
          <span>Deliverability health</span>
          <strong>99.4% · Excellent</strong>
        </div>

        <MenuItem
          component={Link}
          to="/campaigns/create"
          onClick={() => setAnchor(null)}
          className="gh-account-item"
        >
          <AddCircleOutlineOutlined sx={{ fontSize: 18, color: "#176d52" }} />
          <span>New campaign</span>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/templates"
          onClick={() => setAnchor(null)}
          className="gh-account-item"
        >
          <ArticleOutlined sx={{ fontSize: 18, color: "#607069" }} />
          <span>Templates</span>
        </MenuItem>

        <MenuItem
          component={Link}
          to="/settings"
          onClick={() => setAnchor(null)}
          className="gh-account-item"
        >
          <SettingsOutlined sx={{ fontSize: 18, color: "#607069" }} />
          <span>Settings</span>
        </MenuItem>

        <Divider sx={{ my: 0.5 }} />

        <MenuItem
          onClick={() => {
            setAnchor(null);
            logout();
          }}
          className="gh-account-item gh-account-logout"
          aria-label="Sign out"
        >
          <LogoutOutlined sx={{ fontSize: 18 }} />
          <span>Sign out</span>
        </MenuItem>
      </Menu>

      <nav className="gh-mobile-bottom-nav" aria-label="Mobile navigation">
        {[
          { name: "Dashboard", path: "/dashboard", Icon: DashboardOutlined },
          { name: "Campaigns", path: "/campaigns", Icon: SendOutlined },
          { name: "Contacts", path: "/contacts", Icon: PeopleOutline },
          { name: "Templates", path: "/templates", Icon: ArticleOutlined },
          { name: "Settings", path: "/settings", Icon: SettingsOutlined },
        ].map(({ name, path, Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={`gh-mobile-bottom-item${isItemActive(path) ? " gh-active" : ""}`}
          >
            <Icon sx={{ fontSize: 20 }} />
            <span>{name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
