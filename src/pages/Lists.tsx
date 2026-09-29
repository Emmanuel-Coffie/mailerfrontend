import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Button as MuiButton,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import FormatListBulletedOutlined from "@mui/icons-material/FormatListBulletedOutlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import { listsApi } from "../api/lists";
import { contactsApi } from "../api/contacts";
import { normalizeError } from "../api/client";
import type { ContactList, ApiError, Contact } from "../api/types";
import { useQuery, useResource, date } from "../hooks";
import {
  ConfirmDialog,
  DataTable,
  Empty,
  ErrorNotice,
  Loading,
  TableSkeleton,
  PageHeading,
  Pager,
  SearchField,
  StatusChip,
  useNotice,
} from "../components/ui";
import { EditorForm, EditorDialog } from "../components/forms";
function ListEditor({
  list,
  onDone,
}: {
  list?: ContactList;
  onDone: () => void;
}) {
  const notice = useNotice();
  return (
    <EditorForm
      initial={{ name: list?.name || "", description: list?.description || "" }}
      fields={[
        { name: "name", label: "List name", required: true, maxLength: 255 },
        { name: "description", label: "Description", multiline: true },
      ]}
      onSave={async (values) => {
        if (list) await listsApi.update(list.id, values);
        else await listsApi.create(values);
        notice(list ? "List updated" : "List created");
      }}
      onDone={onDone}
      submitLabel={list ? "Save changes" : "Create list"}
    />
  );
}
export function Lists() {
  const query = useQuery();
  const state = useResource(() => listsApi.list(query.query), query.key);
  const [editing, setEditing] = useState<ContactList | null | undefined>();
  const [deleting, setDeleting] = useState<ContactList>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const notice = useNotice();
  return (
    <>
      <PageHeading
        title="Contact lists"
        description="Organize your audience around the conversations that matter."
        actions={
          <MuiButton
            startIcon={<AddOutlined />}
            onClick={() => setEditing(null)}
          >
            Create list
          </MuiButton>
        }
      />
      <ErrorNotice error={error || state.error} retry={state.reload} />
      <section className="panel" style={{ padding: 0 }}>
        {(Boolean(query.key) || (state.data && state.data.results.length > 0)) && (
          <div className="toolbar">
            <SearchField
              value={String(query.query.search || "")}
              onChange={(v) => query.set("search", v)}
              placeholder="Search lists"
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
                name: "List",
                render: (l) => (
                  <Link to={`/contact-lists/${l.id}`}>
                    <strong>{l.name}</strong>
                    <div className="email-line">{l.description}</div>
                  </Link>
                ),
              },
              { name: "Contacts", render: (l) => l.contacts.length },
              { name: "Created", render: (l) => date(l.created_at) },
              {
                name: "Actions",
                render: (l) => (
                  <div className="actions">
                    <MuiButton variant="text" onClick={() => setEditing(l)}>
                      Edit
                    </MuiButton>
                    <MuiButton
                      variant="text"
                      color="error"
                      onClick={() => setDeleting(l)}
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
                  badgeText="Filtered Lists"
                  icon={
                    <SearchOffOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No matching lists"
                  description="We couldn't find any contact lists matching your search term."
                  action={
                    <MuiButton variant="outlined" onClick={query.clear}>
                      Clear search
                    </MuiButton>
                  }
                />
              ) : (
                <Empty
                  badgeText="Audience Segments"
                  icon={
                    <FormatListBulletedOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No contact lists yet"
                  description="Group your contacts into targeted segments to send personalized campaigns tailored to specific audiences."
                  action={
                    <MuiButton
                      variant="contained"
                      startIcon={<AddOutlined />}
                      onClick={() => setEditing(null)}
                    >
                      Create list
                    </MuiButton>
                  }
                  features={[
                    {
                      title: "Segment by Customer Type",
                      description:
                        "Group leads, subscribers, or VIP clients for customized email flows.",
                      icon: (
                        <PeopleAltOutlined sx={{ fontSize: 16 }} />
                      ),
                    },
                    {
                      title: "Direct Campaign Inclusion",
                      description:
                        "Easily pick target lists in the campaign wizard with one click.",
                      icon: (
                        <FormatListBulletedOutlined sx={{ fontSize: 16 }} />
                      ),
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
      <EditorDialog
        open={editing !== undefined}
        onClose={() => setEditing(undefined)}
      >
        <DialogTitle>{editing ? "Edit list" : "Create list"}</DialogTitle>
        <DialogContent>
          <ListEditor
            list={editing || undefined}
            onDone={() => {
              setEditing(undefined);
              state.reload();
            }}
          />
        </DialogContent>
      </EditorDialog>
      <ConfirmDialog
        open={!!deleting}
        title="Delete list?"
        description={`Delete “${deleting?.name}”? Contacts will remain in your audience. Draft campaigns using this list will lose this audience selection.`}
        busy={busy}
        onClose={() => setDeleting(undefined)}
        onConfirm={async () => {
          if (!deleting) return;
          setBusy(true);
          try {
            await listsApi.remove(deleting.id);
            notice("List deleted");
            query.set("page", "1");
            state.reload();
          } catch (e) {
            setError(normalizeError(e));
          } finally {
            setDeleting(undefined);
            setBusy(false);
          }
        }}
      />
    </>
  );
}
export function ListDetail() {
  const { id = "" } = useParams();
  const query = useQuery();
  const state = useResource(() => listsApi.get(id), id);
  const members = useResource(
    () => contactsApi.list({ ...query.query, contact_lists: id }),
    id + query.key,
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const candidates = useResource(
    () => contactsApi.list({ search, page }),
    `${search}-${page}-${open}`,
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const notice = useNotice();
  const update = async (ids: number[], add: boolean) => {
    setBusy(true);
    setError(undefined);
    try {
      await listsApi.members(Number(id), ids, add);
      query.set("page", "1");
      state.reload();
      members.reload();
      setSelected([]);
      setOpen(false);
      notice(add ? "Contacts added" : "Contact removed");
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <PageHeading
        title={state.data?.name || "Contact list"}
        description={
          state.data?.description || "Manage the contacts in this list."
        }
        actions={
          <>
            <MuiButton component={Link} to="/contact-lists" variant="outlined">
              All lists
            </MuiButton>
            <MuiButton
              variant="outlined"
              onClick={() => setEditing(true)}
              disabled={!state.data}
            >
              Edit list
            </MuiButton>
            <MuiButton
              onClick={() => setOpen(true)}
              startIcon={<AddOutlined />}
            >
              Add contacts
            </MuiButton>
          </>
        }
      />
      <ErrorNotice
        error={error || state.error || members.error}
        retry={() => {
          state.reload();
          members.reload();
        }}
      />
      <section className="panel" style={{ padding: 0 }}>
        <div className="toolbar">
          <SearchField
            value={String(query.query.search || "")}
            onChange={(v) => query.set("search", v)}
          />
          <Typography variant="body2" color="text.secondary">
            {state.data?.contacts.length || 0} contacts in this list
          </Typography>
        </div>
        {members.loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DataTable
            rows={members.data?.results || []}
            columns={[
              {
                name: "Contact",
                render: (c) => (
                  <Link to={`/contacts/${c.id}`}>
                    <strong>
                      {c.first_name} {c.last_name}
                    </strong>
                    <div className="email-line">{c.email}</div>
                  </Link>
                ),
              },
              { name: "Company", render: (c) => c.company || "—" },
              {
                name: "Status",
                render: (c) => <StatusChip status={c.status} />,
              },
              {
                name: "Membership",
                render: (c) => (
                  <MuiButton
                    variant="text"
                    disabled={busy}
                    onClick={() => void update([c.id], false)}
                  >
                    Remove from list
                  </MuiButton>
                ),
              },
            ]}
            empty={
              <Empty
                title="No contacts in this view"
                description="Add contacts to the list or adjust your search."
                action={
                  <MuiButton onClick={() => setOpen(true)}>
                    Add contacts
                  </MuiButton>
                }
              />
            }
          />
        )}
        <Pager
          count={members.data?.count || 0}
          page={query.page}
          onChange={(v) => query.set("page", String(v))}
        />
      </section>
      <Dialog
        open={open}
        onClose={() => {
          if (!busy) setOpen(false);
        }}
        maxWidth="md"
      >
        <DialogTitle>Add contacts to {state.data?.name}</DialogTitle>
        <DialogContent>
          <ErrorNotice
            error={error || candidates.error}
            retry={candidates.reload}
          />
          <SearchField
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
              setSelected([]);
            }}
          />
          {candidates.loading ? (
            <Loading />
          ) : (
            <DataTable<Contact>
              rows={candidates.data?.results || []}
              columns={[
                {
                  name: "Select",
                  render: (c) => (
                    <Checkbox
                      checked={
                        selected.includes(c.id) ||
                        !!state.data?.contacts.includes(c.id)
                      }
                      disabled={state.data?.contacts.includes(c.id) || busy}
                      inputProps={{ "aria-label": `Select ${c.email}` }}
                      onChange={(_, checked) =>
                        setSelected((old) =>
                          checked
                            ? [...old, c.id]
                            : old.filter((v) => v !== c.id),
                        )
                      }
                    />
                  ),
                },
                { name: "Email", render: (c) => c.email },
                {
                  name: "Name",
                  render: (c) => `${c.first_name} ${c.last_name}`,
                },
                {
                  name: "Status",
                  render: (c) => <StatusChip status={c.status} />,
                },
              ]}
            />
          )}
          <Pager
            count={candidates.data?.count || 0}
            page={page}
            onChange={(v) => {
              setPage(v);
              setSelected([]);
            }}
          />
          <MuiButton
            sx={{ mt: 2 }}
            loading={busy}
            disabled={!selected.length}
            onClick={() => void update(selected, true)}
          >
            Add {selected.length} selected contacts
          </MuiButton>
        </DialogContent>
      </Dialog>
      <EditorDialog open={editing} onClose={() => setEditing(false)}>
        <DialogTitle>Edit list</DialogTitle>
        <DialogContent>
          {state.data && (
            <ListEditor
              list={state.data}
              onDone={() => {
                setEditing(false);
                state.reload();
              }}
            />
          )}
        </DialogContent>
      </EditorDialog>
    </>
  );
}
