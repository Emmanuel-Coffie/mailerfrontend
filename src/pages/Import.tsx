import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button as MuiButton,
  Chip,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { contactsApi } from "../api/contacts";
import { listsApi } from "../api/lists";
import { normalizeError } from "../api/client";
import type { ApiError, ImportResult } from "../api/types";
import { useResource } from "../hooks";
import { ErrorNotice, PageHeading, Summary, useNotice } from "../components/ui";

export function ImportContacts() {
  const [file, setFile] = useState<File>();
  const [list, setList] = useState("");
  const [groupBy, setGroupBy] = useState("auto");
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reading, setReading] = useState(false);
  const [error, setError] = useState<ApiError>();
  const [preview, setPreview] = useState<ImportResult>();
  const [result, setResult] = useState<ImportResult>();
  const [revision, setRevision] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const lists = useResource(listsApi.all, "lists");
  const notice = useNotice();
  useEffect(() => {
    let active = true;
    setPreview(undefined);
    if (!file) {
      setReading(false);
      return;
    }
    setReading(true);
    setError(undefined);
    contactsApi
      .import(file, list ? Number(list) : undefined, groupBy, true)
      .then((data) => {
        if (active) setPreview(data);
      })
      .catch((e) => {
        if (active) setError(normalizeError(e));
      })
      .finally(() => {
        if (active) setReading(false);
      });
    return () => {
      active = false;
    };
  }, [file, list, groupBy, revision]);
  const choose = (value?: File) => {
    if (busy) return;
    setResult(undefined);
    setPreview(undefined);
    setError(undefined);
    if (
      value &&
      (!/\.(csv|xlsx)$/i.test(value.name) ||
        !value.size ||
        value.size > 5 * 1024 * 1024)
    ) {
      setFile(undefined);
      setError({
        message:
          "Choose a non-empty .xlsx or .csv file up to 5 MB. Save older .xls workbooks as .xlsx first.",
        fieldErrors: {},
      });
      return;
    }
    setFile(value);
  };
  return (
    <>
      <PageHeading
        title="Bring your audience together"
        kicker="Import contacts"
        description="Drop in your spreadsheet. We’ll recognize the columns and organize your contacts into groups."
        actions={
          <MuiButton component={Link} to="/contacts" variant="outlined">
            Back to contacts
          </MuiButton>
        }
      />
      <div className="import-steps" aria-label="Import progress">
        {["Choose a file", "Review your audience", "Ready to send"].map(
          (text, i) => (
            <div
              key={text}
              className={(result ? 2 : file ? 1 : 0) === i ? "current" : ""}
            >
              <span>{i + 1}</span>
              {text}
            </div>
          ),
        )}
      </div>
      <ErrorNotice
        error={error || lists.error}
        retry={
          error && file
            ? () => setRevision((v) => v + 1)
            : lists.error
              ? lists.reload
              : undefined
        }
      />
      {result ? (
        <section className="panel import-success" role="status">
          <CheckCircleOutline sx={{ fontSize: 48, color: "primary.main" }} />
          <Typography variant="h2">Your audience is ready</Typography>
          <Typography color="text.secondary">
            {result.imported} new contacts added. {result.existing} existing
            contacts kept.
          </Typography>
          <Summary
            data={{
              imported: result.imported,
              existing: result.existing,
              invalid: result.invalid,
              duplicates: result.duplicates,
            }}
          />
          <div className="import-groups">
            {result.groups?.map((group) => (
              <Chip
                key={group.name}
                label={`${group.name} · ${group.contacts}`}
              />
            ))}
          </div>
          <div className="actions">
            <MuiButton component={Link} to="/campaigns/create">
              Create a campaign
            </MuiButton>
            <MuiButton component={Link} to="/contact-lists" variant="outlined">
              View groups
            </MuiButton>
            <MuiButton variant="text" onClick={() => choose(undefined)}>
              Import another file
            </MuiButton>
          </div>
        </section>
      ) : (
        <div className="import-layout">
          <section className="panel">
            <div
              className={"dropzone" + (drag ? " dragging" : "")}
              onDragOver={(e) => {
                e.preventDefault();
                if (!busy) setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDrag(false);
                choose(e.dataTransfer.files[0]);
              }}
            >
              <UploadFileOutlined
                sx={{ fontSize: 44, color: "primary.main", mb: 2 }}
              />
              <Typography variant="h2">
                {file?.name || "Your spreadsheet starts here"}
              </Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · Ready for review`
                  : "Drop an Excel or CSV file here. Up to 5 MB."}
              </Typography>
              <MuiButton
                variant="outlined"
                disabled={busy}
                onClick={() => input.current?.click()}
              >
                {file ? "Choose another file" : "Choose a spreadsheet"}
              </MuiButton>
              <input
                ref={input}
                hidden
                type="file"
                accept=".csv,.xlsx"
                aria-label="Spreadsheet file"
                onChange={(e) => {
                  choose(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
              {file && (
                <MuiButton
                  variant="text"
                  disabled={busy}
                  onClick={() => choose(undefined)}
                >
                  Remove
                </MuiButton>
              )}
            </div>
            <div className="grid grid-2" style={{ marginTop: 24 }}>
              <TextField
                select
                label="Organize groups by"
                value={groupBy}
                disabled={busy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                {[
                  ["auto", "Detect automatically"],
                  ["group", "Group / segment column"],
                  ["company", "Company"],
                  ["position", "Job title"],
                  ["sheet", "Worksheet name"],
                  ["none", "Do not create groups"],
                ].map(([value, name]) => (
                  <MenuItem key={value} value={value}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Also add to a saved group"
                value={list}
                disabled={busy || lists.loading}
                onChange={(e) => setList(e.target.value)}
              >
                <MenuItem value="">None</MenuItem>
                {lists.data?.map((l) => (
                  <MenuItem key={l.id} value={l.id}>
                    {l.name}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Automatic grouping uses Group or Segment values, then Company,
              then worksheet names. Separate multiple groups with commas or
              semicolons.
            </Typography>
          </section>
          <section
            className="panel import-review"
            aria-live="polite"
            aria-busy={reading || busy}
          >
            <Typography variant="h2">Review before importing</Typography>
            {reading ? (
              <div className="import-reading">
                <CircularProgress size={28} />
                <p>Reading columns and finding groups…</p>
              </div>
            ) : preview ? (
              <>
                <div className="import-total">
                  <strong>{preview.valid.toLocaleString()}</strong>
                  <span>unique valid contacts</span>
                </div>
                <Typography color="text.secondary">
                  {preview.imported} new · {preview.existing} already saved ·{" "}
                  {preview.duplicates} duplicate rows
                </Typography>
                <div className="import-groups">
                  {preview.groups?.map((group) => (
                    <Chip
                      key={group.name}
                      label={`${group.name} · ${group.contacts}`}
                      variant="outlined"
                    />
                  ))}
                </div>
                {!preview.groups?.length && (
                  <Typography sx={{ my: 2 }} color="text.secondary">
                    No automatic groups detected. Choose a saved group or import
                    without one.
                  </Typography>
                )}
                <details className="import-details">
                  <summary>Detected columns & worksheets</summary>
                  {preview.detected_columns?.map((sheet) => (
                    <p key={sheet.sheet}>
                      <strong>{sheet.sheet}</strong>
                      <br />
                      {sheet.fields
                        .map((field) => field.replaceAll("_", " "))
                        .join(" · ")}
                    </p>
                  ))}
                </details>
                {!!preview.invalid && (
                  <Alert severity="warning" sx={{ my: 2 }}>
                    {preview.invalid} rows will be skipped.{" "}
                    {preview.errors
                      ?.slice(0, 3)
                      .map((e) => `${e.sheet}, row ${e.row}: ${e.message}`)
                      .join(" ")}
                  </Alert>
                )}
                <MuiButton
                  fullWidth
                  loading={busy}
                  disabled={!preview.valid || reading}
                  sx={{ mt: 3 }}
                  onClick={async () => {
                    if (!file || busy) return;
                    setBusy(true);
                    setError(undefined);
                    try {
                      setResult(
                        await contactsApi.import(
                          file,
                          list ? Number(list) : undefined,
                          groupBy,
                        ),
                      );
                      notice("Contacts imported");
                    } catch (e) {
                      setError(normalizeError(e));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Import {preview.valid.toLocaleString()} contacts
                </MuiButton>
              </>
            ) : (
              <div className="import-help">
                <p>No column mapping needed.</p>
                <Typography color="text.secondary">
                  We recognize Email address, Full name, Company, Phone, Job
                  title and Group, including common variations.
                </Typography>
                <a href="/contacts-example.csv" download>
                  Download an example spreadsheet
                </a>
              </div>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
              Existing details stay unchanged. Unsubscribed and suppressed
              contacts remain excluded from sending.
            </Typography>
          </section>
        </div>
      )}
    </>
  );
}
