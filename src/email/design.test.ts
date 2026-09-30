import { describe, expect, it } from "vitest";
import {
  designIssues,
  designText,
  newBlock,
  readDesign,
  renderEmail,
  safeUrl,
  starterDesign,
} from "./design";
describe("visual email persistence and safety", () => {
  it("round-trips visual blocks through the existing HTML field, including Unicode and personalization", () => {
    const design = starterDesign("outreach");
    design.blocks[1].text = "Hello {{first_name}} — café 🌿";
    const html = renderEmail(design);
    expect(readDesign(html)).toEqual(design);
    expect(html).toContain("{{first_name}}");
    expect(html).toContain('role="presentation"');
    expect(designText(design)).toContain("café 🌿");
  });
  it("preserves legacy and externally edited HTML by refusing visual conversion", () => {
    expect(readDesign("<p>Existing content</p>")).toBeNull();
    const html = renderEmail(starterDesign("newsletter"));
    expect(
      readDesign(html.replace("Good things,", "External edit,")),
    ).toBeNull();
    expect(readDesign("<!--greenhaul-design-v1:broken-->")).toBeNull();
  });
  it("escapes text, attributes and disallows script, data and relative URLs", () => {
    const d = starterDesign("outreach");
    d.blocks = [
      { ...newBlock("heading"), text: "<img src=x onerror=alert(1)>" },
      { ...newBlock("button"), url: "javascript:alert(1)" },
      {
        ...newBlock("image"),
        text: '" onerror="bad',
        url: "data:image/svg+xml,attack",
      },
    ];
    const html = renderEmail(d, false);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("&lt;img");
    expect(safeUrl("//evil.test")).toBe("");
    expect(safeUrl("https://example.com/picture.jpg", true)).toBe(
      "https://example.com/picture.jpg",
    );
    expect(safeUrl("mailto:hello@example.com")).toBe(
      "mailto:hello@example.com",
    );
  });
  it("creates readable plain text and warns about unfinished links", () => {
    const d = starterDesign("outreach");
    expect(designIssues(d)).toHaveLength(1);
    const button = d.blocks.find((b) => b.kind === "button")!;
    button.url = "https://example.com/contact";
    expect(designIssues(d)).toHaveLength(0);
    expect(designText(d)).toContain("https://example.com/contact");
    expect(designText(d)).not.toContain("<table");
  });
  it("rejects unsupported metadata instead of losing message content", () => {
    const design = starterDesign("welcome");
    const html = renderEmail({
      ...design,
      version: 2,
    } as unknown as typeof design);
    expect(readDesign(html)).toBeNull();
  });
});
