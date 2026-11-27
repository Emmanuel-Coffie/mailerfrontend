import { useRef, useState } from "react";
import { Button as MuiButton, Typography } from "@mui/material";
import AttachFileOutlined from "@mui/icons-material/AttachFileOutlined";
import { client, normalizeError } from "../api/client";
import type { ApiError } from "../api/types";
import { useResource } from "../hooks";
import { ErrorNotice, ConfirmDialog, useNotice } from "./ui";

interface Attachment {
  id: number;
  filename: string;
  size: number;
}
export function CampaignAttachments({
  campaignId,
  readOnly = false,
}: {
  campaignId: string;
  readOnly?: boolean;
}) {
  const path = `/api/email/campaigns/${campaignId}/attachments/`;
  const state = useResource(
    async () => (await client.get<Attachment[]>(path)).data,
    campaignId,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const [removing, setRemoving] = useState<Attachment>();
  const input = useRef<HTMLInputElement>(null);
  const notice = useNotice();
  const upload = async (file?: File) => {
    if (!file || busy) return;
    if (!file.size || file.size > 3 * 1024 * 1024) {
      setError({
        message: "Choose a non-empty file up to 3 MB.",
        fieldErrors: {},
      });
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      const data = new FormData();
      data.append("file", file);
      await client.post(path, data);
      state.reload();
      notice("Attachment added");
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="campaign-attachments">
      <Typography variant="h3">
        Attachments {readOnly ? "" : "(optional)"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>
        These files are included with every email, including test emails. Up to
        5 files, 3 MB each, 8 MB total.
      </Typography>
      <ErrorNotice error={error || state.error} retry={state.reload} />
      <div aria-live="polite" aria-busy={busy || state.loading}>
        {state.loading ? (
          <Typography>Loading attachments…</Typography>
        ) : !state.data?.length ? (
          <Typography color="text.secondary">No attachments added.</Typography>
        ) : (
          state.data.map((file) => (
            <div key={file.id} className="attachment-row">
              <div>
                <strong>{file.filename}</strong>
                <Typography variant="body2" color="text.secondary">
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </div>
              {!readOnly && (
                <MuiButton
                  variant="text"
                  disabled={busy}
                  onClick={() => setRemoving(file)}
                >
                  Remove
                </MuiButton>
              )}
            </div>
          ))
        )}
      </div>
      {!readOnly && (
        <>
          <MuiButton
            sx={{ mt: 2 }}
            variant="outlined"
            startIcon={<AttachFileOutlined />}
            loading={busy}
            disabled={
              state.loading || !!state.error || (state.data?.length || 0) >= 5
            }
            onClick={() => input.current?.click()}
          >
            Add attachment
          </MuiButton>
          <input
            hidden
            ref={input}
            type="file"
            aria-label="Campaign attachment"
            onChange={(e) => {
              void upload(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </>
      )}
      <ConfirmDialog
        open={!!removing}
        title="Remove attachment?"
        description={`Remove ${removing?.filename} from this campaign? You can upload it again.`}
        busy={busy}
        onClose={() => setRemoving(undefined)}
        onConfirm={async () => {
          if (!removing || busy) return;
          setBusy(true);
          try {
            await client.delete(`${path}${removing.id}/`);
            state.reload();
            setRemoving(undefined);
            notice("Attachment removed");
          } catch (e) {
            setError(normalizeError(e));
            setRemoving(undefined);
          } finally {
            setBusy(false);
          }
        }}
      />
    </section>
  );
}
