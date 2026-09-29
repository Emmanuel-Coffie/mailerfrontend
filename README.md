# Mailflow frontend

React 19, TypeScript, Vite, MUI, React Router, Axios, React Hook Form, Zod, and
Recharts. A custom green interface with self-hosted Inter, responsive navigation,
accessible forms, confirmation dialogs, and isolated HTML email previews.

## Start

Requires Node 22.12+ and the Django backend described in the root README.

```powershell
npm.cmd ci
Copy-Item .env.example .env.local
npm.cmd run dev
```

Open http://localhost:5173. Backend: http://localhost:8000. Sign in with an actual
Django staff account. There are no production demo credentials or fake records.
Set `VITE_API_BASE_URL` to the backend origin; set backend `FRONTEND_URL` to the
browser origin. Frontend variables are public build inputs, never secrets.

Tokens live in memory and refresh automatically while the page remains open.
A browser reload or expired refresh token requires signing in again.

## Checks

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run format:check
npm.cmd audit
npx.cmd playwright install chromium
npm.cmd run test:e2e
```

To run the same browser workflows against compiled production assets:

```powershell
$env:E2E_PREVIEW = '1'
npm.cmd run test:e2e
Remove-Item Env:E2E_PREVIEW
```

On Unix use `E2E_PREVIEW=1 npm run test:e2e`. This rebuilds `dist/` with the
isolated test API address; run `npm run build` again before deploying. The
frontend CI workflow runs this production browser check on pushes and PRs.

Use `npm`/`npx` instead of `.cmd` on Unix. Browser tests need Python dependencies
from the root requirements and the root `.venv`; `E2E_PYTHON` can override the
interpreter. They reserve ports 8018 and 5173 and refuse to reuse running servers.
The harness migrates and resets only `browser-tests.sqlite3` in the repository,
generates temporary login/signature secrets, and mocks the Resend SDK. Real Django
requests, permissions, services, Celery tasks (eager mode), and webhooks execute.
It does not use your `.env` credentials to send mail. SQLite and eager tasks do
not validate MySQL locking or Redis transport. Test outputs are gitignored.

Unit tests cover route protection, login, refresh, forms, API errors, empty
states, imports, previews, campaign preparation/confirmation, analytics, settings,
and unsubscribe. Browser tests exercise the integrated workflow and recovery.

## Build and deploy

Set `VITE_API_BASE_URL=https://your-backend.example` before `npm run build`.
Serve `dist/` over HTTPS with an `index.html` fallback for React routes; see the
root `deploy/nginx.conf` for a same-origin frontend/API deployment. Do not use the
development server in production. Assets and fonts are served locally. API/admin
requests must reach Django. Rebuild when changing frontend environment values.

## Structure

- `src/api`: typed API contracts, request methods, JWT refresh, error normalization.
- `src/components`: shared table, form, dialog, preview, navigation, and state UI.
- `src/pages`: all routed screens, wizard, analytics, and public unsubscribe.
- `src/test`: Vitest and Testing Library checks.
- `e2e`: Playwright browser workflows and isolated Django harness.

`../DESIGN.md` and `../UX-CONTRACT.md` document visual and interaction decisions.
`BACKEND_INTEGRATION.md` records real endpoint contracts and preserved behavior.
