# Product
<!-- impeccable:product-schema 1 -->
## Platform
web
## Users
Existing staff users manage contacts and email campaigns. Exact business audience remains unconfirmed.
## Product Purpose
GreenHaul Solutions campaign workspace: manage audiences, design reusable email templates, prepare, test, send and schedule campaigns, inspect delivery analytics.
## Capabilities and Constraints
The user requests a complete visual redesign, responsive layouts, a no-code email designer, and preservation of all existing functions without backend changes. Existing REST contracts and lifecycle restrictions remain authoritative. Templates persist name, subject, html_content and text_content. No new endpoints or server-side storage fields.
## Brand Commitments
Use the user-provided logoupdate.jpg for the application logo and favicon. Existing product name is GreenHaul Solutions.
## Evidence on Hand
src/api/types.ts, src/api/*.ts, BACKEND_INTEGRATION.md, existing routes and tests. The current code includes a demo adapter and local-storage session persistence despite older documentation stating otherwise. Do not infer live provider validation from demo results.
## Product Principles
Preserve API payloads and campaign safeguards. Make rich email composition available without writing markup. Support keyboard and narrow touch screens. Never discard existing template HTML silently.

## Confirmed task preferences
Business outreach and company updates are the primary email use case, with branded newsletters and announcements also requested. The user selected direct implementation of the working interface rather than a mockup-first workflow.
