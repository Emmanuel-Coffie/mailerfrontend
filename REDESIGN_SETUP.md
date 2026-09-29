# MailFlow Premium UI Redesign

This folder keeps the existing application routes, API endpoints, authentication flow, forms, campaign workflow, contacts, lists, templates, settings, analytics, and backend integration intact. The redesign focuses on presentation, responsiveness, dashboard analytics, loading/empty/error states, and interaction polish.

## Fastest start on the same Windows setup

The folder still includes the existing `node_modules` and `.env.local`.

```powershell
cd frontend
npm.cmd run dev
```

Open `http://localhost:5173`.

Keep the Django backend running at the URL configured by `VITE_API_BASE_URL` in `.env.local` (normally `http://localhost:8000`).

## If dependencies came from another computer or operating system

Only if Vite reports a missing platform-specific package, refresh the existing dependencies once:

```powershell
npm.cmd ci
npm.cmd run dev
```

No new frontend libraries were added by this redesign. The dashboard charts use the Recharts package already present in the original project.

## Production build

```powershell
npm.cmd run build
```

Deploy the generated `dist` folder as before. The existing backend integration and route fallback requirements remain unchanged.

## What changed

- Premium responsive application shell and navigation
- Refined green visual system, spacing, typography, surfaces, buttons, forms, dialogs, tables, status chips, and focus states
- Redesigned login experience
- Redesigned dashboard with real-data KPI cards, audience composition chart, recent campaign delivery chart, delivery overview, and recent campaign table
- Better mobile layouts across shared pages and toolbars
- More informative network/API error messages for common status codes and server/network failures
- Improved skeleton loading, empty states, success notices, and route-error presentation
- Reduced-motion accessibility handling

## What was intentionally preserved

- Route paths and navigation destinations
- API URLs and request contracts
- Authentication/token refresh behavior
- Backend data models
- Form field names and submission logic
- Contact/list/template/campaign/settings functionality
- Recharts/MUI/React Router/Axios/React Hook Form/Zod stack
- Existing environment variable names

## Validation

The redesigned source passes the TypeScript project build (`tsc -b`). In the Linux packaging environment, the uploaded `node_modules` did not include Linux's optional Rollup native binary because the folder originated from another platform, so Vite/Vitest could not be executed there without reinstalling that platform-specific optional package. No dependency was added to `package.json` for this reason.
