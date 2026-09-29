import { test, expect } from "@playwright/test";

test("contact editing, confirmation, keyboard and connection recovery", async ({
  page,
  context,
}) => {
  await page.goto("/login");
  await page.getByLabel("Username").fill("browser-test");
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.E2E_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Dashboard", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Contacts", exact: true }).click();
  await page
    .getByRole("button", { name: "Add contact", exact: true })
    .first()
    .click();
  await page.getByLabel("First name").fill("Temporary");
  await page.getByLabel(/^Email/).fill("temporary@example.com");
  await page
    .getByRole("button", { name: "Create contact", exact: true })
    .click();
  const row = page
    .getByRole("row")
    .filter({ hasText: "temporary@example.com" });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("First name").fill("Updated");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(row).toContainText("Updated");
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("First name").fill("Discard me");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "Discard unsaved changes?" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(row).toContainText("Updated");
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText("temporary@example.com");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Delete", exact: true })
    .click();
  await expect(row).toHaveCount(0);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByText("resend", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Contacts", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Contacts", exact: true }),
  ).toBeVisible();
  await context.setOffline(true);
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText(
    "Unable to reach the server",
  );
  await context.setOffline(false);
  await page.getByRole("button", { name: "Retry", exact: true }).click();
  await expect(page.getByText("resend", { exact: true })).toBeVisible();
});
