import { Link, useParams } from "react-router-dom";
import { Button as MuiButton, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { campaignsApi } from "../api/campaigns";
import { useResource, label } from "../hooks";
import { ErrorNotice, Loading, Metric, MetricSkeleton, PageHeading } from "../components/ui";
import { RecipientTable } from "./CampaignDetail";
export const rate = (value: number | null) =>
  value === null ? "—" : `${value}%`;
export function Analytics() {
  const { id = "" } = useParams();
  const state = useResource(() => campaignsApi.analytics(id), id);
  const a = state.data;
  return (
    <>
      <PageHeading
        title="Campaign analytics"
        kicker="Performance Telemetry"
        description="Inspect real-time delivery telemetry, open rate tracking, recipient click activity, and bounce diagnostics."
        actions={
          <MuiButton
            component={Link}
            to={`/campaigns/${id}`}
            variant="outlined"
          >
            Back to campaign
          </MuiButton>
        }
      />
      <ErrorNotice error={state.error} retry={state.reload} />
      {!a ? (
        state.loading ? (
          <div className="grid grid-4">
            {Array.from({ length: 8 }, (_, i) => (
              <MetricSkeleton key={i} />
            ))}
          </div>
        ) : null
      ) : (
        <>
          <div className="grid grid-4">
            {(
              [
                "total",
                "sent",
                "delivered",
                "bounced",
                "failed",
                "opened",
                "clicked",
                "unsubscribed",
              ] as const
            ).map((key) => (
              <Metric key={key} title={label(key)} value={a[key]} />
            ))}
          </div>
          <div className="grid grid-2" style={{ marginTop: 24 }}>
            <section className="panel">
              <Typography variant="h2" sx={{ mb: 2 }}>
                Delivery events
              </Typography>
              <div className="chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Delivered",
                        value: a.delivered,
                        color: "#16A34A",
                      },
                      { name: "Bounced", value: a.bounced, color: "#F79009" },
                      { name: "Failed", value: a.failed, color: "#F04438" },
                    ]}
                  >
                    <CartesianGrid vertical={false} stroke="#EEF2EF" />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      allowDecimals={false}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={50}>
                      {["#16A34A", "#F79009", "#F04438"].map((color) => (
                        <Cell key={color} fill={color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
            <section className="panel">
              <Typography variant="h2" sx={{ mb: 2 }}>
                Engagement rates
              </Typography>
              <div className="grid grid-2">
                {(
                  [
                    "delivery_rate",
                    "bounce_rate",
                    "open_rate",
                    "click_rate",
                    "unsubscribe_rate",
                  ] as const
                ).map((key) => (
                  <div key={key}>
                    <Typography variant="body2" color="text.secondary">
                      {label(key)}
                    </Typography>
                    <Typography sx={{ fontSize: 24, fontWeight: 600, my: 1 }}>
                      {rate(a[key])}
                    </Typography>
                  </div>
                ))}
              </div>
              <Typography variant="caption" color="text.secondary">
                A dash means the rate is not yet available. Opens and clicks
                depend on tracking and may include automated activity.
              </Typography>
            </section>
          </div>
          <RecipientTable id={id} />
        </>
      )}
    </>
  );
}
