import { Alert, Typography } from "@mui/material";
import { settingsApi } from "../api/settings";
import { useResource } from "../hooks";
import {
  Detail,
  ErrorNotice,
  Loading,
  PageHeading,
  StatusChip,
} from "../components/ui";
export function Settings() {
  const state = useResource(settingsApi.get, "settings");
  return (
    <>
      <PageHeading
        title="Settings"
        description="Your sending configuration, at a glance."
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      {!state.data ? (
        state.loading ? (
          <Loading />
        ) : null
      ) : (
        <section className="panel" style={{ maxWidth: 760 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Email provider
          </Typography>
          <Detail name="Provider">{state.data.provider}</Detail>
          {(
            [
              ["API connection", "api_configured"],
              ["From email", "from_email_configured"],
              ["Reply-To", "reply_to_configured"],
              ["Webhook signing", "webhook_secret_configured"],
            ] as const
          ).map(([name, key]) => (
            <Detail key={key} name={name}>
              <StatusChip
                status={state.data![key] ? "configured" : "not_configured"}
              />
            </Detail>
          ))}
          <Alert severity="info" sx={{ mt: 3 }}>
            Configuration is managed by your administrator on the server.
            Secrets are never displayed here. These indicators show configured
            values, not a live connection test.
          </Alert>
        </section>
      )}
    </>
  );
}
