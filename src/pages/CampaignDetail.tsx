import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Button as MuiButton,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { campaignsApi } from "../api/campaigns";
import { normalizeError } from "../api/client";
import type { ApiError, PrepareResult } from "../api/types";
import { useResource, useQuery, date, label } from "../hooks";
import {
  ConfirmDialog,
  DataTable,
  Detail,
  EmailPreview,
  ErrorNotice,
  Filter,
  Loading,
  Metric,
  PageHeading,
  Pager,
  SearchField,
  StatusChip,
  Summary,
  useNotice,
} from "../components/ui";
export function RecipientTable({
  id,
  refresh = 0,
}: {
  id: string;
  refresh?: number;
}) {
  const query = useQuery();
  const state = useResource(
    () => campaignsApi.recipients(id, query.query),
    `${id}:${query.key}:${refresh}`,
    `${id}:${query.key}`,
  );
  return (
    <section className="panel" style={{ padding: 0, marginTop: 28 }}>
      <div className="toolbar">
        <Typography variant="h2">Recipients</Typography>
        <SearchField
          value={String(query.query.search || "")}
          onChange={(v) => query.set("search", v)}
        />
        <Filter
          name="Status"
          value={String(query.query.status || "")}
          onChange={(v) => query.set("status", v)}
          options={[
            "pending",
            "queued",
            "sent",
            "delivered",
            "bounced",
            "failed",
            "suppressed",
          ].map((value) => ({ value, label: label(value) }))}
        />
      </div>
      <ErrorNotice error={state.error} retry={state.reload} />
      {state.loading && !state.data ? (
        <Loading />
      ) : (
        <DataTable
          rows={state.data?.results || []}
          columns={[
            {
              name: "Email",
              render: (r) => (
                <>
                  {r.email}
                  {r.error_message && (
                    <div className="email-line">{r.error_message}</div>
                  )}
                </>
              ),
            },
            { name: "Name", render: (r) => `${r.first_name} ${r.last_name}` },
            { name: "Company", render: (r) => r.company || "—" },
            { name: "Status", render: (r) => <StatusChip status={r.status} /> },
            { name: "Sent", render: (r) => date(r.sent_at) },
            { name: "Delivered", render: (r) => date(r.delivered_at) },
            { name: "Opened", render: (r) => date(r.opened_at) },
            { name: "Clicked", render: (r) => date(r.clicked_at) },
          ]}
        />
      )}
      <Pager
        count={state.data?.count || 0}
        page={query.page}
        onChange={(v) => query.set("page", String(v))}
      />
    </section>
  );
}
export function CampaignDetail() {
  const { id = "" } = useParams();
  const [tick, setTick] = useState(0);
  const state = useResource(() => campaignsApi.get(id), `${id}:${tick}`, id);
  const c = state.data;
  const active = c?.status === "queued" || c?.status === "sending";
  const remaining = useResource(
    async () => {
      const [pending, queued] = await Promise.all([
        campaignsApi.recipients(id, { status: "pending" }),
        campaignsApi.recipients(id, { status: "queued" }),
      ]);
      return pending.count + queued.count;
    },
    `${id}:${tick}`,
    id,
  );
  useEffect(() => {
    if (!active && c?.status !== "scheduled") return;
    const timer = setInterval(() => setTick((t) => t + 1), 6000);
    return () => clearInterval(timer);
  }, [active, c?.status]);
  const [error, setError] = useState<ApiError>();
  const [busy, setBusy] = useState(false);
  const [action, setAction] = useState<"cancel" | "send">();
  const [report, setReport] = useState<PrepareResult>();
  const [test, setTest] = useState(false);
  const [email, setEmail] = useState("");
  const notice = useNotice();
  const prepare = async (send = false) => {
    setBusy(true);
    setError(undefined);
    try {
      setReport(await campaignsApi.prepare(Number(id)));
      state.reload();
      if (send) setAction("send");
      else notice("Recipients prepared");
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title={c?.name || "Campaign detail"}
        description={c?.subject}
        actions={
          <>
            <MuiButton
              component={Link}
              to={`/campaigns/${id}/analytics`}
              variant="outlined"
            >
              View analytics
            </MuiButton>
            {c?.status === "draft" && (
              <MuiButton component={Link} to={`/campaigns/create?draft=${id}`}>
                Edit campaign
              </MuiButton>
            )}
          </>
        }
      />
      <ErrorNotice error={error || state.error} retry={state.reload} />
      {!c ? (
        state.loading ? (
          <Loading />
        ) : null
      ) : (
        <>
          <div className="actions" style={{ marginBottom: 24 }}>
            <StatusChip status={c.status} />
            {c.status === "draft" && (
              <>
                <MuiButton
                  variant="outlined"
                  loading={busy}
                  onClick={() => void prepare()}
                >
                  Prepare recipients
                </MuiButton>
                <MuiButton loading={busy} onClick={() => void prepare(true)}>
                  Send campaign
                </MuiButton>
              </>
            )}
            <MuiButton variant="outlined" onClick={() => setTest(true)}>
              Send test
            </MuiButton>
            {["draft", "scheduled", "queued", "sending"].includes(c.status) && (
              <MuiButton
                variant="text"
                color="error"
                onClick={() => setAction("cancel")}
              >
                Cancel campaign
              </MuiButton>
            )}
          </div>
          <div className="grid grid-4">
            <Metric title="Recipients" value={c.total_recipients} />
            <Metric title="Sent" value={c.sent_count} />
            <Metric title="Delivered" value={c.delivered_count} />
            <Metric title="Failed" value={c.failed_count} />
          </div>
          {active && (
            <section className="panel" style={{ marginTop: 24 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Sending progress
              </Typography>
              <ErrorNotice error={remaining.error} retry={remaining.reload} />
              {remaining.data !== undefined ? (
                <>
                  <LinearProgress
                    variant="determinate"
                    value={
                      c.total_recipients
                        ? Math.max(
                            0,
                            Math.min(
                              100,
                              ((c.total_recipients - remaining.data) /
                                c.total_recipients) *
                                100,
                            ),
                          )
                        : 0
                    }
                    sx={{ height: 8, borderRadius: 6 }}
                  />
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    {c.sent_count} sent · {c.delivered_count} delivered ·{" "}
                    {c.bounced_count} bounced · {c.failed_count} failed ·{" "}
                    {remaining.data} remaining
                  </Typography>
                </>
              ) : (
                <LinearProgress />
              )}
              <Typography variant="caption" color="text.secondary">
                Refreshes every 6 seconds. Processed recipients include
                suppressed and failed records.
              </Typography>
            </section>
          )}
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <section className="panel">
              <Typography variant="h2" sx={{ mb: 2 }}>
                Campaign details
              </Typography>
              <Detail name="Sender">
                {c.from_email
                  ? `${c.from_name} <${c.from_email}>`
                  : "Configured default"}
              </Detail>
              <Detail name="Reply-To">
                {c.reply_to || "Configured default"}
              </Detail>
              <Detail name="Scheduled">{date(c.scheduled_at)}</Detail>
              <Detail name="Created">{date(c.created_at)}</Detail>
              <Detail name="Started">{date(c.started_at)}</Detail>
              <Detail name="Completed">{date(c.completed_at)}</Detail>
              <Detail name="Bounced">{c.bounced_count}</Detail>
            </section>
            <section className="panel">
              <Typography variant="h2" sx={{ mb: 2 }}>
                Saved campaign content
              </Typography>
              <EmailPreview html={c.html_content} text={c.text_content} />
            </section>
          </div>
          {report && (
            <section style={{ marginTop: 24 }}>
              <Typography variant="h2" sx={{ mb: 2 }}>
                Preparation results
              </Typography>
              <Summary data={{ ...report }} />
            </section>
          )}
          <RecipientTable id={id} refresh={tick} />
        </>
      )}
      <ConfirmDialog
        open={!!action}
        title={action === "send" ? "Send campaign?" : "Cancel campaign?"}
        description={
          action === "send"
            ? `Send “${c?.name}” to ${report?.eligible || 0} eligible recipients? Emails cannot be recalled once accepted for delivery.`
            : `Stop future sends for “${c?.name}”? Already accepted emails cannot be recalled.`
        }
        action={action === "send" ? "Send campaign" : "Cancel campaign"}
        danger={action !== "send"}
        busy={busy}
        onClose={() => setAction(undefined)}
        onConfirm={async () => {
          setBusy(true);
          try {
            if (action === "send") {
              if (!report?.eligible) throw new Error("No eligible recipients.");
              await campaignsApi.send(Number(id));
              notice("Campaign queued");
            } else {
              await campaignsApi.cancel(Number(id));
              notice("Campaign cancelled");
            }
            state.reload();
            setTick((t) => t + 1);
          } catch (e) {
            setError(normalizeError(e));
            state.reload();
          } finally {
            setBusy(false);
            setAction(undefined);
          }
        }}
      />
      <Dialog
        open={test}
        onClose={() => {
          if (!busy) setTest(false);
        }}
      >
        <DialogTitle>Send test email</DialogTitle>
        <DialogContent>
          <ErrorNotice error={error} />
          <TextField
            label="Test email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 1 }}
          />
          <MuiButton
            sx={{ mt: 2 }}
            loading={busy}
            onClick={async () => {
              setBusy(true);
              setError(undefined);
              try {
                await campaignsApi.test(Number(id), email);
                notice("Test email sent");
                setTest(false);
              } catch (e) {
                setError(normalizeError(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            Send test email
          </MuiButton>
        </DialogContent>
      </Dialog>
    </>
  );
}
