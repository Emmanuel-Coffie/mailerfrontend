import { useState } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { theme } from "../theme";
import { EmailDesigner } from "../components/EmailDesigner";
import { readDesign, renderEmail, starterDesign } from "../email/design";
function Harness({ initial = "" }: { initial?: string }) {
  const [html, setHtml] = useState(initial);
  const [text, setText] = useState("");
  return (
    <ThemeProvider theme={theme}>
      <EmailDesigner
        html={html}
        text={text}
        onChange={(h, t) => {
          setHtml(h);
          setText(t);
        }}
      />
      <output data-testid="html">{html}</output>
      <output data-testid="text">{text}</output>
    </ThemeProvider>
  );
}
describe("email design interactions", () => {
  it("edits, reorders, duplicates, removes and undoes sections without markup", async () => {
    render(<Harness />);
    const user = userEvent.setup();
    await user.click(
      screen.getByRole("button", { name: /A thoughtful introduction/ }),
    );
    await user.click(
      screen.getByRole("button", { name: "Edit heading section 2" }),
    );
    await user.clear(screen.getByLabelText("Section text"));
    await user.click(screen.getByLabelText("Section text"));
    await user.paste("A personal hello");
    expect(
      readDesign(screen.getByTestId("html").textContent!)?.blocks[1].text,
    ).toBe("A personal hello");
    await user.click(screen.getByRole("button", { name: "Move section up" }));
    expect(
      readDesign(screen.getByTestId("html").textContent!)?.blocks[0].kind,
    ).toBe("heading");
    await user.click(screen.getByRole("button", { name: "Duplicate section" }));
    expect(
      readDesign(screen.getByTestId("html").textContent!)?.blocks.filter(
        (b) => b.kind === "heading",
      ),
    ).toHaveLength(2);
    await user.click(screen.getByRole("button", { name: "Remove section" }));
    await user.click(
      screen.getByRole("button", { name: "Undo design change" }),
    );
    expect(
      readDesign(screen.getByTestId("html").textContent!)?.blocks.filter(
        (b) => b.kind === "heading",
      ),
    ).toHaveLength(2);
    expect(screen.getByTestId("text")).toHaveTextContent("A personal hello");
  });
  it("does not replace existing HTML without confirmation", async () => {
    const legacy = "<h1>A legacy template</h1>";
    render(<Harness initial={legacy} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /The monthly edit/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("html").textContent).toBe(legacy);
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.getByTestId("html").textContent).toBe(legacy);
  });
  it("reopens a saved design and provides mobile preview", async () => {
    render(<Harness initial={renderEmail(starterDesign("update"))} />);
    await userEvent.click(
      screen.getByRole("button", { name: "Show mobile email" }),
    );
    expect(screen.getByText("Mobile · 375px")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByTitle("Email content preview")).toHaveAttribute(
      "sandbox",
      "",
    );
  });
});
