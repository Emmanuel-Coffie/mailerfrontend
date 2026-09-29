import { useState } from "react";
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
import AutoGraphOutlined from "@mui/icons-material/AutoGraphOutlined";
import { Brand } from "../components/Layout";
import { useAuth } from "../auth";
import { normalizeError } from "../api/client";

const schema = z.object({
  username: z.string().min(1, "Enter your username."),
  password: z.string().min(1, "Enter your password."),
});

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  return (
    <div className="login-shell">
      <section className="login-brand">
        <Brand />
        <div className="brand-copy" style={{ position: "relative", zIndex: 1 }}>
          <div className="login-badge">
            <AutoGraphOutlined sx={{ fontSize: 16 }} />
            Campaign operations, simplified
          </div>
          <Typography
            sx={{
              fontSize: { xs: 34, md: 46 },
              lineHeight: 1.08,
              fontWeight: 680,
              letterSpacing: "-2px",
              maxWidth: 470,
            }}
          >
            Better campaigns begin with a clearer workspace.
          </Typography>
          <Typography
            sx={{ mt: 3, color: "#ACC5B8", maxWidth: 390, lineHeight: 1.8 }}
          >
            Organize contacts, build campaigns, track delivery, and understand
            engagement without unnecessary complexity.
          </Typography>
          <div
            style={{ display: "flex", gap: 8, marginTop: 42, maxWidth: 390 }}
          >
            {["Audience", "Content", "Delivery"].map((v, i) => (
              <span
                key={v}
                style={{
                  borderTop: `2px solid ${i === 0 ? "#4FD08B" : "#2C4E3B"}`,
                  paddingTop: 12,
                  flex: 1,
                  fontSize: 11.5,
                  color: "#9DB9AA",
                }}
              >
                {v}
              </span>
            ))}
          </div>
        </div>
        <Typography
          variant="caption"
          sx={{ color: "#819F90", position: "relative", zIndex: 1 }}
        >
          MailFlow · Campaign Management
        </Typography>
      </section>

      <section className="login-form">
        <div className="login-form-inner">
          <Typography variant="h1" sx={{ mb: 1 }}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Sign in to continue to your campaign workspace.
          </Typography>
          <form
            noValidate
            onSubmit={handleSubmit(async (values) => {
              setError("");
              try {
                await login(values.username, values.password);
                const from = location.state?.from;
                void navigate(
                  typeof from === "string" &&
                    from.startsWith("/") &&
                    !from.startsWith("//")
                    ? from
                    : "/dashboard",
                  { replace: true },
                );
              } catch (e) {
                setError(normalizeError(e).message);
              }
            })}
          >
            {error && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                <strong>Sign in failed.</strong> {error}
              </Alert>
            )}
            <TextField
              label="Username"
              autoComplete="username"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message || " "}
              autoFocus
            />
            <TextField
              label="Password"
              autoComplete="current-password"
              type={show ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message || " "}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={show ? "Hide password" : "Show password"}
                        onClick={() => setShow(!show)}
                      >
                        {show ? (
                          <VisibilityOffOutlined />
                        ) : (
                          <VisibilityOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <MuiButton
              type="submit"
              fullWidth
              loading={isSubmitting}
              endIcon={<ArrowForwardOutlined />}
              sx={{ mt: 2, minHeight: 46 }}
            >
              Sign in
            </MuiButton>
          </form>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
            Need access? Ask your administrator to create a staff account.
          </Typography>
        </div>
      </section>
    </div>
  );
}
