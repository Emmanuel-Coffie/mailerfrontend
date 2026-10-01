import { Link } from "react-router-dom";
import { Button as MuiButton } from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import SearchOffOutlined from "@mui/icons-material/SearchOffOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import TuneOutlined from "@mui/icons-material/TuneOutlined";
import AutoGraphOutlined from "@mui/icons-material/AutoGraphOutlined";
import { campaignsApi } from "../api/campaigns";
import { useQuery, useResource, date, label } from "../hooks";
import {
  DataTable,
  Empty,
  ErrorNotice,
  Filter,
  Loading,
  TableSkeleton,
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
        kicker="Outreach Operations"
        description="Plan, schedule, and orchestrate outbound communications. Track delivery milestones, open rates, and recipient engagement from first draft to final dispatch."
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
        {(Boolean(query.key) || (state.data && state.data.results.length > 0)) && (
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
        )}
        {state.loading ? (
          <TableSkeleton rows={6} cols={6} />
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
              query.key ? (
                <Empty
                  badgeText="Filtered Campaigns"
                  icon={
                    <SearchOffOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No matching campaigns"
                  description="We couldn't find any campaigns matching your query or selected status filter."
                  action={
                    <MuiButton variant="outlined" onClick={query.clear}>
                      Clear filters
                    </MuiButton>
                  }
                />
              ) : (
                <Empty
                  badgeText="Campaign Workspace"
                  icon={
                    <CampaignOutlined
                      sx={{ fontSize: 32, color: "#0E7A4B" }}
                    />
                  }
                  title="No campaigns yet"
                  description="You haven't launched or scheduled any campaigns yet. Compose a personalized broadcast to communicate with your contacts."
                  action={
                    <MuiButton
                      variant="contained"
                      component={Link}
                      to="/campaigns/create"
                      startIcon={<AddOutlined />}
                    >
                      Create campaign
                    </MuiButton>
                  }
                  secondaryAction={
                    <MuiButton
                      variant="outlined"
                      component={Link}
                      to="/templates"
                      startIcon={<DescriptionOutlined />}
                    >
                      Browse templates
                    </MuiButton>
                  }
                  features={[
                    {
                      title: "Step-by-Step Wizard",
                      description:
                        "Easily configure subject, rich message content, and audience segments.",
                      icon: <TuneOutlined sx={{ fontSize: 16 }} />,
                    },
                    {
                      title: "Targeted Audience Delivery",
                      description:
                        "Deliver to all active contacts or select specific curated recipient lists.",
                      icon: <SendOutlined sx={{ fontSize: 16 }} />,
                    },
                    {
                      title: "Performance Analytics",
                      description:
                        "Monitor real-time delivery rate, opened counts, and engagement trends.",
                      icon: <AutoGraphOutlined sx={{ fontSize: 16 }} />,
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
    </>
  );
}
