import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Button as MuiButton,
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
import { GreenHaulLogo } from "../components/Logo";

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
    <div className="login-minimal-shell">
      {/* Ambient background decoration */}
      <div className="login-bg-dots" aria-hidden="true" />
      <div className="login-bg-glow" aria-hidden="true" />

      {/* Centered Minimal Card */}
      <div className="login-minimal-card">
        {/* Brand Logo & Name */}
        <div className="login-minimal-brand">
          <div className="logo-frame">
            <GreenHaulLogo
              size={56}
              style={{
                borderRadius: 14,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
          <span className="login-brand-tag">GREENHAUL SOLUTIONS</span>
        </div>

        {/* Heading */}
        <div className="login-minimal-header">
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 24, sm: 27 },
              fontWeight: 750,
              letterSpacing: "-0.7px",
              color: "#081E14",
              textAlign: "center",
            }}
          >
            Welcome back
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              mt: 0.8,
              fontSize: 13.5,
              textAlign: "center",
              lineHeight: 1.5,
            }}
          >
            Sign in to continue to your campaign workspace.
          </Typography>
        </div>

        {/* Form */}
        <form
          noValidate
          onSubmit={handleSubmit(async (values) => {
            setError("");
            try {
              await login(values.username, values.password);
              handleSuccessfulAuth();
            } catch (e) {
              setError(normalizeError(e).message);
            }
          })}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2.2, borderRadius: 2 }}>
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
                      <PersonOutline sx={{ color: "#7A9285", fontSize: 19 }} />
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
                      <LockOutlined sx={{ color: "#7A9285", fontSize: 19 }} />
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
            loading={isSubmitting}
            endIcon={<ArrowForwardOutlined sx={{ fontSize: 17 }} />}
            sx={{
              mt: 1.2,
              minHeight: 48,
              fontSize: 14.5,
              fontWeight: 700,
              borderRadius: "12px",
              boxShadow: "0 8px 24px rgba(14, 122, 75, 0.22)",
            }}
          >
            Sign in
          </MuiButton>
        </form>

        {/* Minimal Footer */}
        <div className="login-minimal-foot">
          <Typography
            variant="caption"
            sx={{
              display: "block",
              textAlign: "center",
              color: "#83978c",
              fontSize: 11.5,
            }}
          >
            GreenHaul Solutions · Secure Campaign Operations
          </Typography>
        </div>
      </div>
    </div>
  );
}
