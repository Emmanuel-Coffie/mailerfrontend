"""Isolated browser-test server. Never run this as the application server."""
import json
import os
import sys
import uuid
from pathlib import Path
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
os.environ['DJANGO_SETTINGS_MODULE'] = 'bulkmailer.test_settings'
os.environ['FRONTEND_URL'] = 'http://localhost:5173'
os.environ['BACKEND_URL'] = 'http://127.0.0.1:8018'
import django
from django.conf import settings
settings.DATABASES['default']['NAME'] = ROOT / 'browser-tests.sqlite3'
settings.CELERY_TASK_ALWAYS_EAGER = True
settings.CELERY_TASK_EAGER_PROPAGATES = True
settings.RESEND_API_KEY = 'isolated-mocked-provider'
settings.RESEND_WEBHOOK_SECRET = os.environ['E2E_WEBHOOK_SECRET']
django.setup()
from django.core.management import call_command
from django.contrib.auth.models import User
call_command('migrate', verbosity=0)
# Only the dedicated, explicitly named browser test database is flushed.
assert Path(settings.DATABASES['default']['NAME']) == ROOT / 'browser-tests.sqlite3'
call_command('flush', interactive=False, verbosity=0)
User.objects.create_user('browser-test', password=os.environ['E2E_PASSWORD'], is_staff=True)
output = ROOT / 'frontend' / 'test-results' / 'sent-emails.json'
output.parent.mkdir(exist_ok=True)
output.write_text('[]')

def fake_send(params, options=None):
    message_id = str(uuid.uuid4())
    entries = json.loads(output.read_text())
    entries.append({'id': message_id, 'payload': params})
    output.write_text(json.dumps(entries))
    return {'id': message_id}

# Patch the provider boundary, preserving real DRF, auth, services and Celery task logic.
with patch('resend.Emails.send', side_effect=fake_send), patch('resend.Batch.send', side_effect=AssertionError('Unexpected batch')):
    call_command('runserver', '127.0.0.1:8018', use_reloader=False)
