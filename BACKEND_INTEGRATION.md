# Backend integration

The Django implementation is authoritative. The frontend talks to actual API
records; there is no production fixture mode. The only production backend source
change is the default `FRONTEND_URL` from port 3000 to 5173 in
`bulkmailer/settings.py`, mirrored in `.env.example`. No models, migrations,
serializers, delivery services, worker tasks, webhooks, or suppression logic were
changed. Existing Django Admin functionality remains available.

## Authentication and transport

POST `/api/auth/token/` accepts username/password and returns access/refresh JWTs.
POST `/api/auth/token/refresh/` renews the access token. Tokens remain in memory;
concurrent expired requests share one refresh, retry once, and sign out if refresh
fails. Dashboard access after login verifies staff permission; there is no
invented `/me` endpoint. Axios attaches Bearer authorization only to protected
requests. HTTP validation fields and non-field errors are displayed; mutations
are not automatically repeated after network failures. Users explicitly retry.
CORS permits the configured frontend origin.

## API mapping

All following paths are under `/api/email/`, with trailing slashes:

- `contacts/` and `contacts/{id}/`: paginated CRUD. Search, status, company,
  contact_lists and ordering parameters reflect backend filters.
- `contacts/import/`: multipart `file` plus optional `contact_list_id`.
  Displayed summary: total, valid, invalid, duplicates, existing, imported.
- `lists/` and `lists/{id}/`: CRUD. `add-contacts/` and `remove-contacts/` accept
  `contact_ids` arrays. Selection is explicit and scoped to visible contacts.
- `templates/` and `templates/{id}/`: CRUD. `preview/` receives sample first_name,
  last_name, company and position; returns rendered subject/html/text.
- `campaigns/` and `campaigns/{id}/`: draft CRUD. `prepare/` computes the audience;
  `test/` sends a single test; `send/`, `schedule/`, and `cancel/` perform actions.
  The seven-step wizard saves the draft ID in its URL. Confirmation uses freshly
  prepared server counts, never an estimated list count. Dates are converted from
  local input to timezone-aware ISO timestamps. Only backend-permitted actions
  appear for each state. Scheduled, queued and sending details poll every six seconds.
- `campaigns/{id}/analytics/` and `recipients/`: counts, rates and paginated
  recipient histories. Recipient search/status/email/company filters are supported.
  Rates with no denominator show an em dash; event counts overlap, so analytics
  uses bars rather than a mutually exclusive pie. Completion does not mean delivery.
- `dashboard/`: backend totals and recent campaigns.
- `settings/status/`: provider name and configured/not-configured flags only.
  No API keys, signing secrets, or environment values are editable or exposed.
- `unsubscribe/{token}/`: public GET, idempotent. The React route
  `/unsubscribe/:token` calls this API and offers recovery on failure. Repeated
  valid requests receive the same success message because the API does not
  distinguish an already-unsubscribed response.
- `webhooks/resend/`: public signed provider callback, never called by production
  frontend code. The browser test constructs a valid signature to verify integration.

Paginated responses use `{count,next,previous,results}` with page size 50.
Lists/templates needed for selection are fetched through pagination. API modules
encapsulate requests; views consume typed results and normalized errors.

## Preserved email behavior

Campaign content overrides template fields individually; a blank field falls back
to the selected template. Previews are sandboxed iframes with a restrictive CSP;
email HTML cannot execute scripts or access the application origin. Remote preview
images are blocked to avoid tracking requests.

Backend-generated messages retain their existing backend unsubscribe URLs and
one-click headers. The frontend public route is also available without changing
delivery behavior. Preparation, deduplication, suppression rechecks, idempotent
provider keys, retries, durable queue recovery, and signed-webhook processing
continue to run in the original backend. Contacts with delivery history remain
protected against deletion; the UI displays the server explanation.

## Deployment and limits

The Nginx example now serves the SPA and proxies `/api/` and `/admin/`, retaining
static admin files and disabling access logs on both unsubscribe routes. This is
an example, not an executed deployment. No remote repository or hosted services
were configured. MySQL, Redis, Docker, Resend credentials, verified DNS and public
HTTPS are external prerequisites. The isolated tests validate the workflow with
SQLite and mocked delivery; they do not claim live provider or broker validation.
