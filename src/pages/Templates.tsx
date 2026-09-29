import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button as MuiButton, TextField, Typography } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { templatesApi } from "../api/templates";
import type { EmailTemplate, ApiError, Preview } from "../api/types";
import { normalizeError } from "../api/client";
import { useQuery, useResource, date, label } from "../hooks";
import {
  ConfirmDialog,
  DataTable,
  EmailPreview,
  Empty,
  ErrorNotice,
  Loading,
  PageHeading,
  Pager,
  SearchField,
  useNotice,
} from "../components/ui";
import { EditorForm, type FieldSpec } from "../components/forms";
export const templateFields: FieldSpec[] = [
  { name: "name", label: "Template name", required: true, maxLength: 255 },
  { name: "subject", label: "Subject", required: true, maxLength: 998 },
  { name: "html_content", label: "HTML content", multiline: true },
  { name: "text_content", label: "Plain text content", multiline: true },
];
export function Templates() {
  const query = useQuery();
  const state = useResource(() => templatesApi.list(query.query), query.key);
  const [deleting, setDeleting] = useState<EmailTemplate>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const notice = useNotice();
  return (
    <>
      <PageHeading
        title="Templates"
        description="A thoughtful starting point for every message."
        actions={
          <MuiButton
            component={Link}
            to="/templates/create"
            startIcon={<AddOutlined />}
          >
            Create template
          </MuiButton>
        }
      />
      <ErrorNotice error={error || state.error} retry={state.reload} />
      <section className="panel" style={{ padding: 0 }}>
        <div className="toolbar">
          <SearchField
            value={String(query.query.search || "")}
            onChange={(v) => query.set("search", v)}
            placeholder="Search templates"
          />
        </div>
        {state.loading ? (
          <Loading />
        ) : (
          <DataTable
            rows={state.data?.results || []}
            columns={[
              {
                name: "Template",
                render: (t) => (
                  <Link to={`/templates/${t.id}`}>
                    <strong>{t.name}</strong>
                  </Link>
                ),
              },
              { name: "Subject", render: (t) => t.subject },
              { name: "Last updated", render: (t) => date(t.updated_at) },
              {
                name: "Actions",
                render: (t) => (
                  <div className="actions">
                    <MuiButton
                      component={Link}
                      to={`/templates/${t.id}`}
                      variant="text"
                    >
                      Edit & preview
                    </MuiButton>
                    <MuiButton
                      variant="text"
                      color="error"
                      onClick={() => setDeleting(t)}
                    >
                      Delete
                    </MuiButton>
                  </div>
                ),
              },
            ]}
            empty={
              <Empty
                title="No templates found"
                description="Create a reusable message with a personal touch."
                action={
                  <MuiButton component={Link} to="/templates/create">
                    Create template
                  </MuiButton>
                }
              />
            }
          />
        )}
        <Pager
          count={state.data?.count || 0}
          page={query.page}
          onChange={(v) => query.set("page", String(v))}
        />
      </section>
      <ConfirmDialog
        open={!!deleting}
        title="Delete template?"
        description={`Delete “${deleting?.name}”? Draft campaigns with blank content can no longer use it as a fallback.`}
        busy={busy}
        onClose={() => setDeleting(undefined)}
        onConfirm={async () => {
          if (!deleting) return;
          setBusy(true);
          try {
            await templatesApi.remove(deleting.id);
            notice("Template deleted");
            query.set("page", "1");
            state.reload();
          } catch (e) {
            setError(normalizeError(e));
          } finally {
            setBusy(false);
            setDeleting(undefined);
          }
        }}
      />
    </>
  );
}
export function TemplateEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = useResource(
    () => (id ? templatesApi.get(id) : Promise.resolve(null)),
    id || "new",
  );
  const notice = useNotice();
  const [sample, setSample] = useState<Record<string, string>>({
    first_name: "Ada",
    last_name: "Example",
    company: "Example Company",
    position: "Director",
  });
  const [preview, setPreview] = useState<Preview>();
  const [error, setError] = useState<ApiError>();
  const [busy, setBusy] = useState(false);
  return (
    <>
      <PageHeading
        title={id ? "Edit template" : "Create template"}
        description="Make it personal. Keep it clear."
        actions={
          <MuiButton component={Link} to="/templates" variant="outlined">
            All templates
          </MuiButton>
        }
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      {id && state.error ? null : state.loading ? (
        <Loading />
      ) : (
        <div className="grid grid-2">
          <section className="panel">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Supported variables:{" "}
              {"{{first_name}}, {{last_name}}, {{company}}, {{position}}"}
            </Typography>
            <EditorForm
              key={id || "new"}
              initial={{
                name: state.data?.name || "",
                subject: state.data?.subject || "",
                html_content: state.data?.html_content || "",
                text_content: state.data?.text_content || "",
              }}
              fields={templateFields}
              onSave={async (values) => {
                if (id) await templatesApi.update(id, values);
                else await templatesApi.create(values);
                notice("Template saved");
              }}
              onDone={() => void navigate("/templates")}
              submitLabel="Save template"
            />
          </section>
          <section className="panel">
            <Typography variant="h2">Preview saved template</Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 3 }}
            >
              Preview uses the saved version. Save changes before previewing
              them.
            </Typography>
            {id ? (
              <>
                <div className="grid grid-2">
                  {Object.entries(sample).map(([key, value]) => (
                    <TextField
                      key={key}
                      label={label(key)}
                      value={value}
                      onChange={(e) =>
                        setSample({ ...sample, [key]: e.target.value })
                      }
                    />
                  ))}
                </div>
                <MuiButton
                  variant="outlined"
                  loading={busy}
                  sx={{ my: 2 }}
                  onClick={async () => {
                    setBusy(true);
                    setError(undefined);
                    try {
                      setPreview(
                        await templatesApi.preview(Number(id), sample),
                      );
                    } catch (e) {
                      setError(normalizeError(e));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  Preview template
                </MuiButton>
                <ErrorNotice error={error} />
                {preview && (
                  <>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      {preview.subject}
                    </Typography>
                    <EmailPreview html={preview.html} text={preview.text} />
                  </>
                )}
              </>
            ) : (
              <Empty
                title="Save to preview"
                description="Create the template, then open it to preview with sample contact details."
              />
            )}
          </section>
        </div>
      )}
    </>
  );
}
