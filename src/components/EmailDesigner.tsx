import { useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Alert,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ArrowUpward from "@mui/icons-material/ArrowUpward";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
import UndoOutlined from "@mui/icons-material/UndoOutlined";
import RedoOutlined from "@mui/icons-material/RedoOutlined";
import DesktopWindowsOutlined from "@mui/icons-material/DesktopWindowsOutlined";
import SmartphoneOutlined from "@mui/icons-material/SmartphoneOutlined";
import {
  blockLabels,
  designIssues,
  designText,
  emptyDesign,
  newBlock,
  readDesign,
  renderEmail,
  safeUrl,
  starterDesign,
  starterInfo,
  type EmailBlock,
  type EmailDesign,
  type BlockKind,
} from "../email/design";
import { ConfirmDialog, EmailPreview } from "./ui";

export function StarterGallery({
  onChoose,
}: {
  onChoose: (id: string) => void;
}) {
  return (
    <div className="starter-gallery">
      {starterInfo.map((item) => (
        <button
          type="button"
          className="starter-card"
          key={item.id}
          onClick={() => onChoose(item.id)}
        >
          <div
            className={`starter-art starter-${item.id}`}
            style={{ background: item.tone }}
            aria-hidden="true"
          >
            <div className="mini-mail">
              <span>GREENHAUL</span>
              <strong>
                {item.id === "outreach" ? (
                  <>
                    A good conversation
                    <br />
                    starts with hello.
                  </>
                ) : item.id === "update" ? (
                  <>
                    Moving forward.
                    <br />
                    Keeping you close.
                  </>
                ) : item.id === "newsletter" ? (
                  <>
                    Good things,
                    <br />
                    worth sharing.
                  </>
                ) : item.id === "launch" ? (
                  <>
                    Meet your next
                    <br />
                    possibility.
                  </>
                ) : item.id === "invitation" ? (
                  <>
                    Good company.
                    <br />
                    Great conversations.
                  </>
                ) : (
                  <>
                    This is the start
                    <br />
                    of something good.
                  </>
                )}
              </strong>
              <i />
              <i />
              <b />
            </div>
          </div>
          <div className="starter-caption">
            <span>{item.label}</span>
            <strong>{item.name}</strong>
            <small>{item.description}</small>
          </div>
        </button>
      ))}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="color-field">
      <span>{label}</span>
      <span className="color-value">
        <input
          aria-label={label}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <span>{value.toUpperCase()}</span>
      </span>
    </label>
  );
}

function BlockContent({
  block,
  design,
  images,
}: {
  block: EmailBlock;
  design: EmailDesign;
  images: boolean;
}) {
  const style = { whiteSpace: "pre-wrap" as const, margin: 0 };
  switch (block.kind) {
    case "heading":
      return (
        <strong
          style={{ ...style, display: "block", fontSize: 32, lineHeight: 1.2 }}
        >
          {block.text}
        </strong>
      );
    case "text":
      return (
        <p style={{ ...style, fontSize: 15, lineHeight: 1.75 }}>{block.text}</p>
      );
    case "footer":
      return (
        <p style={{ ...style, fontSize: 12, lineHeight: 1.7 }}>{block.text}</p>
      );
    case "button":
      return (
        <span
          className="email-button-preview"
          style={{ background: design.accent, color: block.color }}
        >
          {block.text}
        </span>
      );
    case "image":
      return images && safeUrl(block.url, true) ? (
        <img
          src={safeUrl(block.url, true)}
          alt={block.text}
          referrerPolicy="no-referrer"
          style={{ display: "block", maxWidth: "100%", height: "auto" }}
        />
      ) : (
        <div className="image-placeholder">
          {block.url
            ? "Image hidden · enable images to preview"
            : "Add your image"}
          <small>{block.text}</small>
        </div>
      );
    case "divider":
      return <hr style={{ border: 0, borderTop: "1px solid #dce4e5" }} />;
    case "spacer":
      return <div style={{ height: 24 }} />;
    case "columns":
      return (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            textAlign: "left",
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          <p style={style}>{block.text}</p>
          <p style={style}>{block.secondary}</p>
        </div>
      );
  }
}

export function EmailDesigner({
  html,
  text,
  onChange,
}: {
  html: string;
  text: string;
  onChange: (html: string, text: string) => void;
}) {
  const design = useMemo(() => readDesign(html), [html]);
  const [selected, setSelected] = useState<string>();
  const [mode, setMode] = useState<"design" | "preview" | "source">("design");
  const [mobile, setMobile] = useState(false);
  const [images, setImages] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [replace, setReplace] = useState<string>();
  const [past, setPast] = useState<{ html: string; text: string }[]>([]);
  const [future, setFuture] = useState<{ html: string; text: string }[]>([]);
  const inspector = useRef<HTMLElement>(null);
  const active = design?.blocks.find((b) => b.id === selected);
  const selectBlock = (id: string) => {
    setSelected(id);
    if (window.matchMedia("(max-width: 1200px)").matches)
      requestAnimationFrame(() =>
        inspector.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        }),
      );
  };
  const commit = (d: EmailDesign) => {
    setPast((p) => [...p.slice(-49), { html, text }]);
    setFuture([]);
    onChange(renderEmail(d), designText(d));
  };
  const load = (id: string) => {
    const d = id === "blank" ? emptyDesign() : starterDesign(id);
    commit(d);
    setSelected(d.blocks[0]?.id);
    setMode("design");
    setGallery(false);
  };
  const choose = (id: string) => (html || text ? setReplace(id) : load(id));
  const patch = (patch: Partial<EmailBlock>) =>
    design &&
    active &&
    commit({
      ...design,
      blocks: design.blocks.map((b) =>
        b.id === active.id ? { ...b, ...patch } : b,
      ),
    });
  const move = (delta: number) => {
    if (!design || !active) return;
    const index = design.blocks.indexOf(active),
      blocks = [...design.blocks];
    const destination = index + delta;
    if (destination < 0 || destination >= blocks.length) return;
    [blocks[index], blocks[destination]] = [blocks[destination], blocks[index]];
    commit({ ...design, blocks });
  };
  const history = (undo: boolean) => {
    const stack = undo ? past : future,
      entry = stack.at(-1);
    if (!entry) return;
    if (undo) {
      setPast(stack.slice(0, -1));
      setFuture((f) => [...f, { html, text }]);
    } else {
      setFuture(stack.slice(0, -1));
      setPast((p) => [...p, { html, text }]);
    }
    onChange(entry.html, entry.text);
  };
  return (
    <div className="email-studio">
      {design && designIssues(design).length > 0 && (
        <Alert severity="warning" sx={{ borderRadius: 0, fontSize: 12 }}>
          Before sending: {designIssues(design).join(" ")}
        </Alert>
      )}
      <div className="studio-toolbar">
        <div className="segmented" aria-label="Editor view">
          {(["design", "preview", "source"] as const).map((v) => (
            <button
              type="button"
              key={v}
              aria-pressed={mode === v}
              onClick={() => setMode(v)}
            >
              {v === "design" ? "Design" : v === "preview" ? "Preview" : "HTML"}
            </button>
          ))}
        </div>
        <div className="actions">
          <Tooltip title="Undo">
            <span>
              <IconButton
                type="button"
                aria-label="Undo design change"
                disabled={!past.length}
                onClick={() => history(true)}
              >
                <UndoOutlined fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo">
            <span>
              <IconButton
                type="button"
                aria-label="Redo design change"
                disabled={!future.length}
                onClick={() => history(false)}
              >
                <RedoOutlined fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton
            type="button"
            aria-label={mobile ? "Show desktop email" : "Show mobile email"}
            onClick={() => setMobile(!mobile)}
          >
            {mobile ? (
              <DesktopWindowsOutlined fontSize="small" />
            ) : (
              <SmartphoneOutlined fontSize="small" />
            )}
          </IconButton>
        </div>
      </div>
      {mode === "source" ? (
        <div className="studio-source">
          <Alert severity="info">
            Advanced editing. Changing HTML switches this message out of visual
            editing. Undo restores the visual design.
          </Alert>
          <TextField
            label="Formatted message content"
            multiline
            minRows={14}
            value={html.replace(
              /<!--greenhaul-design-v1:[A-Za-z0-9+/=]+-->/g,
              "",
            )}
            onChange={(e) => {
              setPast((p) => [...p.slice(-49), { html, text }]);
              setFuture([]);
              onChange(
                e.target.value.replace(
                  /<!--greenhaul-design-v1:[A-Za-z0-9+/=]+-->/g,
                  "",
                ),
                text,
              );
            }}
          />
        </div>
      ) : mode === "preview" ? (
        <div className={`studio-preview ${mobile ? "is-mobile" : ""}`}>
          <EmailPreview html={html} text={text} />
        </div>
      ) : !design || gallery ? (
        <div className="studio-start">
          {gallery && design ? (
            <div className="template-intro">
              <div>
                <h2>Choose a different starting point.</h2>
                <p>
                  Your current email stays intact until you confirm a
                  replacement.
                </p>
              </div>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setGallery(false)}
              >
                Back to design
              </Button>
            </div>
          ) : html ? (
            <>
              <Alert severity="info">
                This message uses an existing HTML layout. Its content is
                preserved. Use HTML to edit it, or choose a starting design to
                replace it.
              </Alert>
              <EmailPreview html={html} />
            </>
          ) : (
            <div className="studio-intro">
              <h2>A great email starts here.</h2>
              <p>Choose a design. Make it yours. No HTML needed.</p>
            </div>
          )}
          <StarterGallery onChoose={choose} />
          <Button
            type="button"
            variant="outlined"
            onClick={() => choose("blank")}
            startIcon={<AddOutlined />}
          >
            Start from scratch
          </Button>
        </div>
      ) : (
        <>
          <div className="studio-workspace">
            <aside className="studio-tools">
              <h3>Add a section</h3>
              <div className="block-palette">
                {(Object.keys(blockLabels) as BlockKind[]).map((kind) => (
                  <button
                    type="button"
                    key={kind}
                    disabled={design.blocks.length >= 100}
                    onClick={() => {
                      const block = newBlock(kind);
                      commit({ ...design, blocks: [...design.blocks, block] });
                      setSelected(block.id);
                    }}
                  >
                    <AddOutlined fontSize="small" />
                    {blockLabels[kind]}
                  </button>
                ))}
              </div>
              <h3>Email style</h3>
              <ColorField
                label="Canvas"
                value={design.background}
                onChange={(background) => commit({ ...design, background })}
              />
              <ColorField
                label="Button color"
                value={design.accent}
                onChange={(accent) => commit({ ...design, accent })}
              />
              <TextField
                select
                label="Email font"
                value={design.font}
                onChange={(e) =>
                  commit({
                    ...design,
                    font: e.target.value as EmailDesign["font"],
                  })
                }
              >
                {["Arial", "Georgia", "Verdana"].map((f) => (
                  <MenuItem key={f} value={f}>
                    {f}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="button"
                variant="text"
                onClick={() => setGallery(true)}
              >
                Change starting design
              </Button>
            </aside>
            <div
              className="studio-canvas"
              style={{ background: design.background }}
            >
              <div className="canvas-label">
                <span>{mobile ? "Mobile · 375px" : "Email · 600px"}</span>
                <button
                  type="button"
                  onClick={() => setImages(!images)}
                  aria-pressed={images}
                >
                  {images ? "Hide images" : "Load external images"}
                </button>
              </div>
              <div
                className={`email-paper ${mobile ? "is-mobile" : ""}`}
                style={{
                  background: design.surface,
                  fontFamily: `${design.font},sans-serif`,
                }}
              >
                {!design.blocks.length && (
                  <div className="empty-canvas">
                    Your blank page.
                    <span>Add a section to start your message.</span>
                  </div>
                )}
                {design.blocks.map((b, index) => (
                  <button
                    type="button"
                    className={`email-block ${selected === b.id ? "selected" : ""}`}
                    key={b.id}
                    aria-label={`Edit ${blockLabels[b.kind].toLowerCase()} section ${index + 1}`}
                    aria-pressed={selected === b.id}
                    onClick={() => selectBlock(b.id)}
                    style={{
                      color: b.color,
                      background: b.background,
                      textAlign: b.align,
                    }}
                  >
                    <BlockContent block={b} design={design} images={images} />
                  </button>
                ))}
              </div>
              <p className="canvas-hint">
                Select a section to edit it. Links open only in delivered
                emails.
              </p>
            </div>
            <aside ref={inspector} className="studio-inspector">
              {active ? (
                <>
                  <div className="inspector-title">
                    <h3>{blockLabels[active.kind]} settings</h3>
                    <span>
                      {design.blocks.indexOf(active) + 1} /{" "}
                      {design.blocks.length}
                    </span>
                  </div>
                  <div className="actions">
                    <IconButton
                      type="button"
                      aria-label="Move section up"
                      disabled={design.blocks[0].id === active.id}
                      onClick={() => move(-1)}
                    >
                      <ArrowUpward fontSize="small" />
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label="Move section down"
                      disabled={design.blocks.at(-1)?.id === active.id}
                      onClick={() => move(1)}
                    >
                      <ArrowDownward fontSize="small" />
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label="Duplicate section"
                      disabled={design.blocks.length >= 100}
                      onClick={() => {
                        const copy = { ...active, id: crypto.randomUUID() };
                        const blocks = [...design.blocks];
                        blocks.splice(blocks.indexOf(active) + 1, 0, copy);
                        commit({ ...design, blocks });
                        setSelected(copy.id);
                      }}
                    >
                      <ContentCopyOutlined fontSize="small" />
                    </IconButton>
                    <IconButton
                      type="button"
                      aria-label="Remove section"
                      onClick={() => {
                        commit({
                          ...design,
                          blocks: design.blocks.filter(
                            (b) => b.id !== active.id,
                          ),
                        });
                        setSelected(undefined);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </div>
                  {!["divider", "spacer"].includes(active.kind) && (
                    <TextField
                      label={
                        active.kind === "image"
                          ? "Image description"
                          : "Section text"
                      }
                      multiline
                      minRows={
                        active.kind === "heading" || active.kind === "button"
                          ? 2
                          : 5
                      }
                      value={active.text}
                      onChange={(e) => patch({ text: e.target.value })}
                    />
                  )}
                  {active.kind === "columns" && (
                    <TextField
                      label="Second column"
                      multiline
                      minRows={5}
                      value={active.secondary || ""}
                      onChange={(e) => patch({ secondary: e.target.value })}
                    />
                  )}
                  {["button", "image"].includes(active.kind) && (
                    <TextField
                      label={
                        active.kind === "image" ? "Image URL" : "Button link"
                      }
                      value={active.url || ""}
                      onChange={(e) => patch({ url: e.target.value })}
                      error={
                        !!active.url &&
                        !safeUrl(active.url, active.kind === "image")
                      }
                      helperText={
                        active.kind === "image"
                          ? "Use a public HTTPS image URL. Uploads are not required."
                          : "Use https://, mailto:, or tel:."
                      }
                    />
                  )}
                  {!["divider", "spacer", "image"].includes(active.kind) && (
                    <>
                      <TextField
                        label="Alignment"
                        select
                        value={active.align}
                        onChange={(e) =>
                          patch({
                            align: e.target.value as EmailBlock["align"],
                          })
                        }
                      >
                        {["left", "center", "right"].map((a) => (
                          <MenuItem key={a} value={a}>
                            {a[0].toUpperCase() + a.slice(1)}
                          </MenuItem>
                        ))}
                      </TextField>
                      <ColorField
                        label="Text color"
                        value={active.color}
                        onChange={(color) => patch({ color })}
                      />
                    </>
                  )}
                  <ColorField
                    label="Section background"
                    value={active.background}
                    onChange={(background) => patch({ background })}
                  />
                  {!["divider", "spacer", "image"].includes(active.kind) && (
                    <div className="personalization">
                      <h4>Make it personal</h4>
                      <p>Insert a contact detail at the end of your text.</p>
                      {["first_name", "last_name", "company", "position"].map(
                        (token) => (
                          <button
                            type="button"
                            key={token}
                            onClick={() =>
                              patch({ text: active.text + ` {{${token}}}` })
                            }
                          >
                            {token.replace("_", " ")}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="inspector-empty">
                  <h3>Make it yours.</h3>
                  <p>
                    Select any section in your email to edit the words, colors,
                    and layout.
                  </p>
                </div>
              )}
            </aside>
          </div>
          <div className="studio-footer">
            Visual edits also create a plain-text version. You can customize it
            below.
          </div>
        </>
      )}
      <ConfirmDialog
        open={replace !== undefined}
        title="Replace this design?"
        description="This replaces your current email content and plain-text version. You can undo this change before leaving the editor."
        action="Replace design"
        danger={false}
        onClose={() => setReplace(undefined)}
        onConfirm={() => {
          if (replace) load(replace);
          setReplace(undefined);
        }}
      />
    </div>
  );
}

export function EmailDesignerField({
  fallbackHtml = "",
  fallbackText = "",
}: {
  fallbackHtml?: string;
  fallbackText?: string;
}) {
  const { watch, setValue } = useFormContext<Record<string, string>>();
  const html = watch("html_content") || fallbackHtml;
  const text = watch("text_content") || fallbackText;
  return (
    <EmailDesigner
      html={html}
      text={text}
      onChange={(nextHtml, nextText) => {
        setValue("html_content", nextHtml, { shouldDirty: true });
        setValue("text_content", nextText, { shouldDirty: true });
      }}
    />
  );
}
