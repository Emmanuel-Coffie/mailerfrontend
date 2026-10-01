import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button as MuiButton,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlined from "@mui/icons-material/VisibilityOffOutlined";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import PersonOutline from "@mui/icons-material/PersonOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";
import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import ArticleOutlined from "@mui/icons-material/ArticleOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutline";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import VerifiedUserOutlined from "@mui/icons-material/VerifiedUserOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";

import { useAuth } from "../auth";
import { normalizeError } from "../api/client";
import { Brand } from "../components/Layout";

const schema = z.object({
  username: z.string().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

type LoginValues = z.infer<typeof schema>;

export function Login() {
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSuccessfulAuth = () => {
    const from = (location.state as { from?: unknown } | null)?.from;

    void navigate(
      typeof from === "string" &&
        from.startsWith("/") &&
        !from.startsWith("//")
        ? from
        : "/dashboard",
      { replace: true },
    );
  };

  const loading = isSubmitting || submitting;

  return (
    <>
      <style>{`
        :root {
          --gh-login-green: #18765a;
          --gh-login-green-strong: #135d47;
          --gh-login-green-soft: #e9f5ef;
          --gh-login-deep: #0d3028;
          --gh-login-deep-2: #0a251f;
          --gh-login-text: #18251f;
          --gh-login-muted: #74827b;
          --gh-login-border: #e2e9e5;
          --gh-login-surface: #fbfcfb;
        }

        .login-premium-shell,
        .login-premium-shell * {
          box-sizing: border-box;
        }

        .login-premium-shell {
          height: 100dvh;
          max-height: 100dvh;
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(370px, 0.82fr);
          background: #ffffff;
          color: var(--gh-login-text);
          overflow: hidden;
        }

        .login-premium-story {
          position: relative;
          isolation: isolate;
          height: 100%;
          max-height: 100dvh;
          overflow: hidden;
          padding: clamp(16px, 2.2vh, 24px) clamp(20px, 2.5vw, 32px);
          display: flex;
          flex-direction: column;
          color: #ffffff;
          background:
            radial-gradient(
              circle at 84% 16%,
              rgba(70, 198, 148, 0.16),
              transparent 28%
            ),
            linear-gradient(145deg, #0d3028 0%, #114b3c 52%, #0a2922 100%);
        }

        .login-premium-story::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(255, 255, 255, 0.033) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.033) 1px,
              transparent 1px
            );
          background-size: 38px 38px;
          -webkit-mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0.1)
          );
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0.1)
          );
        }

        .login-premium-story::after {
          content: "";
          position: absolute;
          z-index: -1;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          right: -160px;
          bottom: -110px;
          background: radial-gradient(
            circle,
            rgba(67, 205, 150, 0.12),
            rgba(67, 205, 150, 0)
          );
          pointer-events: none;
        }

        .login-premium-topline {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
        }

        .login-premium-topline .brand {
          color: #ffffff;
        }

        .login-premium-topline .brand strong {
          color: #ffffff;
          font-size: 16px;
        }

        .login-premium-topline .brand small {
          color: #a9cabc;
          font-size: 9.5px;
        }

        .login-workspace-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 28px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.045);
          color: #c3dbd1;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.01em;
          backdrop-filter: blur(12px);
        }

        .login-workspace-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4fd199;
          box-shadow: 0 0 0 3px rgba(79, 209, 153, 0.12);
        }

        .login-premium-copy {
          position: relative;
          z-index: 2;
          width: min(100%, 650px);
          margin-top: clamp(12px, 2.2vh, 22px);
        }

        .login-premium-kicker {
          display: inline-block;
          margin-bottom: 6px;
          color: #7fc8ab;
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .login-premium-copy h1 {
          max-width: 620px;
          margin: 0;
          font-size: clamp(24px, 2.6vw, 36px);
          line-height: 1.05;
          letter-spacing: -0.04em;
          font-weight: 790;
          text-wrap: balance;
        }

        .login-premium-copy > p {
          max-width: 520px;
          margin: 8px 0 0;
          color: #bfd4cb;
          font-size: 12px;
          line-height: 1.5;
        }

        .login-product-preview {
          position: relative;
          z-index: 2;
          margin-top: clamp(10px, 1.8vh, 18px);
          display: grid;
          grid-template-columns: 128px minmax(0, 1fr);
          gap: 10px;
          width: min(100%, 640px);
        }

        .login-preview-nav {
          padding: 10px 8px 8px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          background: rgba(3, 24, 20, 0.32);
          backdrop-filter: blur(12px);
        }

        .login-preview-nav-label {
          padding: 2px 6px 5px;
          color: #76a492;
          font-size: 7.5px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .login-preview-nav-label.audience {
          margin-top: 5px;
        }

        .login-preview-nav-item {
          display: flex;
          align-items: center;
          gap: 6px;
          min-height: 27px;
          padding: 0 7px;
          margin: 1px 0;
          border-radius: 7px;
          color: #9bbcaf;
          font-size: 8.5px;
          font-weight: 650;
        }

        .login-preview-nav-item.active {
          background: rgba(255, 255, 255, 0.09);
          color: #ffffff;
        }

        .login-preview-nav-item svg {
          font-size: 13px;
        }

        .login-preview-profile {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          padding: 8px 5px 2px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          color: #a7c0b6;
          font-size: 7.5px;
        }

        .login-preview-avatar {
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 255, 255, 0.92) 0 23%,
              transparent 24%
            ),
            linear-gradient(135deg, #cfdfd8, #6d9182);
          border: 1px solid rgba(87, 216, 165, 0.8);
          flex: 0 0 auto;
        }

        .login-preview-main {
          min-width: 0;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.11);
          background: rgba(255, 255, 255, 0.075);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.14);
          backdrop-filter: blur(15px);
        }

        .login-preview-main-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
        }

        .login-preview-main-head small {
          display: block;
          color: #91b5a7;
          font-size: 7.5px;
          font-weight: 750;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .login-preview-main-head strong {
          display: block;
          margin-top: 2px;
          font-size: 12px;
          line-height: 1.25;
        }

        .login-preview-live {
          flex: 0 0 auto;
          padding: 3px 7px;
          border-radius: 999px;
          border: 1px solid rgba(68, 211, 155, 0.18);
          background: rgba(48, 186, 133, 0.12);
          color: #a9dbc8;
          font-size: 7.5px;
          font-weight: 700;
        }

        .login-preview-metrics {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 6px;
          margin-top: 10px;
        }

        .login-preview-metric {
          min-width: 0;
          padding: 7px 8px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(5, 34, 28, 0.27);
        }

        .login-preview-metric span {
          display: block;
          color: #84aa9b;
          font-size: 7px;
        }

        .login-preview-metric strong {
          display: block;
          margin-top: 3px;
          font-size: 13px;
          letter-spacing: -0.03em;
        }

        .login-preview-metric em {
          display: block;
          margin-top: 2px;
          color: #62d4a7;
          font-size: 7px;
          font-style: normal;
        }

        .login-preview-chart-card {
          margin-top: 8px;
          padding: 8px 10px;
          border-radius: 9px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(6, 31, 26, 0.25);
        }

        .login-preview-chart-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #9ebcaf;
          font-size: 7.5px;
        }

        .login-preview-chart-head strong {
          color: #68d6ab;
          font-size: 7.5px;
          font-weight: 650;
        }

        .login-preview-bars {
          height: 46px;
          margin-top: 6px;
          display: flex;
          align-items: flex-end;
          gap: 5px;
        }

        .login-preview-bar {
          flex: 1;
          min-width: 5px;
          border-radius: 3px 3px 1px 1px;
          background: rgba(255, 255, 255, 0.13);
        }

        .login-preview-bar.highlight {
          background: linear-gradient(to top, #2d976f, #64d2a5);
        }

        .login-preview-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
          padding: 7px 9px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.055);
        }

        .login-preview-message-icon {
          width: 25px;
          height: 25px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: rgba(67, 205, 150, 0.12);
          color: #69d4aa;
        }

        .login-preview-message-copy {
          min-width: 0;
          flex: 1;
        }

        .login-preview-message-copy strong {
          display: block;
          font-size: 8.5px;
        }

        .login-preview-message-copy span {
          display: block;
          margin-top: 1px;
          color: #91b2a5;
          font-size: 7px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .login-preview-message-status {
          color: #63d2a6;
          font-size: 7px;
          font-weight: 700;
        }

        .login-premium-proof {
          position: relative;
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 12px;
          color: #91b4a6;
          font-size: 8.5px;
        }

        .login-premium-proof strong {
          color: #d7e8e1;
          font-size: 9px;
        }

        .login-premium-story-foot {
          position: relative;
          z-index: 2;
          margin-top: auto;
          padding-top: 10px;
          color: #83a99b;
          font-size: 8.5px;
          letter-spacing: 0.04em;
        }

        .login-premium-form-area {
          position: relative;
          height: 100%;
          max-height: 100dvh;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: clamp(16px, 2.5vh, 28px) clamp(20px, 3vw, 38px);
          background:
            radial-gradient(
              circle at 85% 8%,
              rgba(24, 118, 90, 0.035),
              transparent 25%
            ),
            var(--gh-login-surface);
        }

        .login-premium-form-inner {
          width: min(100%, 370px);
        }

        .login-premium-mobile-brand {
          display: none;
          margin-bottom: 24px;
        }

        .login-premium-form-kicker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
        }

        .login-premium-form-kicker span:first-child {
          color: #85938c;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .login-premium-form-kicker-line {
          width: 30px;
          height: 1px;
          background: #dce4e0;
        }

        .login-premium-title.MuiTypography-root {
          margin: 0;
          color: #17241e;
          font-size: clamp(24px, 2.4vw, 30px);
          font-weight: 780;
          letter-spacing: -0.04em;
          line-height: 1.05;
        }

        .login-premium-subtitle {
          max-width: 340px;
          margin: 6px 0 16px;
          color: #78867f;
          font-size: 11.5px;
          line-height: 1.45;
        }

        .login-premium-field-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 0 0 5px 1px;
          color: #405048;
          font-size: 9.5px;
          font-weight: 760;
        }

        .login-premium-field-label span {
          color: #9aa59f;
          font-size: 8.5px;
          font-weight: 550;
        }

        .login-premium-field {
          margin-bottom: 3px;
        }

        .login-premium-field .MuiOutlinedInput-root {
          min-height: 44px;
          border-radius: 9px;
          background: #ffffff;
          transition:
            border-color 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease;
        }

        .login-premium-field .MuiOutlinedInput-notchedOutline {
          border-color: #dce5e0;
        }

        .login-premium-field .MuiOutlinedInput-root:hover
          .MuiOutlinedInput-notchedOutline {
          border-color: #b8ccc2;
        }

        .login-premium-field .MuiOutlinedInput-root.Mui-focused {
          box-shadow: 0 0 0 3px rgba(24, 118, 90, 0.08);
        }

        .login-premium-field .MuiOutlinedInput-root.Mui-focused
          .MuiOutlinedInput-notchedOutline {
          border-width: 1px;
          border-color: #5baa8d;
        }

        .login-premium-field .MuiInputBase-input {
          padding-top: 10px;
          padding-bottom: 10px;
          font-size: 12.5px;
        }

        .login-premium-field .MuiFormHelperText-root {
          min-height: 14px;
          margin: 2px 2px 0;
          font-size: 8.5px;
        }

        .login-premium-submit.MuiButton-root {
          min-height: 44px;
          margin-top: 6px;
          border-radius: 9px;
          background: var(--gh-login-green);
          color: #ffffff;
          text-transform: none;
          font-size: 12.5px;
          font-weight: 760;
          box-shadow: 0 6px 18px rgba(24, 118, 90, 0.18);
          transition:
            transform 150ms ease,
            box-shadow 150ms ease,
            background 150ms ease;
        }

        .login-premium-submit.MuiButton-root:hover {
          background: var(--gh-login-green-strong);
          box-shadow: 0 8px 22px rgba(24, 118, 90, 0.22);
        }

        .login-premium-submit.MuiButton-root:active {
          transform: translateY(1px);
        }

        .login-premium-submit.MuiButton-root.Mui-disabled {
          background: #76a894;
          color: #ffffff;
        }

        .login-premium-submit-content {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-premium-security-divider {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 14px 0 10px;
          color: #a2ada7;
          font-size: 7.5px;
          font-weight: 650;
        }

        .login-premium-security-divider::before,
        .login-premium-security-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e4eae7;
        }

        .login-premium-trust-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        .login-premium-trust-card {
          min-width: 0;
          padding: 8px 10px;
          border-radius: 9px;
          border: 1px solid #e4eae7;
          background: #ffffff;
        }

        .login-premium-trust-card strong {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #34453d;
          font-size: 8.5px;
        }

        .login-premium-trust-card svg {
          color: #198060;
          font-size: 13px;
        }

        .login-premium-trust-card span {
          display: block;
          margin-top: 3px;
          color: #929d97;
          font-size: 7.5px;
          line-height: 1.35;
        }

        .login-premium-footnote {
          margin: 10px 0 0;
          color: #98a39d;
          font-size: 8.5px;
          line-height: 1.45;
          text-align: center;
        }

        @media (max-width: 1050px) {
          .login-premium-shell {
            grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
          }

          .login-premium-story {
            padding-left: 20px;
            padding-right: 20px;
          }

          .login-premium-copy h1 {
            font-size: clamp(22px, 3.2vw, 30px);
          }

          .login-product-preview {
            grid-template-columns: 120px minmax(0, 1fr);
          }
        }

        @media (max-width: 860px) {
          .login-premium-shell {
            grid-template-columns: 1fr;
            height: auto;
            min-height: 100dvh;
            overflow-y: auto;
          }

          .login-premium-story {
            display: none;
          }

          .login-premium-form-area {
            height: auto;
            min-height: 100dvh;
            padding: 28px 20px;
          }

          .login-premium-mobile-brand {
            display: block;
          }

          .login-premium-mobile-brand .brand strong {
            color: #183028;
          }

          .login-premium-mobile-brand .brand small {
            color: #7d8d85;
          }
        }

        @media (max-width: 430px) {
          .login-premium-form-area {
            align-items: flex-start;
            padding: 20px 16px 24px;
          }

          .login-premium-mobile-brand {
            margin-bottom: 24px;
          }

          .login-premium-trust-grid {
            grid-template-columns: 1fr;
          }

          .login-premium-subtitle {
            margin-bottom: 16px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .login-premium-shell *,
          .login-premium-shell *::before,
          .login-premium-shell *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="login-premium-shell">
        <section className="login-premium-story" aria-hidden="true">
          <div className="login-premium-topline">
            <Brand />

            <div className="login-workspace-status">
              <span className="login-workspace-status-dot" />
              <span>Workspace online</span>
            </div>
          </div>

          <div className="login-premium-copy">
            <span className="login-premium-kicker">
              Email operations, refined
            </span>

            <h1>Turn every campaign into a better conversation.</h1>

            <p>
              Plan outreach, organise contacts, monitor delivery health and
              manage every message from one focused workspace.
            </p>
          </div>

          <div className="login-product-preview">
            <aside className="login-preview-nav">
              <div className="login-preview-nav-label">Workspace</div>

              <div className="login-preview-nav-item active">
                <DashboardOutlined />
                <span>Dashboard</span>
              </div>

              <div className="login-preview-nav-item">
                <SendOutlined />
                <span>Campaigns</span>
              </div>

              <div className="login-preview-nav-item">
                <ArticleOutlined />
                <span>Templates</span>
              </div>

              <div className="login-preview-nav-label audience">
                Audience
              </div>

              <div className="login-preview-nav-item">
                <PeopleOutline />
                <span>Contacts</span>
              </div>

              <div className="login-preview-nav-item">
                <FolderOutlined />
                <span>Lists</span>
              </div>

              <div className="login-preview-profile">
                <span className="login-preview-avatar" />
                <span>Campaign workspace</span>
              </div>
            </aside>

            <div className="login-preview-main">
              <div className="login-preview-main-head">
                <div>
                  <small>Workspace preview</small>
                  <strong>Investor outreach · October</strong>
                </div>

                <span className="login-preview-live">Campaign active</span>
              </div>

              <div className="login-preview-metrics">
                <div className="login-preview-metric">
                  <span>Sent</span>
                  <strong>24.8K</strong>
                  <em>Campaign preview</em>
                </div>

                <div className="login-preview-metric">
                  <span>Delivered</span>
                  <strong>98.7%</strong>
                  <em>Healthy</em>
                </div>

                <div className="login-preview-metric">
                  <span>Open rate</span>
                  <strong>42.8%</strong>
                  <em>Overview</em>
                </div>
              </div>

              <div className="login-preview-chart-card">
                <div className="login-preview-chart-head">
                  <span>Delivery performance</span>
                  <strong>Last 7 days</strong>
                </div>

                <div className="login-preview-bars">
                  <span
                    className="login-preview-bar"
                    style={{ height: "38%" }}
                  />
                  <span
                    className="login-preview-bar"
                    style={{ height: "53%" }}
                  />
                  <span
                    className="login-preview-bar highlight"
                    style={{ height: "69%" }}
                  />
                  <span
                    className="login-preview-bar"
                    style={{ height: "57%" }}
                  />
                  <span
                    className="login-preview-bar highlight"
                    style={{ height: "87%" }}
                  />
                  <span
                    className="login-preview-bar"
                    style={{ height: "65%" }}
                  />
                  <span
                    className="login-preview-bar"
                    style={{ height: "48%" }}
                  />
                </div>
              </div>

              <div className="login-preview-message">
                <span className="login-preview-message-icon">
                  <MailOutlineOutlined sx={{ fontSize: 16 }} />
                </span>

                <span className="login-preview-message-copy">
                  <strong>Partnership introduction</strong>
                  <span>
                    Personalised message · investor segment · campaign ready
                  </span>
                </span>

                <span className="login-preview-message-status">Ready</span>
              </div>
            </div>
          </div>

          <div className="login-premium-proof">
            <span>
              <strong>Campaigns</strong> organised
            </span>
            <span>
              <strong>Audience</strong> managed
            </span>
            <span>
              <strong>Delivery</strong> monitored
            </span>
          </div>

          <div className="login-premium-story-foot">
            GreenHaul Solutions · Campaign workspace
          </div>
        </section>

        <section className="login-premium-form-area">
          <div className="login-premium-form-inner">
            <div className="login-premium-mobile-brand">
              <Brand />
            </div>

            <div className="login-premium-form-kicker">
              <span>Secure workspace access</span>
              <span className="login-premium-form-kicker-line" />
            </div>

            <Typography variant="h1" className="login-premium-title">
              Welcome back
            </Typography>

            <p className="login-premium-subtitle">
              Sign in to continue managing your campaigns, audience and delivery
              performance.
            </p>

            <form
              noValidate
              onSubmit={handleSubmit(async (values) => {
                setSubmitting(true);
                setError("");

                try {
                  await login(values.username, values.password);
                  handleSuccessfulAuth();
                } catch (e) {
                  setError(normalizeError(e).message);
                  setSubmitting(false);
                }
              })}
            >
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: "10px",
                    fontSize: 12,
                    alignItems: "center",
                  }}
                >
                  <strong>Sign in failed.</strong> {error}
                </Alert>
              )}

              <div className="login-premium-field">
                <div className="login-premium-field-label">
                  <label htmlFor="login-username">Username</label>
                  <span>Workspace ID</span>
                </div>

                <TextField
                  id="login-username"
                  autoComplete="username"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message || " "}
                  autoFocus
                  fullWidth
                  placeholder="Enter your username"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline
                            sx={{
                              color: "#18765a",
                              fontSize: 19,
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <div className="login-premium-field">
                <div className="login-premium-field-label">
                  <label htmlFor="login-password">Password</label>
                  <span>Protected</span>
                </div>

                <TextField
                  id="login-password"
                  autoComplete="current-password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message || " "}
                  fullWidth
                  placeholder="Enter your password"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{
                              color: "#18765a",
                              fontSize: 19,
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            onClick={() => setShowPassword((value) => !value)}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOffOutlined sx={{ fontSize: 18 }} />
                            ) : (
                              <VisibilityOutlined sx={{ fontSize: 18 }} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <MuiButton
                type="submit"
                fullWidth
                disabled={loading}
                aria-label="Sign in"
                className="login-premium-submit"
              >
                <span className="login-premium-submit-content">
                  {loading ? (
                    <>
                      <CircularProgress
                        size={17}
                        thickness={5}
                        sx={{ color: "#ffffff" }}
                      />
                      <span>Signing in…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowForwardOutlined sx={{ fontSize: 17 }} />
                    </>
                  )}
                </span>
              </MuiButton>
            </form>

            <div className="login-premium-security-divider">
              Workspace security
            </div>

            <div className="login-premium-trust-grid">
              <div className="login-premium-trust-card">
                <strong>
                  <VerifiedUserOutlined />
                  Protected access
                </strong>
                <span>
                  Authentication is handled through your existing workspace
                  account.
                </span>
              </div>

              <div className="login-premium-trust-card">
                <strong>
                  <ShieldOutlined />
                  Campaign ready
                </strong>
                <span>
                  Your campaigns, contacts and templates remain available after
                  sign in.
                </span>
              </div>
            </div>

            <p className="login-premium-footnote">
              Need workspace access? Contact your administrator.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
