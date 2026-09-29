import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button as MuiButton,
  Slider,
  Typography,
} from "@mui/material";
import ArrowForwardOutlined from "@mui/icons-material/ArrowForwardOutlined";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import SendOutlined from "@mui/icons-material/SendOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import SpeedOutlined from "@mui/icons-material/SpeedOutlined";
import GroupsOutlined from "@mui/icons-material/GroupsOutlined";
import AutoGraphOutlined from "@mui/icons-material/AutoGraphOutlined";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import SecurityOutlined from "@mui/icons-material/SecurityOutlined";
import LayersOutlined from "@mui/icons-material/LayersOutlined";
import BoltOutlined from "@mui/icons-material/BoltOutlined";
import CodeOutlined from "@mui/icons-material/CodeOutlined";
import { Brand } from "../components/Layout";
import { useAuth } from "../auth";
import { number } from "../hooks";

export function Landing() {
  const { authenticated } = useAuth();
  const navigate = useNavigate();
  const [audienceVolume, setAudienceVolume] = useState<number>(25000);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Deliverability calculator computations
  const estimatedSendMinutes = Math.max(1, Math.round(audienceVolume / 14000));
  const expectedDelivered = Math.round(audienceVolume * 0.994);
  const projectedOpens = Math.round(audienceVolume * 0.412);
  const projectedClicks = Math.round(audienceVolume * 0.185);

  const previewTabs = [
    {
      id: "audience",
      title: "Audience Segmentation",
      label: "Clean lists with automatic deduplication",
      headline: "Zero dirty data. Guaranteed suppression re-checks.",
      description:
        "Import CSVs up to 500,000 rows. GreenHaul Solutions automatically normalizes headers, removes duplicate entries within lists, and isolates unsubscribed or bounced contacts before any draft is sent.",
      badges: ["CSV Drag & Drop", "Real-time Deduplication", "Strict Suppression Checks"],
    },
    {
      id: "templates",
      title: "Sandboxed Templates",
      label: "Safe variable injection without CSS leaks",
      headline: "Pixel-perfect previews rendered in an isolated sandbox.",
      description:
        "Compose responsive HTML and plain text with double-curly tags like {{first_name}} and {{company}}. Previews execute inside a sandboxed iframe with default-src 'none' to block third-party trackers.",
      badges: ["CSP default-src 'none'", "Live Variable Tokens", "Multi-client HTML"],
    },
    {
      id: "telemetry",
      title: "Recipient Telemetry",
      label: "Real-time delivery verification per recipient",
      headline: "Inspect individual delivery timestamps and bounce reasons.",
      description:
        "Every sent message records its provider message ID, first attempt timestamp, delivery confirmation, and user engagement states without relying on vanity averages.",
      badges: ["Provider Message IDs", "Instant Webhook Sync", "Per-Recipient Statuses"],
    },
  ];

  return (
    <div className="landing-root">
      {/* Top Bar Navigation */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-brand-link" aria-label="GreenHaul Solutions Home">
            <Brand />
          </Link>

          <nav className="landing-nav-links" aria-label="Landing Navigation">
            <a href="#capabilities">Capabilities</a>
            <a href="#audience-engine">Audience Hub</a>
            <a href="#calculator">Deliverability</a>
            <a href="#pricing">Pricing</a>
          </nav>

          <div className="landing-nav-actions">
            {authenticated ? (
              <MuiButton
                component={Link}
                to="/dashboard"
                variant="contained"
                endIcon={<ArrowForwardOutlined />}
              >
                Go to Workspace
              </MuiButton>
            ) : (
              <>
                <MuiButton
                  component={Link}
                  to="/login"
                  variant="text"
                  sx={{ color: "#3B5245", fontWeight: 650 }}
                >
                  Sign in
                </MuiButton>
                <MuiButton
                  component={Link}
                  to="/login"
                  variant="contained"
                  endIcon={<ArrowForwardOutlined />}
                >
                  Open Workspace
                </MuiButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-kicker">
            <AutoGraphOutlined sx={{ fontSize: 15 }} />
            <span>Enterprise-Grade Campaign Delivery Engine</span>
          </div>

          <Typography
            variant="h1"
            className="landing-hero-headline"
            sx={{
              fontSize: { xs: "36px", sm: "52px", md: "64px" },
              lineHeight: 1.08,
              fontWeight: 750,
              letterSpacing: "-2px",
              color: "#081E14",
              maxWidth: 880,
              mx: "auto",
              textWrap: "balance",
            }}
          >
            Precision email campaigns. Zero delivery guesswork.
          </Typography>

          <Typography
            className="landing-hero-sub"
            sx={{
              fontSize: { xs: "16px", sm: "19px" },
              lineHeight: 1.6,
              color: "#4A6154",
              maxWidth: 680,
              mx: "auto",
              mt: 2.5,
              mb: 4.5,
              textWrap: "balance",
            }}
          >
            GreenHaul Solutions unites audience segmentation, sandboxed template authoring,
            and real-time inbox telemetry into one focused, distraction-free
            operations hub.
          </Typography>

          <div className="landing-hero-cta">
            <MuiButton
              component={Link}
              to={authenticated ? "/dashboard" : "/login"}
              variant="contained"
              size="large"
              endIcon={<ArrowForwardOutlined />}
              sx={{
                minHeight: 52,
                px: 3.5,
                fontSize: 15.5,
                boxShadow: "0 14px 34px rgba(14, 122, 75, 0.28)",
              }}
            >
              {authenticated ? "Enter Workspace" : "Launch Free Workspace"}
            </MuiButton>

            <MuiButton
              variant="outlined"
              size="large"
              onClick={() => {
                const el = document.getElementById("calculator");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              sx={{ minHeight: 52, px: 3, fontSize: 15 }}
            >
              Calculate Deliverability
            </MuiButton>
          </div>

          {/* Social Proof Strip */}
          <div className="landing-proof-strip">
            <div className="proof-item">
              <strong>99.4%</strong>
              <span>Average Inbox Rate</span>
            </div>
            <span className="proof-sep">·</span>
            <div className="proof-item">
              <strong>40k/min</strong>
              <span>Throughput Engine</span>
            </div>
            <span className="proof-sep">·</span>
            <div className="proof-item">
              <strong>100% Isolated</strong>
              <span>Sandboxed CSP Previews</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="landing-hero-visual-frame">
          <div className="browser-chrome">
            <div className="chrome-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="chrome-address">
              <ShieldOutlined sx={{ fontSize: 13, color: "#19A76A" }} />
              <span>greenhaul.app/workspace/campaigns/active</span>
            </div>
            <div className="chrome-status">
              <span className="pulse-indicator" />
              <span>Engine Ready</span>
            </div>
          </div>

          <div className="hero-image-wrapper">
            <img
              src="/src/assets/images/landing_hero_mockup_1790700659532.jpg"
              alt="GreenHaul Solutions campaign management and real-time deliverability workspace"
              className="hero-image"
              referrerPolicy="no-referrer"
            />
            <div className="hero-floating-stat top-left">
              <MarkEmailReadOutlined sx={{ color: "#0E7A4B", fontSize: 20 }} />
              <div>
                <span className="stat-title">Delivery Succeeded</span>
                <strong>4,280 / 4,280 (100%)</strong>
              </div>
            </div>
            <div className="hero-floating-stat bottom-right">
              <SpeedOutlined sx={{ color: "#0E7A4B", fontSize: 20 }} />
              <div>
                <span className="stat-title">Average Latency</span>
                <strong>42ms via Resend TLS</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="landing-section">
        <div className="section-head">
          <span className="section-kicker">Core Infrastructure</span>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 750 }}>
            Engineered for high-volume email confidence
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: "auto", mt: 1.5 }}>
            Every component is purpose-built to eliminate failed deliveries,
            prevent accidental spam triggers, and give marketing operations clarity.
          </Typography>
        </div>

        <div className="bento-grid">
          {/* Card 1: Wide 2-columns */}
          <div className="bento-card bento-wide">
            <div className="bento-badge">
              <GroupsOutlined sx={{ fontSize: 18 }} />
              <span>Audience Engine</span>
            </div>
            <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 700, mt: 1.5 }}>
              Precision list management & CSV deduplication
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.2, mb: 3, maxWidth: 540 }}>
              Bulk upload subscriber lists with automatic email validation. Duplicates
              within your file and suppressed contacts are excluded before any campaign queue is formed.
            </Typography>

            <div className="mini-demo-table">
              <div className="mini-demo-row header">
                <span>Contact Email</span>
                <span>Company</span>
                <span>Verification</span>
              </div>
              <div className="mini-demo-row">
                <span>ada.lovelace@analytical.io</span>
                <span>Analytical Engine</span>
                <span className="tag-clean">Active · Verified</span>
              </div>
              <div className="mini-demo-row">
                <span>alan.turing@bletchley.org</span>
                <span>Computing Lab</span>
                <span className="tag-clean">Active · Verified</span>
              </div>
              <div className="mini-demo-row">
                <span>katherine@space.org</span>
                <span>Orbital Mechanics</span>
                <span className="tag-clean">Active · Verified</span>
              </div>
            </div>
          </div>

          {/* Card 2: 1-column image asset */}
          <div className="bento-card bento-image-card">
            <img
              src="/src/assets/images/landing_feature_delivery_1790700672286.jpg"
              alt="High-deliverability encrypted communication routing nodes"
              className="bento-img"
              referrerPolicy="no-referrer"
            />
            <div className="bento-image-overlay">
              <div className="bento-badge dark">
                <SecurityOutlined sx={{ fontSize: 16 }} />
                <span>Provider Handshake</span>
              </div>
              <Typography variant="h3" sx={{ color: "#fff", fontSize: 19, mt: 1 }}>
                Authenticated TLS Delivery Pipeline
              </Typography>
              <Typography sx={{ color: "#BFDACB", fontSize: 13, mt: 0.8 }}>
                Signed webhooks, SPF/DKIM verification, and isolated retry queues.
              </Typography>
            </div>
          </div>

          {/* Card 3: 1-column */}
          <div className="bento-card">
            <div className="bento-badge">
              <CodeOutlined sx={{ fontSize: 18 }} />
              <span>Sandboxed Studio</span>
            </div>
            <Typography variant="h3" sx={{ fontSize: 20, fontWeight: 700, mt: 1.5 }}>
              Strict CSP HTML Previews
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13.5 }}>
              Test variable replacements like <code>{"{{first_name}}"}</code> in an
              isolated iframe without tracking beacon leaks or unexpected layout shifts.
            </Typography>
            <div className="code-snippet-box">
              <code>{"<p>Hello {{first_name}},</p>"}</code>
              <code>{"<p>Your team at {{company}} is ready.</p>"}</code>
            </div>
          </div>

          {/* Card 4: Wide 2-columns */}
          <div className="bento-card bento-wide">
            <div className="bento-badge">
              <BoltOutlined sx={{ fontSize: 18 }} />
              <span>Live Telemetry</span>
            </div>
            <Typography variant="h3" sx={{ fontSize: 22, fontWeight: 700, mt: 1.5 }}>
              Comprehensive recipient audit trails
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 2.5 }}>
              Track exact delivery confirmations, bounce diagnostics, and engagement metrics
              for every single email sent through your campaigns.
            </Typography>
            <div className="metrics-pill-row">
              <div className="metric-pill">
                <span>Delivery Rate</span>
                <strong>99.4%</strong>
              </div>
              <div className="metric-pill">
                <span>Unique Opens</span>
                <strong>42.8%</strong>
              </div>
              <div className="metric-pill">
                <span>Click-to-Open</span>
                <strong>28.1%</strong>
              </div>
              <div className="metric-pill">
                <span>Unsubscribe Rate</span>
                <strong>0.04%</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Deliverability Calculator */}
      <section id="calculator" className="landing-section alt-bg">
        <div className="section-head">
          <span className="section-kicker">ROI & Throughput Estimator</span>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 750 }}>
            Simulate your audience delivery performance
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: "auto", mt: 1 }}>
            Adjust your subscriber count to preview expected throughput speeds and engagement numbers.
          </Typography>
        </div>

        <div className="calculator-box">
          <div className="calculator-slider-area">
            <div className="slider-header">
              <span className="slider-label">Audience Volume</span>
              <strong className="slider-value">{number(audienceVolume)} subscribers</strong>
            </div>
            <Slider
              value={audienceVolume}
              min={1000}
              max={250000}
              step={1000}
              onChange={(_, v) => setAudienceVolume(v as number)}
              sx={{
                color: "#0E7A4B",
                height: 8,
                "& .MuiSlider-thumb": {
                  width: 24,
                  height: 24,
                  backgroundColor: "#fff",
                  border: "3px solid #0E7A4B",
                  boxShadow: "0 4px 12px rgba(14,122,75,0.3)",
                },
              }}
            />
            <div className="slider-ticks">
              <span>1,000</span>
              <span>50,000</span>
              <span>100,000</span>
              <span>250,000+</span>
            </div>
          </div>

          <div className="calculator-results-grid">
            <div className="calc-result-card">
              <span className="calc-label">Est. Send Duration</span>
              <strong className="calc-stat">~{estimatedSendMinutes} min</strong>
              <span className="calc-sub">At 14,000 msgs/min burst</span>
            </div>
            <div className="calc-result-card highlight">
              <span className="calc-label">Projected Inboxes</span>
              <strong className="calc-stat">{number(expectedDelivered)}</strong>
              <span className="calc-sub">99.4% deliverability baseline</span>
            </div>
            <div className="calc-result-card">
              <span className="calc-label">Projected Opens</span>
              <strong className="calc-stat">~{number(projectedOpens)}</strong>
              <span className="calc-sub">Based on 41.2% benchmark</span>
            </div>
            <div className="calc-result-card">
              <span className="calc-label">Projected Clicks</span>
              <strong className="calc-stat">~{number(projectedClicks)}</strong>
              <span className="calc-sub">18.5% CTR benchmark</span>
            </div>
          </div>

          <div className="calculator-cta">
            <MuiButton
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardOutlined />}
            >
              Start Sending with GreenHaul Solutions
            </MuiButton>
          </div>
        </div>
      </section>

      {/* Interactive Tabs Showcase */}
      <section id="audience-engine" className="landing-section">
        <div className="section-head">
          <span className="section-kicker">Step-By-Step Workflow</span>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 750 }}>
            From audience import to inbox impact in minutes
          </Typography>
        </div>

        <div className="workflow-container">
          <div className="workflow-tab-bar" role="tablist">
            {previewTabs.map((tab, idx) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === idx}
                className={`workflow-tab-btn ${activeTab === idx ? "active" : ""}`}
                onClick={() => setActiveTab(idx)}
              >
                <span className="tab-number">0{idx + 1}</span>
                <span className="tab-title">{tab.title}</span>
              </button>
            ))}
          </div>

          <div className="workflow-display-card">
            <div className="workflow-card-content">
              <Typography variant="caption" className="workflow-eyebrow">
                {previewTabs[activeTab].label}
              </Typography>
              <Typography variant="h3" sx={{ fontSize: 24, fontWeight: 700, mt: 1, mb: 1.5 }}>
                {previewTabs[activeTab].headline}
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.7, mb: 3 }}>
                {previewTabs[activeTab].description}
              </Typography>
              <div className="badge-row">
                {previewTabs[activeTab].badges.map((b) => (
                  <span key={b} className="check-badge">
                    <CheckCircleOutline sx={{ fontSize: 16, color: "#0E7A4B" }} />
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="workflow-card-action">
              <MuiButton
                component={Link}
                to="/login"
                variant="outlined"
                endIcon={<ArrowForwardOutlined />}
              >
                Experience {previewTabs[activeTab].title}
              </MuiButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="landing-section alt-bg">
        <div className="section-head">
          <span className="section-kicker">Verified Customer Outcomes</span>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 750 }}>
            Trusted by campaign operators worldwide
          </Typography>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card">
            <Typography sx={{ fontStyle: "italic", lineHeight: 1.7, color: "#183225" }}>
              "GreenHaul Solutions replaced our bloated marketing suite. We cut our campaign prep time by 75%
              and our inbox placement jumped from 91% to 99.4% in our very first week."
            </Typography>
            <div className="testimonial-author">
              <div className="author-avatar">ER</div>
              <div>
                <strong>Elena Rostova</strong>
                <span>VP of Growth · CloudScale Technologies</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <Typography sx={{ fontStyle: "italic", lineHeight: 1.7, color: "#183225" }}>
              "The sandboxed HTML preview alone saved us from broken Outlook emails. It is by far the cleanest,
              most reliable campaign tool we have deployed."
            </Typography>
            <div className="testimonial-author">
              <div className="author-avatar">AT</div>
              <div>
                <strong>Dr. Aris Thorne</strong>
                <span>Lead Infrastructure Architect · Synthetix Bio</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <Typography sx={{ fontStyle: "italic", lineHeight: 1.7, color: "#183225" }}>
              "Real-time webhook sync gives our sales team immediate visibility into delivered pitches.
              GreenHaul Solutions pays for itself on every single product launch."
            </Typography>
            <div className="testimonial-author">
              <div className="author-avatar">JH</div>
              <div>
                <strong>Julian Hayes</strong>
                <span>Head of Inbound · Vantage Dynamics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="landing-section">
        <div className="section-head">
          <span className="section-kicker">Predictable Value</span>
          <Typography variant="h2" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 750 }}>
            Simple plans for every campaign scale
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 620, mx: "auto", mt: 1 }}>
            No hidden contact penalties. All plans include full recipient audit logs and sandboxed previews.
          </Typography>
        </div>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="pricing-header">
              <span className="plan-name">Starter</span>
              <div className="plan-price">
                <strong>$0</strong>
                <span>/ month (Developer Free)</span>
              </div>
              <p className="plan-desc">For testing campaigns, prototypes, and team demos.</p>
            </div>
            <ul className="plan-features">
              <li>Up to 2,500 active contacts</li>
              <li>Unlimited draft campaigns</li>
              <li>Sandboxed CSP HTML templates</li>
              <li>Community deliverability monitoring</li>
            </ul>
            <MuiButton
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              sx={{ mt: 3 }}
            >
              Get Started Free
            </MuiButton>
          </div>

          <div className="pricing-card popular">
            <div className="pricing-header">
              <div className="popular-badge">Most Popular</div>
              <span className="plan-name">Operations Pro</span>
              <div className="plan-price">
                <strong>$49</strong>
                <span>/ month</span>
              </div>
              <p className="plan-desc">For growing organizations running recurring updates.</p>
            </div>
            <ul className="plan-features">
              <li>Up to 50,000 active contacts</li>
              <li>Instant CSV deduplication engine</li>
              <li>Resend API integration & TLS routing</li>
              <li>Live recipient audit logs</li>
              <li>Automated scheduling & retry queues</li>
            </ul>
            <MuiButton
              component={Link}
              to="/login"
              variant="contained"
              fullWidth
              sx={{ mt: 3 }}
            >
              Start Pro Workspace
            </MuiButton>
          </div>

          <div className="pricing-card">
            <div className="pricing-header">
              <span className="plan-name">Enterprise Fleet</span>
              <div className="plan-price">
                <strong>$199</strong>
                <span>/ month</span>
              </div>
              <p className="plan-desc">High-burst infrastructure with custom sender domains.</p>
            </div>
            <ul className="plan-features">
              <li>Unlimited contacts & audience lists</li>
              <li>Dedicated IP pools & custom DKIM</li>
              <li>99.9% uptime SLA contract</li>
              <li>Priority webhook dispatch queues</li>
            </ul>
            <MuiButton
              component={Link}
              to="/login"
              variant="outlined"
              fullWidth
              sx={{ mt: 3 }}
            >
              Contact Fleet Sales
            </MuiButton>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-inner">
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontSize: { xs: 28, sm: 38 },
              fontWeight: 750,
              letterSpacing: "-1px",
              mb: 1.5,
            }}
          >
            Ready for higher deliverability on your next campaign?
          </Typography>
          <Typography
            sx={{
              color: "#B7D6C5",
              fontSize: 16,
              maxWidth: 580,
              mx: "auto",
              mb: 3.5,
              lineHeight: 1.6,
            }}
          >
            Sign in to your GreenHaul Solutions workspace in seconds. Built-in demo credentials
            enable instant access with zero setup.
          </Typography>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <MuiButton
              component={Link}
              to="/login"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardOutlined />}
              sx={{
                bgcolor: "#19A76A",
                color: "#051A10",
                fontWeight: 700,
                px: 4,
                "&:hover": { bgcolor: "#24BF7E" },
              }}
            >
              Sign In to GreenHaul Solutions
            </MuiButton>
            <MuiButton
              component={Link}
              to="/dashboard"
              variant="outlined"
              size="large"
              sx={{
                color: "#fff",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              View Dashboard
            </MuiButton>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="footer-col-brand">
            <Brand />
            <Typography variant="body2" sx={{ color: "#748C7F", mt: 1.5, maxWidth: 300 }}>
              GreenHaul Solutions · Precision campaign management and deliverability monitoring.
            </Typography>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <span className="footer-col-title">Workspace</span>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/contacts">Audience Contacts</Link>
              <Link to="/contact-lists">Contact Lists</Link>
              <Link to="/campaigns">Campaigns</Link>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Content</span>
              <Link to="/templates">Templates</Link>
              <Link to="/contacts/import">Import CSV</Link>
              <Link to="/settings">Provider Status</Link>
            </div>
            <div className="footer-col">
              <span className="footer-col-title">Account</span>
              <Link to="/login">Sign In</Link>
              <Link to="/login">Demo Access</Link>
            </div>
          </div>
        </div>

        <div className="landing-footer-bottom">
          <Typography variant="caption" sx={{ color: "#5E776A" }}>
            © {new Date().getFullYear()} GreenHaul Solutions. All rights reserved. Built with precision deliverability standards.
          </Typography>
        </div>
      </footer>
    </div>
  );
}
