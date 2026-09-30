# UX contract

This document records canonical behavior owners. Extend these owners rather than introducing competing implementations.

- `src/components/forms.tsx`: field validation, inline hints/errors, server field-error mapping and focus, submit loading, editor dialogs, dirty-form tracking, route departure and browser unload guards. Keep unsaved-change confirmation on cancel, dialog close and route departure.
- `src/components/ui.tsx`: tables and empty states, loading placeholders, search/filter controls, pagination, notices, confirmation dialogs and email previews. `Pager` uses 50 records per page; API/query owners supply rows, count and page. `Filter` includes an empty-value "All" choice.
- MUI owns select, menu, dialog and drawer interaction primitives. Reuse their focus/keyboard behavior and theme overrides instead of adding custom popovers.
- `src/pages/CampaignWizard.tsx` owns scheduling. Use the browser's `datetime-local` input, validate that the chosen time is in the future, and convert with `new Date(when).toISOString()` for the existing API. The input uses the browser's local timezone; presentation does not change backend time semantics.
- `src/components/EmailDesigner.tsx` owns visual editing, section selection, inspector controls, history and explicit replacement confirmation. `src/email/design.ts` owns recognized design metadata, safe generated markup and generated plain text. Persist through existing `html_content` and `text_content`; no new endpoint or server field is introduced. Preserve arbitrary existing HTML in source/preview mode unless replacement is confirmed.
- `EmailPreview` uses a sandboxed iframe, restrictive content policy and no-referrer policy. External HTTPS images require explicit loading. Preserve this preview behavior.
- `src/theme.ts` owns shared colors and MUI controls; `MuiCssBaseline` maps colors into root CSS variables. `src/styles.css` owns application layout, responsive arrangements and custom designer presentation. Manrope is the display face and Inter the body face.

Existing REST payloads, permissions, lifecycle restrictions, sending safeguards and error contracts remain authoritative and unchanged by the redesign. Browser/demo checks cannot establish live provider delivery.

Identity asset: `public/brand-logo.jpg` is the exact supplied user logo and remains unchanged.

