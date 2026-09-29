import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Button as MuiButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { contactsApi } from "../api/contacts";
import { listsApi } from "../api/lists";
import { normalizeError } from "../api/client";
import type { ApiError, ImportResult } from "../api/types";
import { useResource } from "../hooks";
import { ErrorNotice, PageHeading, Summary, useNotice } from "../components/ui";
export function ImportContacts() {
  const [file, setFile] = useState<File>();
  const [list, setList] = useState("");
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const [result, setResult] = useState<ImportResult>();
  const lists = useResource(listsApi.all, "lists");
  const notice = useNotice();
  const choose = (value?: File) => {
    setResult(undefined);
    if (value && !value.name.toLowerCase().endsWith(".csv")) {
      setFile(undefined);
      setError({ message: "Choose a CSV file.", fieldErrors: {} });
      return;
    }
    setFile(value);
    setError(undefined);
  };
  return (
    <>
      <PageHeading
        title="Import contacts"
        description="Bring your audience together, one file at a time."
        actions={
          <MuiButton component={Link} to="/contacts" variant="outlined">
            Back to contacts
          </MuiButton>
        }
      />
      <ErrorNotice
        error={error || lists.error}
        retry={lists.error ? lists.reload : undefined}
      />
      <div className="two-column">
        <section className="panel">
          <div
            className={"dropzone" + (drag ? " dragging" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              if (!busy) choose(e.dataTransfer.files[0]);
            }}
          >
            <UploadFileOutlined
              sx={{ fontSize: 36, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h2">
              {file ? file.name : "Drop your CSV here"}
            </Typography>
            <Typography color="text.secondary" sx={{ my: 1 }}>
              {file
                ? `${(file.size / 1024).toFixed(1)} KB`
                : "Or choose a file from your computer"}
            </Typography>
            <MuiButton component="label" variant="outlined" disabled={busy}>
              Choose CSV
              <input
                hidden
                type="file"
                accept=".csv,text/csv"
                aria-label="CSV file"
                onChange={(e) => {
                  choose(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </MuiButton>
            {file && (
              <MuiButton
                variant="text"
                disabled={busy}
                onClick={() => choose(undefined)}
              >
                Remove file
              </MuiButton>
            )}
          </div>
          <TextField
            select
            label="Add to a list (optional)"
            value={list}
            onChange={(e) => setList(e.target.value)}
            sx={{ mt: 3 }}
          >
            <MenuItem value="">No list</MenuItem>
            {lists.data?.map((l) => (
              <MenuItem key={l.id} value={l.id}>
                {l.name}
              </MenuItem>
            ))}
          </TextField>
          <MuiButton
            sx={{ mt: 3 }}
            disabled={!file}
            loading={busy}
            onClick={async () => {
              if (!file) return;
              setBusy(true);
              setError(undefined);
              try {
                setResult(
                  await contactsApi.import(
                    file,
                    list ? Number(list) : undefined,
                  ),
                );
                notice("Import completed");
              } catch (e) {
                setError(normalizeError(e));
              } finally {
                setBusy(false);
              }
            }}
          >
            Import contacts
          </MuiButton>
        </section>
        <aside className="panel">
          <Typography variant="h2">Prepare your file</Typography>
          <Typography sx={{ mt: 2 }} variant="body2">
            Use a UTF-8 CSV with an email column. You can also include:
          </Typography>
          <Typography
            component="pre"
            sx={{ fontSize: 12, lineHeight: 2, whiteSpace: "pre-wrap" }}
          >
            first_name · last_name
            <br />
            company · phone · position
          </Typography>
          <Alert severity="info">
            Existing contacts are kept. Invalid addresses and duplicate rows are
            skipped. The server enforces the upload size limit (5 MB by
            default).
          </Alert>
        </aside>
      </div>
      {result && (
        <section style={{ marginTop: 28 }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            Import results
          </Typography>
          <Summary data={{ ...result }} />
        </section>
      )}
    </>
  );
}
