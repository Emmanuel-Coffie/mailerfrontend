import { Box, Button as MuiButton, Typography } from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { useParams } from "react-router-dom";
import { unsubscribeApi } from "../api/settings";
import { useResource } from "../hooks";
import { Brand } from "../components/Layout";
import { Loading, PageHeading } from "../components/ui";
export function Unsubscribe() {
  const { token = "" } = useParams();
  const state = useResource(() => unsubscribeApi.get(token), token);
  return (
    <Box
      sx={{ minHeight: "100dvh", display: "grid", placeItems: "center", p: 3 }}
    >
      <section
        className="panel"
        style={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          padding: 36,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
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
            <Typography variant="h1">You’re unsubscribed</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              {state.data?.detail}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              If you already unsubscribed, your preference remains saved. You
              can close this page.
            </Typography>
          </>
        )}
      </section>
    </Box>
  );
}
