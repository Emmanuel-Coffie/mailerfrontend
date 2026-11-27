# Release and setup

Deploy the backend changes before the frontend. Run python manage.py migrate for campaign attachments (migration 0002).

Backend: install requirements.txt, restart the Django web service and Celery worker/beat. Keep existing database, Redis and Resend configuration. Set FRONTEND_URL to https://mailerfrontend.vercel.app and BACKEND_URL to the actual Render service origin. Allow the frontend origin in CORS_ALLOWED_ORIGINS. Browser unsubscribe links redirect to the frontend; JSON clients and one-click POST requests retain the existing API behavior.

Frontend: npm ci then npm run build. Set VITE_API_BASE_URL=https://mailerbackend-on57.onrender.com and VITE_USE_MOCK=false. Optionally set VITE_BRAND_LOGO_URL to a public HTTPS logo URL; production defaults to /brand-logo.jpg on its own origin and local development uses the versioned repository logo. Keep the SPA rewrite for /unsubscribe/:token. Public recipients must be able to open this route without Vercel authentication.

Import supports .xlsx and UTF-8 .csv, up to 5 MB and 10,000 contacts. Review is read-only. Automatic groups use Group/Segment/Tags, then Company, then worksheet name. Explicit grouping overrides are available. Multiple memberships use comma, semicolon or pipe separators. Unknown columns are ignored; ambiguous duplicate headers are rejected. Existing contact fields and opt-outs are preserved. Formula cells need cached Excel values; save the workbook before uploading. Older .xls files must be saved as .xlsx.

Each starter includes editable logo, content and unsubscribe footer. Add a real destination to the main call-to-action before sending. Preview/test emails use an explanatory unsubscribe preview page. Actual campaigns resolve the footer for each recipient and retain one-click unsubscribe headers.

Validation: Django suite 50 tests and frontend suite 30 tests passed locally. Provider calls were mocked: this does not establish real Resend delivery or Render worker/Redis configuration.

Attachments are stored in the application database so they survive Render redeploys. Staff can upload/remove files only on drafts. Limits: five files, 3 MB per file, 8 MB total. Files are base64-encoded only at the email provider boundary. All recipients receive the same campaign attachments. Website footer defaults to https://greenhaulsolution.com and is editable in the footer inspector.
