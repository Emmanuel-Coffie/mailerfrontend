import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { Button as MuiButton, TextField, Typography } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import DesignServicesOutlined from "@mui/icons-material/DesignServicesOutlined";
import CodeOutlined from "@mui/icons-material/CodeOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
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
  TableSkeleton,
  PageHeading,
  Pager,
  SearchField,
  useNotice,
} from "../components/ui";
import { EditorForm, Field, type FieldSpec } from "../components/forms";
import {
  EmailDesignerField,
  StarterGallery,
} from "../components/EmailDesigner";
import { starterDesign, renderEmail, designText } from "../email/design";
export const templateFields: FieldSpec[] = [
  { name: "name", label: "Template name", required: true, maxLength: 255 },
  { name: "subject", label: "Subject", required: true, maxLength: 998 },
  { name: "html_content", label: "Formatted message content", multiline: true },
  { name: "text_content", label: "Plain text message", multiline: true },
];
export function Templates() {
  const navigate = useNavigate();
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
        kicker="Design Studio"
        description="Craft modular, responsive email designs and reusable layouts that maintain pristine brand fidelity across every email client."
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
      <div className="template-intro">
        <div>
          <div className="template-intro-eyebrow">
            <span>Curated Starters</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Pre-Engineered Layouts</span>
          </div>
          <h2>Your next message, beautifully started.</h2>
          <p>
            Select a tailored layout baseline below. Customize headings, typography,
            buttons, and content blocks with the visual designer.
          </p>
        </div>
      </div>
      <StarterGallery
        onChoose={(starter) => navigate(`/templates/create?starter=${starter}`)}
      />
      <div className="template-intro">
        <div>
          <div className="template-intro-eyebrow">
            <span>Workspace Library</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Saved Assets</span>
          </div>
          <h2>Saved templates</h2>
          <p>
            Your reusable master designs and verified layouts, ready for campaign
            dispatch.
          </p>
        </div>
      </div>
      <section className="panel" style={{ padding: 0 }}>
        {(Boolean(query.key) ||
          (state.data && state.data.results.length > 0)) && (
          <div className="toolbar">
            <SearchField
              value={String(query.query.search || "")}
              onChange={(v) => query.set("search", v)}
              placeholder="Search templates"
            />
          </div>
        )}
        {state.loading ? (
          <TableSkeleton rows={5} cols={4} />
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
              query.key ? (
                <Empty
                  badgeText="Filtered Search"
                  icon={
                    <SearchOffOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No templates found"
                  description="We couldn't find any templates matching your search criteria."
                  action={
                    <MuiButton variant="outlined" onClick={query.clear}>
                      Clear search
                    </MuiButton>
                  }
                />
              ) : (
                <Empty
                  badgeText="Template Studio"
                  icon={
                    <DescriptionOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No templates yet"
                  description="Design reusable email layouts with formatted message styling and plain-text fallbacks to accelerate your campaign workflow."
                  action={
                    <MuiButton
                      variant="contained"
                      component={Link}
                      to="/templates/create"
                      startIcon={<AddOutlined />}
                    >
                      Create template
                    </MuiButton>
                  }
                  secondaryAction={
                    <MuiButton
                      variant="outlined"
                      component={Link}
                      to="/campaigns/create"
                      startIcon={<CampaignOutlined />}
                    >
                      Create campaign
                    </MuiButton>
                  }
                  features={[
                    {
                      title: "Dual Format Support",
                      description:
                        "Craft formatted HTML and clean plain-text versions for maximum deliverability.",
                      icon: <CodeOutlined sx={{ fontSize: 16 }} />,
                    },
                    {
                      title: "Instant Campaign Preset",
                      description:
                        "Reuse templates as starter bases for future campaign broadcasts.",
                      icon: <DesignServicesOutlined sx={{ fontSize: 16 }} />,
                    },
                    {
                      title: "Live Safe Sandbox",
                      description:
                        "Test and review your email design within an isolated, responsive preview sandbox.",
                      icon: <DescriptionOutlined sx={{ fontSize: 16 }} />,
                    },
                  ]}
                />
              )
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
  const [params] = useSearchParams();
  const starter = params.get("starter");
  const startingDesign = !id && starter ? starterDesign(starter) : undefined;
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
        description="Your words. Your style. An email worth opening."
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
        <div className="template-editor-form">
          <EditorForm
            key={id || "new"}
            initial={{
              name: state.data?.name || "",
              subject: state.data?.subject || "",
              html_content:
                state.data?.html_content ||
                (startingDesign ? renderEmail(startingDesign) : ""),
              text_content:
                state.data?.text_content ||
                (startingDesign ? designText(startingDesign) : ""),
            }}
            fields={[]}
            onSave={async (values) => {
              if (id) await templatesApi.update(id, values);
              else await templatesApi.create(values);
              notice("Template saved");
            }}
            onDone={() => void navigate("/templates")}
            submitLabel="Save template"
          >
            <section className="template-editor-meta">
              <div className="grid grid-2">
                <Field {...templateFields[0]} />
                <Field {...templateFields[1]} />
              </div>
            </section>
            <EmailDesignerField />
            <details className="plain-text-details">
              <summary>Plain text & accessibility</summary>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                A readable fallback for inboxes that do not display formatted
                emails. Visual edits regenerate this version; make any final
                text adjustments after designing.
              </Typography>
              <Field {...templateFields[3]} />
            </details>
          </EditorForm>
          {id && (
            <section className="panel saved-preview-panel">
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
          )}
        </div>
      )}
    </>
  );
}
