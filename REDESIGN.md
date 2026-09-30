# Visual workspace redesign

The interface now uses a shared teal/porcelain design system, responsive navigation and the supplied GreenHaul logo. Material UI remains the accessible control layer, with a new custom shell and visual treatment.

## Visual email studio

Open Templates and choose a starter: business outreach, company update, newsletter, announcement, invitation or welcome. Edit sections without HTML, add headings/text/images/buttons/two-column sections/dividers/spacers/footers, change colors and fonts, reorder or duplicate sections, and undo/redo. Use Preview for the generated email; Design is an interactive composition view. Personalization supports the existing first_name, last_name, company and position variables.

Images use publicly accessible HTTPS URLs; this frontend adds no upload endpoint. External preview images remain blocked until explicitly loaded. Complete button links before sending. Visual edits regenerate the plain-text fallback; make any custom plain-text edits last.

The studio writes only the existing name, subject, html_content and text_content fields. Editable design metadata is encoded in an HTML comment; table-based email HTML and inline styles accompany it. Reopening an unchanged studio template restores its controls across devices. If HTML is modified externally or metadata is removed, the editor preserves the HTML and offers advanced editing or explicit replacement rather than guessing a lossy conversion. No backend files, endpoints or schema were changed.

Campaign content retains the existing per-field fallback to a selected template. Editing a design in a campaign creates an override, leaving the reusable template intact. Existing prepare/test/send/schedule/cancel behavior is unchanged.

## Run and verify

Requires Node 22.12+:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd test -- --maxWorkers=1
npm.cmd run build
npm.cmd run test:frontend
```

Development URL: http://localhost:3000. Fonts are self-hosted. The new lockfile makes dependency installation reproducible.

The existing client enables its local demo adapter when no API URL is set unless VITE_USE_MOCK=false. For an actual backend, configure VITE_API_BASE_URL and VITE_USE_MOCK=false. This behavior predates this redesign; the older README/backend notes describing no mock mode or in-memory-only tokens are stale. Do not mistake demo data for actual delivery evidence.

The frontend browser suite explicitly uses the existing local demo adapter. It verifies template save/reopen, campaign overrides, responsive route layouts at 320/390/768/1440, mobile navigation, logo/favicon and unsaved-change recovery. It never sends real emails. The original Django-integrated suite requires backend files and a Python environment outside this frontend repository, so it cannot be run from this checkout alone. Live provider delivery and specific email-client rendering remain deployment checks.

## Validation note

All 30 unit/component tests pass with a single worker, and the frontend browser scenarios pass. Production build succeeds. The full-repository formatting check reports 26 pre-existing unformatted files outside this change; the changed/new source files pass their targeted Prettier check.
