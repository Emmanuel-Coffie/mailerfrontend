import { Link } from "react-router-dom";
import { Button as MuiButton, Typography, Box } from "@mui/material";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import UploadFileOutlined from "@mui/icons-material/UploadFileOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import TaskAltOutlined from "@mui/icons-material/TaskAltOutlined";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dashboardApi } from "../api/dashboard";
import { useResource, date, number } from "../hooks";
import {
  DataTable,
  Empty,
  ErrorNotice,
  Loading,
  DashboardSkeleton,
  PageHeading,
  StatusChip,
} from "../components/ui";

const chartColors = ["#387b6f", "#899caa", "#b39363", "#a298b5"];

function DashboardMetric({
  title,
  value,
  caption,
  icon,
}: {
  title: string;
  value: number;
  caption: string;
  icon: React.ReactNode;
}) {
  return (
    <section className="panel metric-card">
      <div>
        <div className="metric-label">
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontWeight: 650 }}
          >
            {title}
          </Typography>
          <Box
            sx={{
              width: 34,
              height: 34,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              bgcolor: "#eef3f1",
              color: "#387b6f",
              "& svg": { fontSize: 18 },
            }}
          >
            {icon}
          </Box>
        </div>
        <div className="metric">{number(value)}</div>
      </div>
      <Typography
        variant="caption"
        color="text.secondary"
        className="metric-caption"
      >
        {caption}
      </Typography>
    </section>
  );
}

export function Dashboard() {
  const state = useResource(dashboardApi.get, "dashboard");
  const d = state.data;

  const audienceData = d
    ? [
        { name: "Active", value: d.active_contacts },
        { name: "Unsubscribed", value: d.unsubscribed_contacts },
        { name: "Bounced", value: d.bounced_contacts },
        { name: "Suppressed", value: d.suppressed_contacts },
      ]
    : [];

  const campaignPerformance = d
    ? d.recent_campaigns.slice(0, 6).map((campaign) => ({
        name:
          campaign.name.length > 18
            ? `${campaign.name.slice(0, 18)}…`
            : campaign.name,
        recipients: campaign.total_recipients,
        delivered: campaign.delivered_count,
      }))
    : [];

  const deliveryRate = d?.total_sent
    ? Math.round((d.total_delivered / d.total_sent) * 100)
    : 0;

  return (
    <>
      <PageHeading
        title="Dashboard"
        kicker="Operations Overview"
        description="Monitor audience health, campaign activity milestones, and delivery performance from one central workspace."
        actions={
          <>
            <MuiButton
              component={Link}
              to="/contacts/import"
              variant="outlined"
              startIcon={<UploadFileOutlined />}
            >
              Import contacts
            </MuiButton>
            <MuiButton
              component={Link}
              to="/templates/create"
              endIcon={<ArrowForwardOutlined />}
            >
              Design an email
            </MuiButton>
          </>
        }
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      {!d ? (
        state.loading ? (
          <DashboardSkeleton />
        ) : null
      ) : (
        <>
          <div className="grid grid-4">
            <DashboardMetric
              title="Total contacts"
              value={d.total_contacts}
              caption={`${number(d.active_contacts)} active contacts`}
              icon={<PeopleAltOutlined />}
            />
            <DashboardMetric
              title="Campaigns"
              value={d.total_campaigns}
              caption={`${number(d.draft_campaigns)} drafts · ${number(d.scheduled_campaigns)} scheduled`}
              icon={<CampaignOutlined />}
            />
            <DashboardMetric
              title="Emails sent"
              value={d.total_sent}
              caption="Accepted for delivery"
              icon={<MarkEmailReadOutlined />}
            />
            <DashboardMetric
              title="Delivered"
              value={d.total_delivered}
              caption={`${deliveryRate}% overall delivery rate`}
              icon={<TaskAltOutlined />}
            />
          </div>

          <div className="dashboard-main-grid">
            <section className="panel dashboard-chart-card">
              <div className="dashboard-chart-header">
                <div>
                  <Typography variant="h2">Recent campaign delivery</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.7 }}
                  >
                    Recipients compared with successfully delivered messages.
                  </Typography>
                </div>
                <MuiButton
                  component={Link}
                  to="/campaigns"
                  variant="outlined"
                  size="small"
                >
                  Campaigns
                </MuiButton>
              </div>
              {campaignPerformance.length ? (
                <>
                  <div className="chart">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={campaignPerformance}
                        barGap={5}
                        margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                      >
                        <CartesianGrid vertical={false} stroke="#E8EFEB" />
                        <XAxis
                          dataKey="name"
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                          tick={{ fill: "#6D7E74" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tickLine={false}
                          axisLine={false}
                          fontSize={11}
                          tick={{ fill: "#6D7E74" }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(14,122,75,.04)" }}
                          contentStyle={{
                            border: "1px solid #DDE6E1",
                            borderRadius: 10,
                            boxShadow: "0 12px 32px rgba(17,35,26,.08)",
                          }}
                        />
                        <Bar
                          isAnimationActive={false}
                          dataKey="recipients"
                          name="Recipients"
                          fill="#D5E4DC"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={42}
                        />
                        <Bar
                          isAnimationActive={false}
                          dataKey="delivered"
                          name="Delivered"
                          fill="#387b6f"
                          radius={[5, 5, 0, 0]}
                          maxBarSize={42}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="dashboard-chart-meta">
                    <span className="chart-stat">
                      Total sent <strong>{number(d.total_sent)}</strong>
                    </span>
                    <span className="chart-stat">
                      Delivered <strong>{number(d.total_delivered)}</strong>
                    </span>
                    <span className="chart-stat">
                      Failed <strong>{number(d.total_failed)}</strong>
                    </span>
                  </div>
                </>
              ) : (
                <Empty
                  title="No campaign data yet"
                  description="Create and send a campaign to start seeing delivery performance here."
                  action={
                    <MuiButton component={Link} to="/campaigns/create">
                      Create campaign
                    </MuiButton>
                  }
                />
              )}
            </section>

            <section className="panel">
              <Typography variant="h2">Audience health</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.7 }}
              >
                Current contact status across your audience.
              </Typography>
              <div className="chart" style={{ height: 205 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      isAnimationActive={false}
                      data={audienceData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={56}
                      outerRadius={76}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        border: "1px solid #DDE6E1",
                        borderRadius: 10,
                        boxShadow: "0 12px 32px rgba(17,35,26,.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="health-list">
                {audienceData.map((item, index) => {
                  const share = d.total_contacts
                    ? Math.round((item.value / d.total_contacts) * 100)
                    : 0;
                  return (
                    <div className="health-row" key={item.name}>
                      <div className="health-left">
                        <span
                          className="health-dot"
                          style={{ background: chartColors[index] }}
                        />
                        <Typography variant="body2">{item.name}</Typography>
                        <span className="health-share">{share}%</span>
                      </div>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {number(item.value)}
                      </Typography>
                    </div>
                  );
                })}
              </div>
              <MuiButton
                component={Link}
                to="/contacts"
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Manage audience
              </MuiButton>
            </section>
          </div>

          <div className="dashboard-secondary">
            <section className="panel data-card">
              <div className="data-card-head">
                <div>
                  <Typography variant="h2">Recent campaigns</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Latest campaign activity
                  </Typography>
                </div>
                <MuiButton
                  component={Link}
                  to="/campaigns"
                  variant="text"
                  endIcon={<ArrowForwardOutlined />}
                >
                  View all
                </MuiButton>
              </div>
              <DataTable
                rows={d.recent_campaigns}
                columns={[
                  {
                    name: "Campaign",
                    render: (c) => (
                      <Link to={`/campaigns/${c.id}`}>
                        <strong>{c.name}</strong>
                        <div className="email-line">{date(c.created_at)}</div>
                      </Link>
                    ),
                  },
                  {
                    name: "Status",
                    render: (c) => <StatusChip status={c.status} />,
                  },
                  {
                    name: "Recipients",
                    render: (c) => number(c.total_recipients),
                  },
                  {
                    name: "Delivered",
                    render: (c) => number(c.delivered_count),
                  },
                ]}
                empty={
                  <Empty
                    title="Your first campaign starts here"
                    description="Choose an audience, craft your message, and review before sending."
                    action={
                      <MuiButton component={Link} to="/campaigns/create">
                        Create campaign
                      </MuiButton>
                    }
                  />
                }
              />
            </section>

            <section className="panel">
              <Typography variant="h2">Delivery overview</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.7 }}
              >
                Current lifetime delivery totals reported by your provider.
              </Typography>
              <div className="delivery-summary">
                <div className="delivery-tile">
                  <span>Delivered</span>
                  <strong>{number(d.total_delivered)}</strong>
                </div>
                <div className="delivery-tile">
                  <span>Bounced</span>
                  <strong>{number(d.total_bounced)}</strong>
                </div>
                <div className="delivery-tile">
                  <span>Failed</span>
                  <strong>{number(d.total_failed)}</strong>
                </div>
                <div className="delivery-tile">
                  <span>Completed campaigns</span>
                  <strong>{number(d.completed_campaigns)}</strong>
                </div>
              </div>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 2 }}
              >
                Open and click reporting is available inside each campaign
                analytics view.
              </Typography>
            </section>
          </div>
        </>
      )}
    </>
  );
}
