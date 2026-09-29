import {
  AxiosHeaders,
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type {
  Campaign,
  CampaignAnalytics,
  CampaignRecipient,
  Contact,
  ContactList,
  DashboardMetrics,
  EmailTemplate,
  ImportResult,
  PaginatedResponse,
  PrepareResult,
  ProviderStatus,
} from "./types";

const STORAGE_KEY = "mailflow_mock_data_v1";

interface MockDatabase {
  contacts: Contact[];
  lists: ContactList[];
  templates: EmailTemplate[];
  campaigns: Campaign[];
  recipients: CampaignRecipient[];
  settings: ProviderStatus;
}

const defaultDatabase: MockDatabase = {
  contacts: [
    {
      id: 1,
      first_name: "Ada",
      last_name: "Lovelace",
      email: "ada@example.com",
      company: "Analytical Engine Corp",
      phone: "+1 555-0101",
      position: "Chief Computing Architect",
      status: "active",
      source: "Manual",
      notes: "Pioneer in computer algorithms",
      last_email_sent_at: "2026-09-20T10:01:00Z",
      last_email_opened_at: "2026-09-20T10:15:00Z",
      unsubscribed_at: null,
      bounced_at: null,
      created_at: "2026-09-01T08:00:00Z",
      updated_at: "2026-09-01T08:00:00Z",
    },
    {
      id: 2,
      first_name: "Alan",
      last_name: "Turing",
      email: "alan@bletchley.org",
      company: "Computing Machinery Lab",
      phone: "+1 555-0102",
      position: "Lead Cryptanalyst",
      status: "active",
      source: "Conference",
      notes: "Universal computing researcher",
      last_email_sent_at: "2026-09-20T10:01:00Z",
      last_email_opened_at: "2026-09-20T10:30:00Z",
      unsubscribed_at: null,
      bounced_at: null,
      created_at: "2026-09-02T09:00:00Z",
      updated_at: "2026-09-02T09:00:00Z",
    },
    {
      id: 3,
      first_name: "Grace",
      last_name: "Hopper",
      email: "grace@navy.mil",
      company: "Systems Programming Bureau",
      phone: "+1 555-0103",
      position: "Rear Admiral",
      status: "active",
      source: "Referral",
      notes: "Compiler pioneer and language designer",
      last_email_sent_at: "2026-09-20T10:01:00Z",
      last_email_opened_at: null,
      unsubscribed_at: null,
      bounced_at: null,
      created_at: "2026-09-03T10:00:00Z",
      updated_at: "2026-09-03T10:00:00Z",
    },
    {
      id: 4,
      first_name: "Katherine",
      last_name: "Johnson",
      email: "katherine@space.org",
      company: "Orbital Mechanics Center",
      phone: "+1 555-0104",
      position: "Aerospace Mathematician",
      status: "active",
      source: "Direct",
      notes: "Calculated orbital flight paths",
      last_email_sent_at: "2026-09-20T10:01:00Z",
      last_email_opened_at: "2026-09-20T11:00:00Z",
      unsubscribed_at: null,
      bounced_at: null,
      created_at: "2026-09-04T11:00:00Z",
      updated_at: "2026-09-04T11:00:00Z",
    },
  ],
  lists: [
    {
      id: 1,
      name: "VIP Customers",
      description: "Priority enterprise partners and early adopters",
      contacts: [1, 2],
      created_at: "2026-09-05T08:00:00Z",
      updated_at: "2026-09-05T08:00:00Z",
    },
    {
      id: 2,
      name: "Newsletter Subscribers",
      description: "Bi-weekly newsletter audience",
      contacts: [1, 2, 3, 4],
      created_at: "2026-09-06T08:00:00Z",
      updated_at: "2026-09-06T08:00:00Z",
    },
  ],
  templates: [
    {
      id: 1,
      name: "Personal introduction",
      subject: "Hello {{first_name}}",
      html_content:
        "<p>Hello {{first_name}},</p><p>Welcome to GreenHaul Solutions at {{company}}.</p><p>Best regards,<br/>The GreenHaul Solutions Team</p>",
      text_content:
        "Hello {{first_name}},\n\nWelcome to GreenHaul Solutions at {{company}}.\n\nBest regards,\nThe GreenHaul Solutions Team",
      created_at: "2026-09-07T08:00:00Z",
      updated_at: "2026-09-07T08:00:00Z",
    },
    {
      id: 2,
      name: "Feature Update Briefing",
      subject: "New improvements for {{company}}",
      html_content:
        "<p>Hi {{first_name}},</p><p>We've launched new analytics and template workflows to help your campaigns perform better.</p>",
      text_content:
        "Hi {{first_name}},\n\nWe've launched new analytics and template workflows to help your campaigns perform better.",
      created_at: "2026-09-08T08:00:00Z",
      updated_at: "2026-09-08T08:00:00Z",
    },
  ],
  campaigns: [
    {
      id: 1,
      name: "Welcome announcement",
      subject: "Welcome to GreenHaul Solutions, {{first_name}}",
      html_content:
        "<p>Hello {{first_name}}, welcome to GreenHaul Solutions at {{company}}.</p>",
      text_content:
        "Hello {{first_name}}, welcome to GreenHaul Solutions at {{company}}.",
      template: 1,
      contact_lists: [1, 2],
      from_name: "GreenHaul Solutions Team",
      from_email: "updates@greenhaul.io",
      reply_to: "support@greenhaul.io",
      status: "completed",
      scheduled_at: null,
      started_at: "2026-09-20T10:00:00Z",
      completed_at: "2026-09-20T10:02:00Z",
      total_recipients: 4,
      sent_count: 4,
      delivered_count: 4,
      bounced_count: 0,
      failed_count: 0,
      opened_count: 3,
      clicked_count: 2,
      unsubscribed_count: 0,
      created_at: "2026-09-15T12:00:00Z",
      updated_at: "2026-09-20T10:02:00Z",
    },
  ],
  recipients: [
    {
      id: 1,
      campaign: 1,
      contact: 1,
      email: "ada@example.com",
      first_name: "Ada",
      last_name: "Lovelace",
      company: "Analytical Engine Corp",
      position: "Chief Computing Architect",
      status: "delivered",
      provider_message_id: "resend-msg-1",
      sent_at: "2026-09-20T10:00:30Z",
      delivered_at: "2026-09-20T10:00:45Z",
      opened_at: "2026-09-20T10:15:00Z",
      clicked_at: "2026-09-20T10:16:30Z",
      bounced_at: null,
      failed_at: null,
      retry_count: 0,
      error_message: "",
      first_attempt_at: "2026-09-20T10:00:30Z",
      next_attempt_at: null,
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:16:30Z",
    },
    {
      id: 2,
      campaign: 1,
      contact: 2,
      email: "alan@bletchley.org",
      first_name: "Alan",
      last_name: "Turing",
      company: "Computing Machinery Lab",
      position: "Lead Cryptanalyst",
      status: "delivered",
      provider_message_id: "resend-msg-2",
      sent_at: "2026-09-20T10:00:30Z",
      delivered_at: "2026-09-20T10:00:50Z",
      opened_at: "2026-09-20T10:30:00Z",
      clicked_at: null,
      bounced_at: null,
      failed_at: null,
      retry_count: 0,
      error_message: "",
      first_attempt_at: "2026-09-20T10:00:30Z",
      next_attempt_at: null,
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:30:00Z",
    },
    {
      id: 3,
      campaign: 1,
      contact: 3,
      email: "grace@navy.mil",
      first_name: "Grace",
      last_name: "Hopper",
      company: "Systems Programming Bureau",
      position: "Rear Admiral",
      status: "delivered",
      provider_message_id: "resend-msg-3",
      sent_at: "2026-09-20T10:00:30Z",
      delivered_at: "2026-09-20T10:01:00Z",
      opened_at: null,
      clicked_at: null,
      bounced_at: null,
      failed_at: null,
      retry_count: 0,
      error_message: "",
      first_attempt_at: "2026-09-20T10:00:30Z",
      next_attempt_at: null,
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T10:01:00Z",
    },
    {
      id: 4,
      campaign: 1,
      contact: 4,
      email: "katherine@space.org",
      first_name: "Katherine",
      last_name: "Johnson",
      company: "Orbital Mechanics Center",
      position: "Aerospace Mathematician",
      status: "delivered",
      provider_message_id: "resend-msg-4",
      sent_at: "2026-09-20T10:00:30Z",
      delivered_at: "2026-09-20T10:01:10Z",
      opened_at: "2026-09-20T11:00:00Z",
      clicked_at: "2026-09-20T11:02:00Z",
      bounced_at: null,
      failed_at: null,
      retry_count: 0,
      error_message: "",
      first_attempt_at: "2026-09-20T10:00:30Z",
      next_attempt_at: null,
      created_at: "2026-09-20T10:00:00Z",
      updated_at: "2026-09-20T11:02:00Z",
    },
  ],
  settings: {
    provider: "resend",
    api_configured: true,
    from_email_configured: true,
    reply_to_configured: true,
    webhook_secret_configured: true,
  },
};

function loadDatabase(): MockDatabase {
  if (typeof window === "undefined" || !window.localStorage) {
    return structuredClone(defaultDatabase);
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as MockDatabase;
    }
  } catch {
    // ignore
  }
  const db = structuredClone(defaultDatabase);
  saveDatabase(db);
  return db;
}

function saveDatabase(db: MockDatabase) {
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    } catch {
      // ignore
    }
  }
}

function paginate<T>(items: T[], page = 1, pageSize = 50): PaginatedResponse<T> {
  const total = items.length;
  const start = (page - 1) * pageSize;
  const results = items.slice(start, start + pageSize);
  const next = start + pageSize < total ? `?page=${page + 1}` : null;
  const previous = page > 1 ? `?page=${page - 1}` : null;
  return { count: total, next, previous, results };
}

function createSuccessResponse(
  config: InternalAxiosRequestConfig,
  data: unknown,
  status = 200,
): AxiosResponse {
  return {
    data,
    status,
    statusText: status === 201 ? "Created" : "OK",
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
  };
}

function createErrorResponse(
  config: InternalAxiosRequestConfig,
  status: number,
  data: Record<string, unknown> | string[],
) {
  const response: AxiosResponse = {
    data,
    status,
    statusText: "Error",
    headers: new AxiosHeaders({ "content-type": "application/json" }),
    config,
  };
  return new AxiosError(
    typeof data === "object" && !Array.isArray(data) && data.detail
      ? String(data.detail)
      : "Request failed",
    String(status),
    config,
    undefined,
    response,
  );
}

export async function mockAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  const url = (config.url || "").replace(/^https?:\/\/[^/]+/, "");
  const method = (config.method || "get").toLowerCase();
  const db = loadDatabase();
  const now = new Date().toISOString();

  // Parse body
  let body: Record<string, any> = {};
  if (config.data) {
    if (typeof config.data === "string") {
      try {
        body = JSON.parse(config.data);
      } catch {
        body = {};
      }
    } else if (typeof config.data === "object" && !(config.data instanceof FormData)) {
      body = config.data;
    }
  }

  // 1. Auth token
  if (url === "/api/auth/token/" && method === "post") {
    if (!body.username || !body.password) {
      throw createErrorResponse(config, 400, {
        non_field_errors: ["Unable to log in with provided credentials."],
      });
    }
    return createSuccessResponse(config, {
      access: "mock-access-token-" + Date.now(),
      refresh: "mock-refresh-token-" + Date.now(),
    });
  }

  // 2. Auth token refresh
  if (url === "/api/auth/token/refresh/" && method === "post") {
    return createSuccessResponse(config, {
      access: "mock-access-token-refreshed-" + Date.now(),
    });
  }

  // 3. Dashboard metrics
  if (url === "/api/email/dashboard/" && method === "get") {
    const totalContacts = db.contacts.length;
    const activeContacts = db.contacts.filter((c) => c.status === "active").length;
    const unsubscribedContacts = db.contacts.filter((c) => c.status === "unsubscribed").length;
    const bouncedContacts = db.contacts.filter((c) => c.status === "bounced").length;
    const suppressedContacts = db.contacts.filter((c) => c.status === "suppressed").length;

    const totalCampaigns = db.campaigns.length;
    const draftCampaigns = db.campaigns.filter((c) => c.status === "draft").length;
    const scheduledCampaigns = db.campaigns.filter((c) => c.status === "scheduled").length;
    const completedCampaigns = db.campaigns.filter((c) => c.status === "completed").length;

    const totalSent = db.campaigns.reduce((acc, c) => acc + (c.sent_count || 0), 0);
    const totalDelivered = db.campaigns.reduce((acc, c) => acc + (c.delivered_count || 0), 0);
    const totalBounced = db.campaigns.reduce((acc, c) => acc + (c.bounced_count || 0), 0);
    const totalFailed = db.campaigns.reduce((acc, c) => acc + (c.failed_count || 0), 0);

    const metrics: DashboardMetrics = {
      total_contacts: totalContacts,
      active_contacts: activeContacts,
      unsubscribed_contacts: unsubscribedContacts,
      bounced_contacts: bouncedContacts,
      suppressed_contacts: suppressedContacts,
      total_campaigns: totalCampaigns,
      draft_campaigns: draftCampaigns,
      scheduled_campaigns: scheduledCampaigns,
      completed_campaigns: completedCampaigns,
      total_sent: totalSent,
      total_delivered: totalDelivered,
      total_bounced: totalBounced,
      total_failed: totalFailed,
      recent_campaigns: db.campaigns.slice(0, 5),
    };
    return createSuccessResponse(config, metrics);
  }

  // 4. Contacts
  if (url === "/api/email/contacts/import/" && method === "post") {
    let fileText = "";
    let listId: number | undefined;

    if (config.data instanceof FormData) {
      const file = config.data.get("file");
      const listVal = config.data.get("contact_list_id");
      if (listVal) listId = Number(listVal);
      if (file && typeof (file as File).text === "function") {
        fileText = await (file as File).text();
      }
    }

    const lines = fileText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    let total = 0;
    let valid = 0;
    let invalid = 0;
    let duplicates = 0;
    let existing = 0;
    let imported = 0;

    const seenInFile = new Set<string>();
    const existingEmails = new Set(db.contacts.map((c) => c.email.toLowerCase()));
    const createdIds: number[] = [];

    // Header index determination
    if (lines.length > 0) {
      const headerParts = lines[0].split(",").map((s) => s.trim().toLowerCase());
      const emailIdx = headerParts.indexOf("email");
      const fnIdx = headerParts.indexOf("first_name");
      const lnIdx = headerParts.indexOf("last_name");
      const companyIdx = headerParts.indexOf("company");

      for (let i = 1; i < lines.length; i++) {
        total++;
        const parts = lines[i].split(",").map((s) => s.trim());
        const email = (emailIdx >= 0 ? parts[emailIdx] : parts[0]) || "";
        const firstName = fnIdx >= 0 ? parts[fnIdx] : "";
        const lastName = lnIdx >= 0 ? parts[lnIdx] : "";
        const company = companyIdx >= 0 ? parts[companyIdx] : "";

        if (!email || !email.includes("@")) {
          invalid++;
          continue;
        }
        if (seenInFile.has(email.toLowerCase())) {
          duplicates++;
          continue;
        }
        seenInFile.add(email.toLowerCase());
        if (existingEmails.has(email.toLowerCase())) {
          existing++;
          continue;
        }

        valid++;
        imported++;
        const newId = (db.contacts.length ? Math.max(...db.contacts.map((c) => c.id)) : 0) + 1;
        const newContact: Contact = {
          id: newId,
          first_name: firstName,
          last_name: lastName,
          email,
          company,
          phone: "",
          position: "",
          status: "active",
          source: "CSV Import",
          notes: "",
          last_email_sent_at: null,
          last_email_opened_at: null,
          unsubscribed_at: null,
          bounced_at: null,
          created_at: now,
          updated_at: now,
        };
        db.contacts.push(newContact);
        existingEmails.add(email.toLowerCase());
        createdIds.push(newId);
      }
    }

    if (listId && createdIds.length > 0) {
      const targetList = db.lists.find((l) => l.id === listId);
      if (targetList) {
        targetList.contacts = Array.from(new Set([...targetList.contacts, ...createdIds]));
      }
    }

    saveDatabase(db);
    const result: ImportResult = {
      total,
      valid,
      invalid,
      duplicates,
      existing,
      imported,
    };
    return createSuccessResponse(config, result);
  }

  // Contacts CRUD
  const contactDetailMatch = url.match(/^\/api\/email\/contacts\/(\d+)\/$/);
  if (contactDetailMatch) {
    const id = Number(contactDetailMatch[1]);
    const index = db.contacts.findIndex((c) => c.id === id);

    if (method === "get") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Contact not found." });
      return createSuccessResponse(config, db.contacts[index]);
    }
    if (method === "patch") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Contact not found." });
      const updated = { ...db.contacts[index], ...body, updated_at: now };
      db.contacts[index] = updated;
      saveDatabase(db);
      return createSuccessResponse(config, updated);
    }
    if (method === "delete") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Contact not found." });
      db.contacts.splice(index, 1);
      // Remove from lists
      db.lists.forEach((l) => {
        l.contacts = l.contacts.filter((cid) => cid !== id);
      });
      saveDatabase(db);
      return createSuccessResponse(config, null, 204);
    }
  }

  if (url === "/api/email/contacts/" || url.startsWith("/api/email/contacts/?")) {
    if (method === "get") {
      const params = config.params || {};
      let filtered = [...db.contacts];

      if (params.search) {
        const query = String(params.search).toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.first_name.toLowerCase().includes(query) ||
            c.last_name.toLowerCase().includes(query) ||
            c.email.toLowerCase().includes(query) ||
            c.company.toLowerCase().includes(query),
        );
      }
      if (params.status) {
        filtered = filtered.filter((c) => c.status === params.status);
      }
      if (params.company) {
        const companyQuery = String(params.company).toLowerCase();
        filtered = filtered.filter((c) => c.company.toLowerCase().includes(companyQuery));
      }
      if (params.contact_lists) {
        const targetList = db.lists.find((l) => l.id === Number(params.contact_lists));
        if (targetList) {
          filtered = filtered.filter((c) => targetList.contacts.includes(c.id));
        } else {
          filtered = [];
        }
      }

      const page = Number(params.page || 1);
      return createSuccessResponse(config, paginate(filtered, page));
    }

    if (method === "post") {
      if (!body.email) {
        throw createErrorResponse(config, 400, { email: ["This field is required."] });
      }
      const newId = (db.contacts.length ? Math.max(...db.contacts.map((c) => c.id)) : 0) + 1;
      const newContact: Contact = {
        id: newId,
        first_name: body.first_name || "",
        last_name: body.last_name || "",
        email: body.email,
        company: body.company || "",
        phone: body.phone || "",
        position: body.position || "",
        status: body.status || "active",
        source: body.source || "Manual",
        notes: body.notes || "",
        last_email_sent_at: null,
        last_email_opened_at: null,
        unsubscribed_at: null,
        bounced_at: null,
        created_at: now,
        updated_at: now,
      };
      db.contacts.unshift(newContact);
      saveDatabase(db);
      return createSuccessResponse(config, newContact, 201);
    }
  }

  // 5. Lists
  const listMemberAdd = url.match(/^\/api\/email\/lists\/(\d+)\/add-contacts\/$/);
  if (listMemberAdd && method === "post") {
    const id = Number(listMemberAdd[1]);
    const targetList = db.lists.find((l) => l.id === id);
    if (!targetList) throw createErrorResponse(config, 404, { detail: "List not found." });
    const contactIds = Array.isArray(body.contact_ids) ? body.contact_ids : [];
    targetList.contacts = Array.from(new Set([...targetList.contacts, ...contactIds]));
    targetList.updated_at = now;
    saveDatabase(db);
    return createSuccessResponse(config, targetList);
  }

  const listMemberRemove = url.match(/^\/api\/email\/lists\/(\d+)\/remove-contacts\/$/);
  if (listMemberRemove && method === "post") {
    const id = Number(listMemberRemove[1]);
    const targetList = db.lists.find((l) => l.id === id);
    if (!targetList) throw createErrorResponse(config, 404, { detail: "List not found." });
    const contactIds = Array.isArray(body.contact_ids) ? body.contact_ids : [];
    const removeSet = new Set(contactIds);
    targetList.contacts = targetList.contacts.filter((cid) => !removeSet.has(cid));
    targetList.updated_at = now;
    saveDatabase(db);
    return createSuccessResponse(config, targetList);
  }

  const listDetailMatch = url.match(/^\/api\/email\/lists\/(\d+)\/$/);
  if (listDetailMatch) {
    const id = Number(listDetailMatch[1]);
    const index = db.lists.findIndex((l) => l.id === id);
    if (method === "get") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "List not found." });
      return createSuccessResponse(config, db.lists[index]);
    }
    if (method === "patch") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "List not found." });
      const updated = { ...db.lists[index], ...body, updated_at: now };
      db.lists[index] = updated;
      saveDatabase(db);
      return createSuccessResponse(config, updated);
    }
    if (method === "delete") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "List not found." });
      db.lists.splice(index, 1);
      saveDatabase(db);
      return createSuccessResponse(config, null, 204);
    }
  }

  if (url === "/api/email/lists/" || url.startsWith("/api/email/lists/?")) {
    if (method === "get") {
      const params = config.params || {};
      let filtered = [...db.lists];
      if (params.search) {
        const query = String(params.search).toLowerCase();
        filtered = filtered.filter(
          (l) => l.name.toLowerCase().includes(query) || l.description.toLowerCase().includes(query),
        );
      }
      const page = Number(params.page || 1);
      return createSuccessResponse(config, paginate(filtered, page));
    }
    if (method === "post") {
      if (!body.name) {
        throw createErrorResponse(config, 400, { name: ["This field is required."] });
      }
      const newId = (db.lists.length ? Math.max(...db.lists.map((l) => l.id)) : 0) + 1;
      const newList: ContactList = {
        id: newId,
        name: body.name,
        description: body.description || "",
        contacts: body.contacts || [],
        created_at: now,
        updated_at: now,
      };
      db.lists.unshift(newList);
      saveDatabase(db);
      return createSuccessResponse(config, newList, 201);
    }
  }

  // 6. Templates
  const templatePreviewMatch = url.match(/^\/api\/email\/templates\/(\d+)\/preview\/$/);
  if (templatePreviewMatch && method === "post") {
    const id = Number(templatePreviewMatch[1]);
    const template = db.templates.find((t) => t.id === id);
    if (!template) throw createErrorResponse(config, 404, { detail: "Template not found." });

    const tokens: Record<string, string> = {
      first_name: body.first_name || "Ada",
      last_name: body.last_name || "Lovelace",
      company: body.company || "Analytical Engine Corp",
      position: body.position || "Chief Computing Architect",
    };

    let subject = template.subject;
    let html = template.html_content;
    let text = template.text_content;

    for (const [key, val] of Object.entries(tokens)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      subject = subject.replace(regex, val);
      html = html.replace(regex, val);
      text = text.replace(regex, val);
    }

    return createSuccessResponse(config, { subject, html, text });
  }

  const templateDetailMatch = url.match(/^\/api\/email\/templates\/(\d+)\/$/);
  if (templateDetailMatch) {
    const id = Number(templateDetailMatch[1]);
    const index = db.templates.findIndex((t) => t.id === id);
    if (method === "get") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Template not found." });
      return createSuccessResponse(config, db.templates[index]);
    }
    if (method === "patch") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Template not found." });
      const updated = { ...db.templates[index], ...body, updated_at: now };
      db.templates[index] = updated;
      saveDatabase(db);
      return createSuccessResponse(config, updated);
    }
    if (method === "delete") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Template not found." });
      db.templates.splice(index, 1);
      saveDatabase(db);
      return createSuccessResponse(config, null, 204);
    }
  }

  if (url === "/api/email/templates/" || url.startsWith("/api/email/templates/?")) {
    if (method === "get") {
      const params = config.params || {};
      let filtered = [...db.templates];
      if (params.search) {
        const query = String(params.search).toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.name.toLowerCase().includes(query) ||
            t.subject.toLowerCase().includes(query),
        );
      }
      const page = Number(params.page || 1);
      return createSuccessResponse(config, paginate(filtered, page));
    }
    if (method === "post") {
      if (!body.name) {
        throw createErrorResponse(config, 400, { name: ["This field is required."] });
      }
      const newId = (db.templates.length ? Math.max(...db.templates.map((t) => t.id)) : 0) + 1;
      const newTemplate: EmailTemplate = {
        id: newId,
        name: body.name,
        subject: body.subject || "",
        html_content: body.html_content || "",
        text_content: body.text_content || "",
        created_at: now,
        updated_at: now,
      };
      db.templates.unshift(newTemplate);
      saveDatabase(db);
      return createSuccessResponse(config, newTemplate, 201);
    }
  }

  // 7. Campaigns
  const campaignPrepareMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/prepare\/$/);
  if (campaignPrepareMatch && method === "post") {
    const id = Number(campaignPrepareMatch[1]);
    const campaign = db.campaigns.find((c) => c.id === id);
    if (!campaign) throw createErrorResponse(config, 404, { detail: "Campaign not found." });

    const contactIdSet = new Set<number>();
    for (const listId of campaign.contact_lists) {
      const list = db.lists.find((l) => l.id === listId);
      if (list) {
        for (const cid of list.contacts) contactIdSet.add(cid);
      }
    }

    const contactsInLists = Array.from(contactIdSet)
      .map((cid) => db.contacts.find((c) => c.id === cid))
      .filter((c): c is Contact => !!c);

    const selected = contactsInLists.length;
    let unsubscribedExcluded = 0;
    let bouncedExcluded = 0;
    let suppressedExcluded = 0;
    let invalidExcluded = 0;
    let eligible = 0;

    for (const c of contactsInLists) {
      if (!c.email || !c.email.includes("@")) {
        invalidExcluded++;
      } else if (c.status === "unsubscribed") {
        unsubscribedExcluded++;
      } else if (c.status === "bounced") {
        bouncedExcluded++;
      } else if (c.status === "suppressed") {
        suppressedExcluded++;
      } else {
        eligible++;
      }
    }

    const result: PrepareResult = {
      selected,
      duplicates_removed: 0,
      unsubscribed_excluded: unsubscribedExcluded,
      bounced_excluded: bouncedExcluded,
      suppressed_excluded: suppressedExcluded,
      invalid_excluded: invalidExcluded,
      eligible,
    };
    return createSuccessResponse(config, result);
  }

  const campaignTestMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/test\/$/);
  if (campaignTestMatch && method === "post") {
    return createSuccessResponse(config, { id: "mock-test-" + Date.now() });
  }

  const campaignSendMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/send\/$/);
  if (campaignSendMatch && method === "post") {
    const id = Number(campaignSendMatch[1]);
    const campaign = db.campaigns.find((c) => c.id === id);
    if (!campaign) throw createErrorResponse(config, 404, { detail: "Campaign not found." });

    const contactIdSet = new Set<number>();
    for (const listId of campaign.contact_lists) {
      const list = db.lists.find((l) => l.id === listId);
      if (list) {
        for (const cid of list.contacts) contactIdSet.add(cid);
      }
    }
    const eligibleContacts = Array.from(contactIdSet)
      .map((cid) => db.contacts.find((c) => c.id === cid))
      .filter((c): c is Contact => !!c && c.status === "active" && c.email.includes("@"));

    // Create recipients
    eligibleContacts.forEach((contact) => {
      const recId = (db.recipients.length ? Math.max(...db.recipients.map((r) => r.id)) : 0) + 1;
      const recipient: CampaignRecipient = {
        id: recId,
        campaign: id,
        contact: contact.id,
        email: contact.email,
        first_name: contact.first_name,
        last_name: contact.last_name,
        company: contact.company,
        position: contact.position,
        status: "delivered",
        provider_message_id: "resend-msg-" + recId,
        sent_at: now,
        delivered_at: now,
        opened_at: null,
        clicked_at: null,
        bounced_at: null,
        failed_at: null,
        retry_count: 0,
        error_message: "",
        first_attempt_at: now,
        next_attempt_at: null,
        created_at: now,
        updated_at: now,
      };
      db.recipients.push(recipient);
      contact.last_email_sent_at = now;
    });

    campaign.status = "completed";
    campaign.started_at = now;
    campaign.completed_at = now;
    campaign.total_recipients = eligibleContacts.length;
    campaign.sent_count = eligibleContacts.length;
    campaign.delivered_count = eligibleContacts.length;
    campaign.opened_count = 0;
    campaign.clicked_count = 0;
    campaign.bounced_count = 0;
    campaign.failed_count = 0;
    campaign.unsubscribed_count = 0;
    campaign.updated_at = now;

    saveDatabase(db);
    return createSuccessResponse(config, {
      campaign_id: id,
      status: "completed",
      recipients: eligibleContacts.length,
    });
  }

  const campaignScheduleMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/schedule\/$/);
  if (campaignScheduleMatch && method === "post") {
    const id = Number(campaignScheduleMatch[1]);
    const campaign = db.campaigns.find((c) => c.id === id);
    if (!campaign) throw createErrorResponse(config, 404, { detail: "Campaign not found." });
    campaign.status = "scheduled";
    campaign.scheduled_at = body.scheduled_at || now;
    campaign.updated_at = now;
    saveDatabase(db);
    return createSuccessResponse(config, campaign);
  }

  const campaignCancelMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/cancel\/$/);
  if (campaignCancelMatch && method === "post") {
    const id = Number(campaignCancelMatch[1]);
    const campaign = db.campaigns.find((c) => c.id === id);
    if (!campaign) throw createErrorResponse(config, 404, { detail: "Campaign not found." });
    campaign.status = "cancelled";
    campaign.updated_at = now;
    saveDatabase(db);
    return createSuccessResponse(config, campaign);
  }

  const campaignAnalyticsMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/analytics\/$/);
  if (campaignAnalyticsMatch && method === "get") {
    const id = Number(campaignAnalyticsMatch[1]);
    const campaign = db.campaigns.find((c) => c.id === id);
    if (!campaign) throw createErrorResponse(config, 404, { detail: "Campaign not found." });

    const total = campaign.total_recipients || 0;
    const sent = campaign.sent_count || 0;
    const delivered = campaign.delivered_count || 0;
    const bounced = campaign.bounced_count || 0;
    const failed = campaign.failed_count || 0;
    const opened = campaign.opened_count || 0;
    const clicked = campaign.clicked_count || 0;
    const unsubscribed = campaign.unsubscribed_count || 0;

    const analytics: CampaignAnalytics = {
      total,
      sent,
      delivered,
      bounced,
      failed,
      opened,
      clicked,
      unsubscribed,
      delivery_rate: sent > 0 ? delivered / sent : null,
      bounce_rate: sent > 0 ? bounced / sent : null,
      open_rate: delivered > 0 ? opened / delivered : null,
      click_rate: delivered > 0 ? clicked / delivered : null,
      unsubscribe_rate: delivered > 0 ? unsubscribed / delivered : null,
    };
    return createSuccessResponse(config, analytics);
  }

  const campaignRecipientsMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/recipients\/$/);
  if (campaignRecipientsMatch && method === "get") {
    const id = Number(campaignRecipientsMatch[1]);
    const params = config.params || {};
    let filtered = db.recipients.filter((r) => r.campaign === id);

    if (params.search) {
      const q = String(params.search).toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.first_name.toLowerCase().includes(q) ||
          r.last_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q) ||
          r.company.toLowerCase().includes(q),
      );
    }
    if (params.status) {
      filtered = filtered.filter((r) => r.status === params.status);
    }

    const page = Number(params.page || 1);
    return createSuccessResponse(config, paginate(filtered, page));
  }

  const campaignDetailMatch = url.match(/^\/api\/email\/campaigns\/(\d+)\/$/);
  if (campaignDetailMatch) {
    const id = Number(campaignDetailMatch[1]);
    const index = db.campaigns.findIndex((c) => c.id === id);
    if (method === "get") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Campaign not found." });
      return createSuccessResponse(config, db.campaigns[index]);
    }
    if (method === "patch") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Campaign not found." });
      const updated = { ...db.campaigns[index], ...body, updated_at: now };
      db.campaigns[index] = updated;
      saveDatabase(db);
      return createSuccessResponse(config, updated);
    }
    if (method === "delete") {
      if (index === -1) throw createErrorResponse(config, 404, { detail: "Campaign not found." });
      db.campaigns.splice(index, 1);
      saveDatabase(db);
      return createSuccessResponse(config, null, 204);
    }
  }

  if (url === "/api/email/campaigns/" || url.startsWith("/api/email/campaigns/?")) {
    if (method === "get") {
      const params = config.params || {};
      let filtered = [...db.campaigns];
      if (params.search) {
        const query = String(params.search).toLowerCase();
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(query) ||
            c.subject.toLowerCase().includes(query),
        );
      }
      if (params.status) {
        filtered = filtered.filter((c) => c.status === params.status);
      }
      const page = Number(params.page || 1);
      return createSuccessResponse(config, paginate(filtered, page));
    }
    if (method === "post") {
      if (!body.name) {
        throw createErrorResponse(config, 400, { name: ["This field is required."] });
      }
      const newId = (db.campaigns.length ? Math.max(...db.campaigns.map((c) => c.id)) : 0) + 1;
      const newCampaign: Campaign = {
        id: newId,
        name: body.name,
        subject: body.subject || "",
        html_content: body.html_content || "",
        text_content: body.text_content || "",
        template: body.template || null,
        contact_lists: body.contact_lists || [],
        from_name: body.from_name || "",
        from_email: body.from_email || "",
        reply_to: body.reply_to || "",
        status: body.status || "draft",
        scheduled_at: null,
        started_at: null,
        completed_at: null,
        total_recipients: 0,
        sent_count: 0,
        delivered_count: 0,
        bounced_count: 0,
        failed_count: 0,
        opened_count: 0,
        clicked_count: 0,
        unsubscribed_count: 0,
        created_at: now,
        updated_at: now,
      };
      db.campaigns.unshift(newCampaign);
      saveDatabase(db);
      return createSuccessResponse(config, newCampaign, 201);
    }
  }

  // 8. Settings
  if (url === "/api/email/settings/status/" && method === "get") {
    return createSuccessResponse(config, db.settings);
  }

  // 9. Unsubscribe
  const unsubMatch = url.match(/^\/api\/email\/unsubscribe\/([^/]+)\/$/);
  if (unsubMatch && method === "get") {
    const token = decodeURIComponent(unsubMatch[1]);
    if (token === "bad" || token === "invalid") {
      throw createErrorResponse(config, 404, { detail: "This unsubscribe link is invalid." });
    }
    // Mark first contact or matching contact as unsubscribed
    if (db.contacts.length > 0) {
      db.contacts[0].status = "unsubscribed";
      db.contacts[0].unsubscribed_at = now;
      saveDatabase(db);
    }
    return createSuccessResponse(config, {
      detail: "Your preference is saved. You’re unsubscribed.",
    });
  }

  // Fallback 404
  throw createErrorResponse(config, 404, { detail: "Endpoint not found: " + url });
}
