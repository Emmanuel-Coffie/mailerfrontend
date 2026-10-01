import { useState, useEffect } from "react";
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
import { useAuth } from "../auth";
import { normalizeError } from "../api/client";
import { Brand } from "../components/Layout";

const schema = z.object({
  username: z.string().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

export function Login() {
  const { login, authenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect immediately to dashboard
  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [authenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const handleSuccessfulAuth = () => {
    const from = location.state?.from;
    void navigate(
      typeof from === "string" && from.startsWith("/") && !from.startsWith("//")
        ? from
        : "/dashboard",
      { replace: true },
    );
  };

  return (
    <div className="login-shell">
      <section className="login-story">
        <Brand />
        <div>
          <h2>
            Thoughtful emails.
            <br />
            Lasting connections.
          </h2>
          <p>
            Your space to bring people together, share what matters, and make
            every message your own.
          </p>
          <div className="login-letter" aria-hidden="true">
            <small>GREENHAUL SOLUTIONS</small>
            <h3>
              A thoughtful hello
              <br />
              goes a long way.
            </h3>
            <p>
              Beautiful messages. Meaningful conversations.
              <br />A new chapter starts here.
            </p>
          </div>
        </div>
        <div className="login-story-foot">
          GreenHaul Solutions · Campaign workspace
        </div>
      </section>
      <section className="login-form-area">
        <div className="login-form-inner">
          <div className="login-mobile-brand">
            <Brand />
          </div>
          <div className="login-badge-pill">
            <span className="login-badge-dot" />
            <span>Campaign Workspace</span>
          </div>
          <Typography variant="h1" className="login-title">
            Welcome back
          </Typography>
          <p className="login-subtitle">
            Sign in to your workspace. Your next great conversation is waiting.
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
                setSubmitting(false);
                setError(normalizeError(e).message);
              }
            })}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                <strong>Sign in failed.</strong> {error}
              </Alert>
            )}

            <div className="form-field-group">
              <TextField
                label="Username"
                autoComplete="username"
                {...register("username")}
                error={!!errors.username}
                helperText={errors.username?.message || " "}
                autoFocus
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonOutline
                          sx={{ color: "#14805e", fontSize: 19 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="form-field-group">
              <TextField
                label="Password"
                autoComplete="current-password"
                type={show ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message || " "}
                fullWidth
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlined sx={{ color: "#14805e", fontSize: 19 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={show ? "Hide password" : "Show password"}
                          onClick={() => setShow(!show)}
                          edge="end"
                          size="small"
                        >
                          {show ? (
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
              disabled={isSubmitting || submitting}
              aria-label="Sign in"
              className={`login-submit-btn${isSubmitting || submitting ? " is-loading" : ""}`}
              sx={{
                mt: 1.2,
                minHeight: 48,
                fontSize: 14.5,
                fontWeight: 700,
                borderRadius: "12px",
                boxShadow: "0 8px 24px rgba(20, 128, 94, 0.28)",
              }}
            >
              {isSubmitting || submitting ? (
                <span className="login-btn-loading-content">
                  <CircularProgress
                    size={18}
                    thickness={5}
                    sx={{ color: "#ffffff" }}
                  />
                  <span>Signing in…</span>
                </span>
              ) : (
                <span className="login-btn-idle-content">
                  <span>Sign in</span>
                  <ArrowForwardOutlined sx={{ fontSize: 17 }} />
                </span>
              )}
            </MuiButton>
          </form>
          <div className="login-form-foot">
            <div className="login-security-tag">
              <LockOutlined sx={{ fontSize: 13, color: "#14805e" }} />
              <span>Enterprise authentication · TLS 1.3 encrypted</span>
            </div>
            <p className="login-foot-note">
              Use your workspace account to continue. Need access? Contact your
              administrator.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
