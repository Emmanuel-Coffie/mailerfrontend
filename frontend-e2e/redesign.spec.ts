import { test, expect } from "@playwright/test";
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByLabel("Username").fill("Local design review");
  await page.getByLabel("Password", { exact: true }).fill("local-demo-only");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
}
test("visual template saves, reopens and supplies campaign content without new API fields", async ({
  page,
}) => {
  await login(page);
  await page.goto("/templates");
  await page.getByRole("button", { name: /A thoughtful introduction/ }).click();
  await page.getByLabel("Template name").fill("Partner introduction");
  await page.getByLabel("Subject", { exact: false }).fill("A personal hello");
  await page.getByRole("button", { name: "Edit heading section 2" }).click();
  await page.getByLabel("Section text").fill("A stronger connection.");
  await page.getByRole("button", { name: "Edit button section 4" }).click();
  await page.getByLabel("Button link").fill("https://example.com/contact");
  await page
    .getByRole("button", { name: "Save template", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Templates", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Partner introduction", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Edit heading section 2" }),
  ).toContainText("A stronger connection.");
  await page.getByRole("button", { name: "Preview", exact: true }).click();
  const frame = page
    .frameLocator('iframe[title="Email content preview"]')
    .first();
  await expect(
    frame.getByRole("heading", { name: "A stronger connection." }),
  ).toBeVisible();
  await expect(
    frame.getByRole("link", { name: "Let’s connect" }),
  ).toHaveAttribute("href", "https://example.com/contact");
  await page
    .getByRole("button", { name: "Preview template", exact: true })
    .click();
  await expect(
    page.locator('iframe[title="Email content preview"]'),
  ).toHaveCount(2);
  const db = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mailflow_mock_data_v1")!),
  );
  const saved = db.templates.find(
    (t: { name: string }) => t.name === "Partner introduction",
  );
  expect(saved.html_content).toContain("greenhaul-design-v1:");
  expect(saved.text_content).toContain("A stronger connection.");
  expect(saved).not.toHaveProperty("design");
  await page.goto("/campaigns/create");
  await page.getByLabel("Campaign name").fill("Partner update");
  await page
    .getByLabel("Subject", { exact: false })
    .fill("Latest from our team");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Save & continue" }).click();
  await page.getByLabel("Choose template (optional)").click();
  await page.getByRole("option", { name: "Partner introduction" }).click();
  await expect(
    page.getByRole("button", { name: "Edit heading section 2" }),
  ).toContainText("A stronger connection.");
  await page.getByRole("button", { name: "Change starting design" }).click();
  await page.getByRole("button", { name: /From our side of the desk/ }).click();
  await page
    .getByRole("button", { name: "Replace design", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Edit heading section 2" }),
  ).toContainText("Moving forward.");
  await page.getByRole("button", { name: "Edit heading section 2" }).click();
  await page.getByLabel("Section text").fill("Just for our partners.");
  await page.getByRole("button", { name: "Save & continue" }).click();
  await expect(
    page.getByText("Set your sender", { exact: true }),
  ).toBeVisible();
  const campaignDb = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mailflow_mock_data_v1")!),
  );
  expect(
    campaignDb.campaigns.find(
      (c: { name: string }) => c.name === "Partner update",
    ).html_content,
  ).toContain("Just for our partners.");
  expect(
    campaignDb.templates.find(
      (t: { name: string }) => t.name === "Partner introduction",
    ).html_content,
  ).not.toContain("Just for our partners.");
});
test("responsive routes, navigation, brand assets and form recovery", async ({
  page,
}) => {
  await login(page);
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/dashboard",
      "/contacts",
      "/contact-lists",
      "/templates",
      "/campaigns",
      "/settings",
      "/contacts/import",
      "/campaigns/create",
    ]) {
      await page.goto(route);
      await expect(page.locator("main h1")).toBeVisible();
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
          ),
        )
        .toBe(true);
    }
  }
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Templates", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Templates", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close navigation" }),
  ).not.toBeVisible();
  await page.goto("/templates/create");
  await page.getByLabel("Template name").fill("Unsaved draft");
  await page.getByRole("link", { name: "All templates" }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Discard unsaved changes?",
  );
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Template name")).toHaveValue("Unsaved draft");
  expect(await page.locator('link[rel="icon"]').getAttribute("href")).toBe(
    "/brand-logo.jpg",
  );
});
test("mobile section editing, keyboard selection and final viewport captures", async ({
  page,
}) => {
  await login(page);
  for (const [width, suffix] of [
    [1440, "desktop"],
    [390, "mobile"],
  ] as const) {
    await page.setViewportSize({ width, height: 1000 });
    for (const [route, name] of [
      ["/dashboard", suffix],
      ["/templates", `templates-${suffix}`],
      ["/contacts", `contacts-${suffix}`],
    ] as const) {
      await page.goto(route);
      await page.locator("main h1").waitFor();
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: `.impeccable/review/${name}.png`,
        fullPage: true,
      });
    }
    await page.goto("/templates/create?starter=outreach");
    await page.getByRole("button", { name: "Edit heading section 2" }).click();
    await expect(page.getByLabel("Section text")).toBeInViewport();
    await page.getByLabel("Section text").fill("Hello, partner.");
    await page.getByLabel("Alignment", { exact: true }).click();
    await page.getByRole("option", { name: "Center", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Edit heading section 2" }),
    ).toHaveCSS("text-align", "center");
    await expect(page.getByRole("listbox")).not.toBeVisible();
    await page.evaluate(() => {
      (document.activeElement as HTMLElement)?.blur();
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: `.impeccable/review/editor-${suffix}.png`,
      fullPage: true,
    });
  }
});
