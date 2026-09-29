import { Link } from "react-router-dom";
import { Button as MuiButton } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import { campaignsApi } from "../api/campaigns";
import { useQuery, useResource, date, label } from "../hooks";
import {
  DataTable,
  Empty,
  ErrorNotice,
  Filter,
  Loading,
  PageHeading,
  Pager,
  SearchField,
  StatusChip,
} from "../components/ui";
export const campaignStatuses = [
  "draft",
  "scheduled",
  "queued",
  "sending",
  "completed",
  "cancelled",
  "failed",
];
export function Campaigns() {
  const query = useQuery();
  const state = useResource(() => campaignsApi.list(query.query), query.key);
  return (
    <>
      <PageHeading
        title="Campaigns"
        description="From first draft to the next conversation."
        actions={
          <MuiButton
            component={Link}
            to="/campaigns/create"
            startIcon={<AddOutlined />}
          >
            Create campaign
          </MuiButton>
        }
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      <section className="panel" style={{ padding: 0 }}>
        <div className="toolbar">
          <SearchField
            value={String(query.query.search || "")}
            onChange={(v) => query.set("search", v)}
            placeholder="Search campaigns"
          />
          <Filter
            name="Status"
            value={String(query.query.status || "")}
            onChange={(v) => query.set("status", v)}
            options={campaignStatuses.map((value) => ({
              value,
              label: label(value),
            }))}
          />
        </div>
        {state.loading ? (
          <Loading />
        ) : (
          <DataTable
            rows={state.data?.results || []}
            columns={[
              {
                name: "Campaign",
                render: (c) => (
                  <Link to={`/campaigns/${c.id}`}>
                    <strong>{c.name}</strong>
                    <div className="email-line">{c.subject}</div>
                  </Link>
                ),
              },
              {
                name: "Status",
                render: (c) => <StatusChip status={c.status} />,
              },
              { name: "Recipients", render: (c) => c.total_recipients },
              { name: "Sent", render: (c) => c.sent_count },
              { name: "Delivered", render: (c) => c.delivered_count },
              { name: "Opened", render: (c) => c.opened_count },
              {
                name: "Created / scheduled",
                render: (c) => date(c.scheduled_at || c.created_at),
              },
              {
                name: "Actions",
                render: (c) => (
                  <MuiButton
                    component={Link}
                    variant="text"
                    to={
                      c.status === "draft"
                        ? `/campaigns/create?draft=${c.id}`
                        : `/campaigns/${c.id}`
                    }
                  >
                    {c.status === "draft" ? "Continue draft" : "View campaign"}
                  </MuiButton>
                ),
              },
            ]}
            empty={
              <Empty
                title={query.key ? "No matching campaigns" : "No campaigns yet"}
                description="Start with a message and an audience. We’ll guide you through the rest."
                action={
                  <MuiButton component={Link} to="/campaigns/create">
                    Create campaign
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
    </>
  );
}
