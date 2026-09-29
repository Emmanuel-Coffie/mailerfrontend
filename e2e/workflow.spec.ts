import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createHmac } from "node:crypto";

test("complete browser workflow against Django with mocked provider", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await page.getByLabel("Username").fill("browser-test");
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Your first campaign starts here")).toBeVisible();
  await page.getByRole("link", { name: "Contacts", exact: true }).click();
  await page
    .getByRole("button", { name: "Add contact", exact: true })
    .first()
    .click();
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel(/^Email/).fill("ada@example.com");
  await page
    .getByLabel("Company", { exact: true })
    .last()
    .fill("Example Company");
  await page
    .getByRole("button", { name: "Create contact", exact: true })
    .click();
  await expect(
    page.getByRole("cell", { name: "ada@example.com", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Import CSV", exact: true }).click();
  await page
    .getByLabel("CSV file")
    .setInputFiles({
      name: "audience.csv",
      mimeType: "text/csv",
      buffer: Buffer.from(
        "email,first_name\nsam@example.com,Sam\nsam@example.com,Duplicate\ninvalid,Invalid\n",
      ),
    });
  await page
    .getByRole("button", { name: "Import contacts", exact: true })
    .click();
  await expect(page.getByText("Import results")).toBeVisible();
  await page.getByRole("link", { name: "Contact Lists", exact: true }).click();
  await page
    .getByRole("button", { name: "Create list", exact: true })
    .first()
    .click();
  await page.getByLabel("List name").fill("Customers");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create list", exact: true })
    .click();
  await page.getByRole("link", { name: "Customers", exact: true }).click();
  await page
    .getByRole("button", { name: "Add contacts", exact: true })
    .first()
    .click();
  await page.getByRole("checkbox", { name: "Select ada@example.com" }).check();
  await page.getByRole("checkbox", { name: "Select sam@example.com" }).check();
  await page.getByRole("button", { name: "Add 2 selected contacts" }).click();
  await expect(page.getByText("2 contacts in this list")).toBeVisible();
  await page.getByRole("link", { name: "Templates", exact: true }).click();
  await page
    .getByRole("link", { name: "Create template", exact: true })
    .first()
    .click();
  await page.getByLabel("Template name").fill("Personal introduction");
  await page.getByLabel(/^Subject/).fill("Hello {{first_name}}");
  await page
    .getByLabel("HTML content", { exact: true })
    .fill("<p>Hello {{first_name}}, welcome to {{company}}.</p>");
  await page
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Personal introduction", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Preview template", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hello Ada", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Campaigns", exact: true }).click();
  await page
    .getByRole("link", { name: "Create campaign", exact: true })
    .first()
    .click();
  await page.getByLabel("Campaign name").fill("Welcome campaign");
  await page.getByLabel(/^Subject/).fill("Hello {{first_name}}");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByRole("checkbox", { name: /Customers/ }).check();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByLabel("Choose template (optional)").click();
  await page
    .getByRole("option", { name: "Personal introduction", exact: true })
    .click();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByLabel("From email").fill("sender@example.com");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByLabel("Test email address").fill("test@example.com");
  await page
    .getByRole("button", { name: "Send test email", exact: true })
    .click();
  await expect(
    page.getByText("Test email accepted for delivery."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save & continue" }).click();
  // Exercise native scheduling selection without committing a schedule here.
  await page.getByLabel("Schedule for later").check();
  await expect(page.getByLabel("Send date and time")).toBeVisible();
  await page.getByLabel("Send immediately after review").check();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page
    .getByRole("button", { name: "Send campaign", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("2 eligible recipients");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Send campaign", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome campaign", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("● Completed", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "View analytics", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Campaign analytics" }),
  ).toBeVisible();
  await expect(
    page.getByRole("cell", { name: "ada@example.com", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/analytics-desktop.png",
    fullPage: true,
  });
  const deliveries = JSON.parse(
    readFileSync("test-results/sent-emails.json", "utf8"),
  ) as { id: string; payload: { html: string; to: string[] } }[];
  const delivery = deliveries.find(
    (entry) => entry.payload.to[0] === "ada@example.com",
  )!;
  const token = delivery.payload.html.match(/unsubscribe\/([^/]+)\//)![1];
  // Signed provider webhook, through the real public API.
  const svixId = "browser-event-1",
    timestamp = Math.floor(Date.now() / 1000).toString();
  const body = JSON.stringify({
    type: "email.delivered",
    created_at: new Date().toISOString(),
    data: { email_id: delivery.id },
  });
  const signature = createHmac(
    "sha256",
    Buffer.from(process.env.E2E_WEBHOOK_SECRET!.slice(6), "base64"),
  )
    .update(`${svixId}.${timestamp}.${body}`)
    .digest("base64");
  const webhook = await request.post(
    "http://127.0.0.1:8018/api/email/webhooks/resend/",
    {
      data: body,
      headers: {
        "Content-Type": "application/json",
        "svix-id": svixId,
        "svix-timestamp": timestamp,
        "svix-signature": "v1," + signature,
      },
    },
  );
  expect(webhook.status()).toBe(200);
  const publicPage = await page.context().newPage();
  await publicPage.goto("/unsubscribe/" + token);
  await expect(publicPage.getByText("You’re unsubscribed")).toBeVisible();
  await publicPage.reload();
  await expect(publicPage.getByText("You’re unsubscribed")).toBeVisible();
  await publicPage.close();
  await page.getByRole("link", { name: "Contacts", exact: true }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "ada@example.com" }),
  ).toContainText("Unsubscribed");
  await page.getByRole("link", { name: "Campaigns", exact: true }).click();
  await page
    .getByRole("link", { name: "Create campaign", exact: true })
    .first()
    .click();
  await page.getByLabel("Campaign name").fill("Follow up");
  await page.getByLabel(/^Subject/).fill("News");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByRole("checkbox", { name: /Customers/ }).check();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await expect(
    page.getByText("Eligible recipients").locator(".."),
  ).toContainText("1");
  await page.getByLabel("Plain text content").fill("Follow up message");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByLabel("Schedule for later").check();
  const future = new Date(Date.now() + 86400000);
  const local = new Date(future.getTime() - future.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  await page.getByLabel("Send date and time").fill(local);
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page
    .getByRole("button", { name: "Schedule campaign", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Schedule campaign", exact: true })
    .click();
  await expect(page.getByText("● Scheduled", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Cancel campaign", exact: true })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel campaign", exact: true })
    .click();
  await expect(page.getByText("● Cancelled", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByText("resend", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Dashboard", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/dashboard-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});
