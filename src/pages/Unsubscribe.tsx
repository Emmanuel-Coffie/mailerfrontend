import { Box, Button as MuiButton, Typography } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useParams } from "react-router-dom";
import { unsubscribeApi } from "../api/settings";
import { useResource } from "../hooks";
import { Brand } from "../components/Layout";
import { Loading, PageHeading } from "../components/ui";
export function Unsubscribe() {
  const { token = "" } = useParams();
  const preview = token === "preview";
  const state = useResource(
    () =>
      preview
        ? Promise.resolve({
            detail: "This is a test email. No subscription has been changed.",
          })
        : unsubscribeApi.get(token),
    token,
  );
  return (
    <Box className="unsubscribe-shell">
      <section className="unsubscribe-card">
        <div className="unsubscribe-brand">
          <Brand />
        </div>
        {state.loading ? (
          <Loading rows={2} />
        ) : state.error ? (
          <>
            <PageHeading
              title={
                state.error.statusCode === 404
                  ? "This link is invalid"
                  : "Unable to unsubscribe"
              }
            />
            <Typography color="text.secondary">
              {state.error.statusCode === 404
                ? "Use the unsubscribe link in your original email, or contact the sender for help."
                : state.error.message}
            </Typography>
            {state.error.statusCode !== 404 && (
              <MuiButton sx={{ mt: 3 }} onClick={state.reload}>
                Try again
              </MuiButton>
            )}
          </>
        ) : (
          <>
            <CheckCircleOutline
              sx={{ fontSize: 44, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h1">
              {preview
                ? "A preview of your preference page"
                : "You’re unsubscribed"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {state.data?.detail}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              {preview
                ? "In a delivered campaign, this link saves the recipient’s email preference."
                : "Your preference is saved. You will not receive further marketing emails from us. You can close this page."}
            </Typography>
          </>
        )}
      </section>
    </Box>
  );
}
