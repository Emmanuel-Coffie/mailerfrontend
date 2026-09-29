import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button as MuiButton,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import { contactsApi } from "../api/contacts";
import { listsApi } from "../api/lists";
import type { Contact, ApiError } from "../api/types";
import { normalizeError } from "../api/client";
import { useQuery, useResource, date, label } from "../hooks";
import {
  ConfirmDialog,
  DataTable,
  Detail,
  Empty,
  ErrorNotice,
  Filter,
  Loading,
  PageHeading,
  Pager,
  SearchField,
  StatusChip,
  useNotice,
} from "../components/ui";
import {
  EditorForm,
  EditorDialog,
  type FieldSpec,
  type FormValues,
} from "../components/forms";
export const contactFields: FieldSpec[] = [
  { name: "first_name", label: "First name", maxLength: 150 },
  { name: "last_name", label: "Last name", maxLength: 150 },
  {
    name: "email",
    label: "Email",
    required: true,
    type: "email",
    maxLength: 254,
  },
  { name: "company", label: "Company", maxLength: 255 },
  { name: "phone", label: "Phone", maxLength: 50 },
  { name: "position", label: "Position", maxLength: 255 },
  {
    name: "status",
    label: "Status",
    options: ["active", "unsubscribed", "bounced", "suppressed"],
  },
  { name: "source", label: "Source", maxLength: 255 },
  { name: "notes", label: "Notes", multiline: true },
];
export function ContactEditor({
  contact,
  onDone,
}: {
  contact?: Contact;
  onDone: () => void;
}) {
  const notice = useNotice();
  const initial = Object.fromEntries(
    contactFields.map((f) => [
      f.name,
      String(
        contact?.[f.name as keyof Contact] ??
          (f.name === "status" ? "active" : ""),
      ),
    ]),
  );
  return (
    <EditorForm
      initial={initial}
      fields={contactFields}
      onSave={async (values) => {
        if (contact)
          await contactsApi.update(contact.id, values as Partial<Contact>);
        else await contactsApi.create(values as Partial<Contact>);
        notice(contact ? "Contact updated" : "Contact created");
      }}
      onDone={onDone}
      submitLabel={contact ? "Save changes" : "Create contact"}
    />
  );
}
export function Contacts() {
  const query = useQuery();
  const state = useResource(() => contactsApi.list(query.query), query.key);
  const lists = useResource(listsApi.all, "lists");
  const [editing, setEditing] = useState<Contact | null | undefined>();
  const [deleting, setDeleting] = useState<Contact>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const notice = useNotice();
  return (
    <>
      <PageHeading
        title="Contacts"
        description="Build meaningful connections with the right people."
        actions={
          <>
            <MuiButton
              component={Link}
              to="/contacts/import"
              variant="outlined"
              startIcon={<UploadFileOutlined />}
            >
              Import CSV
            </MuiButton>
            <MuiButton
              startIcon={<AddOutlined />}
              onClick={() => setEditing(null)}
            >
              Add contact
            </MuiButton>
          </>
        }
      />
      <ErrorNotice error={error || state.error} retry={state.reload} />
      <section className="panel" style={{ padding: 0 }}>
        <div className="toolbar">
          <SearchField
            value={String(query.query.search || "")}
            onChange={(v) => query.set("search", v)}
            placeholder="Name, email, or company"
          />
          <Filter
            name="Status"
            value={String(query.query.status || "")}
            onChange={(v) => query.set("status", v)}
            options={["active", "unsubscribed", "bounced", "suppressed"].map(
              (value) => ({ value, label: label(value) }),
            )}
          />
          <Filter
            name="Lists"
            value={String(query.query.contact_lists || "")}
            onChange={(v) => query.set("contact_lists", v)}
            options={(lists.data || []).map((l) => ({
              value: String(l.id),
              label: l.name,
            }))}
          />
          <TextField
            label="Company"
            value={query.query.company || ""}
            onChange={(e) => query.set("company", e.target.value)}
            sx={{ width: 160 }}
          />
          <Filter
            name="Ordering"
            value={String(query.query.ordering || "")}
            onChange={(v) => query.set("ordering", v)}
            options={[
              { value: "email", label: "Email A–Z" },
              { value: "-created_at", label: "Newest first" },
              { value: "company", label: "Company A–Z" },
            ]}
          />
        </div>
        {state.loading ? (
          <Loading />
        ) : (
          <DataTable
            rows={state.data?.results || []}
            columns={[
              {
                name: "Name",
                render: (c) => (
                  <Link to={`/contacts/${c.id}`}>
                    <strong>
                      {`${c.first_name} ${c.last_name}`.trim() ||
                        "Unnamed contact"}
                    </strong>
                  </Link>
                ),
              },
              { name: "Email", render: (c) => c.email },
              { name: "Company", render: (c) => c.company || "—" },
              { name: "Position", render: (c) => c.position || "—" },
              {
                name: "Status",
                render: (c) => <StatusChip status={c.status} />,
              },
              { name: "Date added", render: (c) => date(c.created_at) },
              {
                name: "Actions",
                render: (c) => (
                  <div className="actions">
                    <MuiButton
                      variant="text"
                      size="small"
                      onClick={() => setEditing(c)}
                    >
                      Edit
                    </MuiButton>
                    <MuiButton
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => setDeleting(c)}
                    >
                      Delete
                    </MuiButton>
                  </div>
                ),
              },
            ]}
            empty={
              <Empty
                title={query.key ? "No matching contacts" : "No contacts yet"}
                description={
                  query.key
                    ? "Try another search or clear the filters."
                    : "Import a CSV or add your first contact to begin."
                }
                action={
                  query.key ? (
                    <MuiButton variant="outlined" onClick={query.clear}>
                      Clear filters
                    </MuiButton>
                  ) : (
                    <MuiButton onClick={() => setEditing(null)}>
                      Add contact
                    </MuiButton>
                  )
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
      <EditorDialog
        open={editing !== undefined}
        onClose={() => setEditing(undefined)}
      >
        <DialogTitle>{editing ? "Edit contact" : "Add contact"}</DialogTitle>
        <DialogContent>
          <ContactEditor
            key={editing?.id || "new"}
            contact={editing || undefined}
            onDone={() => {
              setEditing(undefined);
              state.reload();
            }}
          />
        </DialogContent>
      </EditorDialog>
      <ConfirmDialog
        open={!!deleting}
        title="Delete contact?"
        description={`Delete ${deleting?.email}? Contacts with campaign history cannot be deleted.`}
        busy={busy}
        onClose={() => setDeleting(undefined)}
        onConfirm={async () => {
          if (!deleting) return;
          setBusy(true);
          try {
            await contactsApi.remove(deleting.id);
            setDeleting(undefined);
            notice("Contact deleted");
            query.set("page", "1");
            state.reload();
          } catch (e) {
            setError(normalizeError(e));
            setDeleting(undefined);
          } finally {
            setBusy(false);
          }
        }}
      />
    </>
  );
}
export function ContactDetail() {
  const { id = "" } = useParams();
  const state = useResource(() => contactsApi.get(id), id);
  const [edit, setEdit] = useState(false);
  return (
    <>
      <PageHeading
        title={
          state.data
            ? `${state.data.first_name} ${state.data.last_name}`.trim() ||
              state.data.email
            : "Contact detail"
        }
        description={state.data?.email}
        actions={
          <>
            <MuiButton component={Link} to="/contacts" variant="outlined">
              Back to contacts
            </MuiButton>
            <MuiButton onClick={() => setEdit(true)} disabled={!state.data}>
              Edit contact
            </MuiButton>
          </>
        }
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      {state.data ? (
        <div className="grid grid-2">
          <section className="panel">
            <Typography variant="h2" sx={{ mb: 2 }}>
              Contact information
            </Typography>
            {["email", "company", "phone", "position", "source"].map((key) => (
              <Detail key={key} name={label(key)}>
                {String(state.data![key as keyof Contact] || "—")}
              </Detail>
            ))}
            <Detail name="Status">
              <StatusChip status={state.data.status} />
            </Detail>
          </section>
          <section className="panel">
            <Typography variant="h2" sx={{ mb: 2 }}>
              Activity & notes
            </Typography>
            <Detail name="Date added">{date(state.data.created_at)}</Detail>
            <Detail name="Last email sent">
              {date(state.data.last_email_sent_at)}
            </Detail>
            <Detail name="Last email opened">
              {date(state.data.last_email_opened_at)}
            </Detail>
            <Typography variant="body2" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
              {state.data.notes || "No notes added."}
            </Typography>
          </section>
        </div>
      ) : state.loading ? (
        <Loading />
      ) : null}
      <EditorDialog open={edit} onClose={() => setEdit(false)}>
        <DialogTitle>Edit contact</DialogTitle>
        <DialogContent>
          {state.data && (
            <ContactEditor
              contact={state.data}
              onDone={() => {
                setEdit(false);
                state.reload();
              }}
            />
          )}
        </DialogContent>
      </EditorDialog>
    </>
  );
}
