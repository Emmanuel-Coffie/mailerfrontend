import { beforeEach, afterEach, describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { routes } from "../App";
import { session, normalizeError } from "../api/client";
import { authApi } from "../api/auth";
import { dashboardApi } from "../api/dashboard";
import { contactsApi } from "../api/contacts";
import { listsApi } from "../api/lists";
import { templatesApi } from "../api/templates";
import { campaignsApi } from "../api/campaigns";
import { settingsApi, unsubscribeApi } from "../api/settings";
import type { Campaign, DashboardMetrics } from "../api/types";
import { rate } from "../pages/Analytics";
import { ConfirmDialog, EmailPreview } from "../components/ui";

const empty = { count: 0, next: null, previous: null, results: [] };
const metrics: DashboardMetrics = {
  total_contacts: 0,
  active_contacts: 0,
  unsubscribed_contacts: 0,
  bounced_contacts: 0,
  suppressed_contacts: 0,
  total_campaigns: 0,
  draft_campaigns: 0,
  scheduled_campaigns: 0,
  completed_campaigns: 0,
  total_sent: 0,
  total_delivered: 0,
  total_bounced: 0,
  total_failed: 0,
  recent_campaigns: [],
};
const campaign: Campaign = {
  id: 9,
  name: "Launch",
  subject: "Welcome",
  html_content: "",
  text_content: "Hello",
  contact_lists: [],
  template: null,
  status: "draft",
  from_name: "",
  from_email: "",
  reply_to: "",
  total_recipients: 0,
  scheduled_at: null,
  started_at: null,
  completed_at: null,
  sent_count: 0,
  delivered_count: 0,
  bounced_count: 0,
  failed_count: 0,
  opened_count: 0,
  clicked_count: 0,
  unsubscribed_count: 0,
  created_at: "2026-09-28T10:00:00Z",
  updated_at: "2026-09-28T10:00:00Z",
};
function mount(path: string, authenticated = true) {
  if (authenticated)
    session.set({ access: "isolated-token", refresh: "isolated-refresh" });
  return render(
    <RouterProvider
      router={createMemoryRouter(routes, { initialEntries: [path] })}
    />,
  );
}
beforeEach(() => {
  session.clear();
  vi.spyOn(dashboardApi, "get").mockResolvedValue(metrics);
  vi.spyOn(contactsApi, "list").mockResolvedValue(empty);
  vi.spyOn(listsApi, "all").mockResolvedValue([]);
  vi.spyOn(templatesApi, "all").mockResolvedValue([]);
});
afterEach(() => {
  vi.restoreAllMocks();
  session.clear();
});

describe("authentication and errors", () => {
  it("protects management routes", async () => {
    mount("/contacts", false);
    expect(
      await screen.findByRole("heading", { name: "Welcome back" }),
    ).toBeInTheDocument();
  });
  it("validates login and signs in", async () => {
    vi.spyOn(authApi, "login").mockImplementation(async () =>
      session.set({ access: "token", refresh: "refresh" }),
    );
    mount("/login", false);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByText("Enter your username.")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Username"), "operator");
    await user.type(screen.getByLabelText("Password"), "test-password");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(
      await screen.findByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
  });
  it("normalizes DRF field validation", () => {
    const parsed = normalizeError({
      isAxiosError: true,
      response: { status: 400, data: { email: ["Already exists."] } },
    });
    expect(parsed).toEqual({
      message: "Already exists.",
      fieldErrors: { email: "Already exists." },
      statusCode: 400,
    });
  });
  it("explains network failure", () => {
    expect(normalizeError({ isAxiosError: true }).message).toContain(
      "Unable to reach",
    );
  });
});
describe("audience and templates", () => {
  it("loads contacts and shows an empty state", async () => {
    mount("/contacts");
    expect(await screen.findByText("No contacts yet")).toBeInTheDocument();
    expect(contactsApi.list).toHaveBeenCalledWith({});
  });
  it("validates contact email before saving", async () => {
    const create = vi.spyOn(contactsApi, "create");
    mount("/contacts");
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: "Add contact" })[0]);
    const dialog = screen.getByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: "Create contact" }),
    );
    expect(
      await within(dialog).findByText("This field is required."),
    ).toBeInTheDocument();
    expect(create).not.toHaveBeenCalled();
  });
  it("renders the actual import summary", async () => {
    vi.spyOn(contactsApi, "import").mockResolvedValue({
      total: 8,
      valid: 5,
      imported: 4,
      existing: 1,
      duplicates: 2,
      invalid: 1,
    });
    mount("/contacts/import");
    const user = userEvent.setup();
    await user.upload(
      await screen.findByLabelText("CSV file"),
      new File(["email\na@example.com"], "contacts.csv", { type: "text/csv" }),
    );
    await user.click(screen.getByRole("button", { name: "Import contacts" }));
    expect(await screen.findByText("Import results")).toBeInTheDocument();
    expect(screen.getByText("Duplicates")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
  });
  it("validates the template form", async () => {
    mount("/templates/create");
    await screen.findByLabelText(/Template name/);
    await userEvent.click(
      screen.getByRole("button", { name: "Save template" }),
    );
    expect((await screen.findAllByText("This field is required.")).length).toBe(
      2,
    );
  });
  it("sandboxes email HTML", () => {
    render(<EmailPreview html="<script>bad()</script>" />);
    const frame = screen.getByTitle("Email content preview");
    expect(frame).toHaveAttribute("sandbox", "");
    expect(frame.getAttribute("srcdoc")).toContain("default-src 'none'");
  });
});
describe("campaign workflow", () => {
  it("creates a real draft and moves to recipients", async () => {
    vi.spyOn(campaignsApi, "create").mockResolvedValue(campaign);
    vi.spyOn(campaignsApi, "get").mockResolvedValue(campaign);
    mount("/campaigns/create");
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText(/Campaign name/), "Launch");
    await user.type(screen.getByLabelText(/Subject/), "Welcome");
    await user.click(screen.getByRole("button", { name: "Save & continue" }));
    expect(await screen.findByText("Choose your audience")).toBeInTheDocument();
    expect(campaignsApi.create).toHaveBeenCalled();
  });
  it("renders server preparation counts", async () => {
    vi.spyOn(campaignsApi, "get").mockResolvedValue(campaign);
    vi.spyOn(campaignsApi, "recipients").mockResolvedValue(empty);
    vi.spyOn(campaignsApi, "prepare").mockResolvedValue({
      selected: 11,
      duplicates_removed: 2,
      unsubscribed_excluded: 1,
      bounced_excluded: 1,
      suppressed_excluded: 0,
      invalid_excluded: 0,
      eligible: 7,
    });
    mount("/campaigns/9");
    await userEvent.click(
      await screen.findByRole("button", { name: "Prepare recipients" }),
    );
    expect(await screen.findByText("Preparation results")).toBeInTheDocument();
    expect(screen.getByText("Eligible")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
  });
  it("requires explicit send confirmation", async () => {
    const send = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Send campaign?"
        description="Send to 7 recipients?"
        action="Send campaign"
        danger={false}
        onClose={() => {}}
        onConfirm={send}
      />,
    );
    expect(send).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Send campaign" }),
    );
    expect(send).toHaveBeenCalledOnce();
  });
  it("preserves null analytics rates", () => {
    expect(rate(null)).toBe("—");
    expect(rate(0)).toBe("0%");
  });
  it("shows configuration without secrets", async () => {
    vi.spyOn(settingsApi, "get").mockResolvedValue({
      provider: "resend",
      api_configured: false,
      from_email_configured: true,
      reply_to_configured: false,
      webhook_secret_configured: false,
    });
    mount("/settings");
    expect(await screen.findByText("resend")).toBeInTheDocument();
    expect(screen.getAllByText("● Not configured")).toHaveLength(3);
  });
});
describe("public unsubscribe", () => {
  it("shows loading then success without authentication", async () => {
    vi.spyOn(unsubscribeApi, "get").mockResolvedValue({
      detail: "Your preference is saved.",
    });
    mount("/unsubscribe/opaque", false);
    expect(await screen.findByText("You’re unsubscribed")).toBeInTheDocument();
    expect(screen.getByText("Your preference is saved.")).toBeInTheDocument();
  });
  it("shows invalid token state", async () => {
    vi.spyOn(unsubscribeApi, "get").mockRejectedValue({
      isAxiosError: true,
      response: { status: 404, data: { detail: "Not found." } },
    });
    mount("/unsubscribe/bad", false);
    expect(await screen.findByText("This link is invalid")).toBeInTheDocument();
  });
  it("offers retry for a temporary failure", async () => {
    vi.spyOn(unsubscribeApi, "get").mockRejectedValue({ isAxiosError: true });
    mount("/unsubscribe/opaque", false);
    expect(
      await screen.findByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
