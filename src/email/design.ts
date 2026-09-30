/** Visual designs travel inside the existing HTML field; no additional API fields. */
export type BlockKind =
  | "heading"
  | "text"
  | "button"
  | "image"
  | "divider"
  | "columns"
  | "spacer"
  | "footer";
export interface EmailBlock {
  id: string;
  kind: BlockKind;
  text: string;
  secondary?: string;
  url?: string;
  color: string;
  background: string;
  align: "left" | "center" | "right";
}
export interface EmailDesign {
  version: 1;
  background: string;
  surface: string;
  accent: string;
  font: "Arial" | "Georgia" | "Verdana";
  blocks: EmailBlock[];
}
export const blockLabels: Record<BlockKind, string> = {
  heading: "Heading",
  text: "Text",
  button: "Button",
  image: "Image",
  divider: "Divider",
  columns: "Two columns",
  spacer: "Space",
  footer: "Footer",
};
export function newBlock(kind: BlockKind): EmailBlock {
  return {
    id: crypto.randomUUID(),
    kind,
    align: "left",
    color: kind === "button" ? "#ffffff" : "#203d3c",
    background: "#ffffff",
    text: {
      heading: "A little news. A big possibility.",
      text: "Hi {{first_name}},\n\nShare something worth opening. Add your message here.",
      button: "Explore more",
      image: "Describe your image",
      divider: "",
      columns: "Made for your next chapter.\nTell your audience what matters.",
      spacer: "",
      footer: "GreenHaul Solutions\nThank you for being part of our community.",
    }[kind],
    ...(kind === "button" || kind === "image" ? { url: "" } : {}),
    ...(kind === "columns"
      ? { secondary: "A fresh perspective.\nMake room for something new." }
      : {}),
  };
}
export function emptyDesign(): EmailDesign {
  return {
    version: 1,
    background: "#edf2f3",
    surface: "#ffffff",
    accent: "#245c58",
    font: "Arial",
    blocks: [],
  };
}
export const starterInfo = [
  {
    id: "outreach",
    name: "A thoughtful introduction",
    description: "A personal, polished opening to a new relationship.",
    tone: "#dae7ed",
    label: "Business outreach",
  },
  {
    id: "update",
    name: "From our side of the desk",
    description: "Keep clients and partners in the loop.",
    tone: "#e4e9df",
    label: "Company update",
  },
  {
    id: "newsletter",
    name: "The monthly edit",
    description: "Stories, updates, and a reason to stay connected.",
    tone: "#dbe9e5",
    label: "Newsletter",
  },
  {
    id: "launch",
    name: "Something worth sharing",
    description: "A bold introduction with one clear next step.",
    tone: "#e6e4f2",
    label: "Announcement",
  },
  {
    id: "invitation",
    name: "You’re on the list",
    description: "An elegant invitation for your next gathering.",
    tone: "#f1e7d9",
    label: "Invitation",
  },
  {
    id: "welcome",
    name: "A warmer welcome",
    description: "Start the conversation on a personal note.",
    tone: "#dbe7ee",
    label: "Welcome",
  },
] as const;
export function starterDesign(id: string): EmailDesign {
  const d = emptyDesign();
  const add = (kind: BlockKind, patch: Partial<EmailBlock> = {}) => ({
    ...newBlock(kind),
    ...patch,
  });
  const themes: Record<
    string,
    { accent: string; bg: string; heading: string; body: string; cta: string }
  > = {
    outreach: {
      accent: "#305d79",
      bg: "#dae7ed",
      heading: "A good conversation\nstarts with hello.",
      body: "Hi {{first_name}},\n\nI wanted to introduce GreenHaul Solutions and learn more about the work you are doing at {{company}}.\n\nAdd a specific reason for reaching out and how you could help. Keep it brief, useful, and personal.",
      cta: "Let’s connect",
    },
    update: {
      accent: "#4c6245",
      bg: "#e4e9df",
      heading: "Moving forward.\nKeeping you close.",
      body: "Hi {{first_name}},\n\nHere is a quick update from our team. Share recent progress, important changes, and what is coming next for your clients and partners.",
      cta: "See the full update",
    },
    newsletter: {
      accent: "#245c58",
      bg: "#dbe9e5",
      heading: "Good things,\nworth sharing.",
      body: "Hi {{first_name}},\n\nA fresh collection of ideas, updates, and moments from GreenHaul Solutions. Here is what we have been working on.",
      cta: "Read the latest",
    },
    launch: {
      accent: "#504478",
      bg: "#e6e4f2",
      heading: "Meet your\nnext possibility.",
      body: "Hi {{first_name}},\n\nSomething new is here. Introduce your latest service, product, or idea with a message that puts your audience first.",
      cta: "Discover what’s new",
    },
    invitation: {
      accent: "#755332",
      bg: "#f1e7d9",
      heading: "Good company.\nGreat conversations.",
      body: "Hi {{first_name}},\n\nWe would love to see you. Add your event date, location, and the details your guests need to plan their visit.",
      cta: "View event details",
    },
    welcome: {
      accent: "#305d79",
      bg: "#dbe7ee",
      heading: "This is the start\nof something good.",
      body: "Hi {{first_name}},\n\nWelcome to GreenHaul Solutions. We are glad you are here. Let us help you take the first step.",
      cta: "Get started",
    },
  };
  const t = themes[id] || themes.newsletter;
  d.accent = t.accent;
  d.blocks = [
    add("text", {
      text: "GREENHAUL SOLUTIONS",
      color: t.accent,
      background: t.bg,
    }),
    add("heading", { text: t.heading, color: t.accent, background: t.bg }),
    add("text", { text: t.body }),
    ...(id === "newsletter" ? [add("columns")] : []),
    add("button", { text: t.cta }),
    add("divider"),
    add("footer"),
  ];
  if (id === "launch") {
    d.blocks = d.blocks.map((b, index) =>
      index < 2 ? { ...b, background: t.accent, color: "#ffffff" } : b,
    );
  }
  if (id === "invitation") {
    d.font = "Georgia";
    d.blocks = d.blocks.map((b) => ({
      ...b,
      align: "center",
      background: "#fffdf8",
    }));
  }
  return d;
}
export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export const safeColor = (value: string, fallback = "#ffffff") =>
  /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
export function safeUrl(value = "", image = false): string {
  try {
    const url = new URL(value);
    return (image
      ? ["https:"]
      : ["https:", "http:", "mailto:", "tel:"]
    ).includes(url.protocol)
      ? value
      : "";
  } catch {
    return "";
  }
}
const lines = (value: string) => escapeHtml(value).replace(/\n/g, "<br>");
export function blockHtml(block: EmailBlock, design: EmailDesign): string {
  const align = ["left", "center", "right"].includes(block.align)
    ? block.align
    : "left";
  const style = `padding:20px 32px;text-align:${align};color:${safeColor(block.color, "#203d3c")};background-color:${safeColor(block.background)};font-family:${design.font},sans-serif;word-break:break-word;`;
  let content = "";
  switch (block.kind) {
    case "heading":
      content = `<h1 class="email-heading" style="margin:0;font-size:36px;line-height:1.2;font-weight:700;">${lines(block.text)}</h1>`;
      break;
    case "text":
      content = `<p style="margin:0;font-size:16px;line-height:1.8;">${lines(block.text)}</p>`;
      break;
    case "footer":
      content = `<p style="margin:0;font-size:12px;line-height:1.8;">${lines(block.text)}</p>`;
      break;
    case "button":
      content = `<table role="presentation" cellpadding="0" cellspacing="0" style="${align === "center" ? "margin:auto;" : align === "right" ? "margin-left:auto;" : ""}"><tr><td bgcolor="${safeColor(design.accent)}" style="border-radius:6px;padding:14px 24px;"><a href="${escapeHtml(safeUrl(block.url))}" style="color:${safeColor(block.color)};text-decoration:none;font-size:15px;font-weight:bold;display:inline-block;">${lines(block.text)}</a></td></tr></table>`;
      break;
    case "image":
      content = safeUrl(block.url, true)
        ? `<img src="${escapeHtml(safeUrl(block.url, true))}" alt="${escapeHtml(block.text)}" width="536" style="display:block;width:100%;max-width:536px;height:auto;border:0;">`
        : "";
      break;
    case "divider":
      content = '<hr style="border:0;border-top:1px solid #dce4e5;margin:0;">';
      break;
    case "spacer":
      content = '<div style="height:24px;line-height:24px;">&#160;</div>';
      break;
    case "columns":
      content = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td class="email-column" width="50%" valign="top" style="padding-right:12px;font-size:15px;line-height:1.7;">${lines(block.text)}</td><td class="email-column" width="50%" valign="top" style="padding-left:12px;font-size:15px;line-height:1.7;">${lines(block.secondary || "")}</td></tr></table>`;
      break;
  }
  return `<tr><td class="email-cell" style="${style}">${content}</td></tr>`;
}
export function renderEmail(design: EmailDesign, metadata = true): string {
  const encoded = btoa(
    Array.from(new TextEncoder().encode(JSON.stringify(design)), (byte) =>
      String.fromCharCode(byte),
    ).join(""),
  );
  return `${metadata ? `<!--greenhaul-design-v1:${encoded}-->` : ""}<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>@media only screen and (max-width:480px){.email-cell{padding:18px 20px!important}.email-heading{font-size:28px!important}.email-column{display:block!important;width:100%!important;padding:0 0 16px!important}}</style></head><body style="margin:0;padding:24px 8px;background-color:${safeColor(design.background)};"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background-color:${safeColor(design.surface)};">${design.blocks.map((b) => blockHtml(b, design)).join("")}</table></td></tr></table></body></html>`;
}
export function designText(design: EmailDesign): string {
  return design.blocks
    .filter((b) => !["divider", "spacer"].includes(b.kind))
    .map((b) =>
      [
        b.text,
        b.secondary,
        b.kind === "button" || b.kind === "image"
          ? safeUrl(b.url, b.kind === "image")
          : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}
export function readDesign(html: string): EmailDesign | null {
  const encoded = html.match(
    /<!--greenhaul-design-v1:([A-Za-z0-9+/=]+)-->/,
  )?.[1];
  if (!encoded || encoded.length > 1_000_000) return null;
  try {
    const value: unknown = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0)),
      ),
    );
    if (!value || typeof value !== "object") return null;
    const d = value as EmailDesign;
    if (
      d.version !== 1 ||
      !Array.isArray(d.blocks) ||
      d.blocks.length > 100 ||
      !["Arial", "Georgia", "Verdana"].includes(d.font)
    )
      return null;
    if (
      ![d.background, d.surface, d.accent].every(
        (c) => typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c),
      )
    )
      return null;
    if (
      !d.blocks.every(
        (b) =>
          b &&
          typeof b.id === "string" &&
          Object.hasOwn(blockLabels, b.kind) &&
          typeof b.text === "string" &&
          typeof b.color === "string" &&
          typeof b.background === "string" &&
          ["left", "center", "right"].includes(b.align) &&
          (b.secondary === undefined || typeof b.secondary === "string") &&
          (b.url === undefined || typeof b.url === "string"),
      )
    )
      return null;
    if (new Set(d.blocks.map((b) => b.id)).size !== d.blocks.length)
      return null;
    // If HTML was changed externally, never let stale metadata overwrite those edits.
    return renderEmail(d) === html ? d : null;
  } catch {
    return null;
  }
}
export function designIssues(design: EmailDesign): string[] {
  return design.blocks.flatMap((b, i) =>
    b.kind === "button" && !safeUrl(b.url)
      ? [`Block ${i + 1}: add a valid button link.`]
      : b.kind === "image" && !safeUrl(b.url, true)
        ? [`Block ${i + 1}: add a public HTTPS image URL.`]
        : [],
  );
}
