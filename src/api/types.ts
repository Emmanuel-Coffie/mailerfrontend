export type ContactStatus =
  "active" | "unsubscribed" | "bounced" | "suppressed";
export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "queued"
  | "sending"
  | "completed"
  | "cancelled"
  | "failed";
export type RecipientStatus =
  | "pending"
  | "queued"
  | "sent"
  | "delivered"
  | "bounced"
  | "failed"
  | "suppressed";
export interface Timestamps {
  id: number;
  created_at: string;
  updated_at: string;
}
export interface Contact extends Timestamps {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  phone: string;
  position: string;
  status: ContactStatus;
  source: string;
  notes: string;
  last_email_sent_at: string | null;
  last_email_opened_at: string | null;
  unsubscribed_at: string | null;
  bounced_at: string | null;
}
export interface ContactList extends Timestamps {
  name: string;
  description: string;
  contacts: number[];
}
export interface EmailTemplate extends Timestamps {
  name: string;
  subject: string;
  html_content: string;
  text_content: string;
}
export interface Campaign extends EmailTemplate {
  template: number | null;
  contact_lists: number[];
  from_name: string;
  from_email: string;
  reply_to: string;
  status: CampaignStatus;
  scheduled_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  bounced_count: number;
  failed_count: number;
  opened_count: number;
  clicked_count: number;
  unsubscribed_count: number;
}
export interface CampaignRecipient extends Timestamps {
  campaign: number;
  contact: number;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  position: string;
  status: RecipientStatus;
  provider_message_id: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  failed_at: string | null;
  retry_count: number;
  error_message: string;
  first_attempt_at: string | null;
  next_attempt_at: string | null;
}
export interface CampaignAnalytics {
  total: number;
  sent: number;
  delivered: number;
  bounced: number;
  failed: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  delivery_rate: number | null;
  bounce_rate: number | null;
  open_rate: number | null;
  click_rate: number | null;
  unsubscribe_rate: number | null;
}
export interface DashboardMetrics {
  total_contacts: number;
  active_contacts: number;
  unsubscribed_contacts: number;
  bounced_contacts: number;
  suppressed_contacts: number;
  total_campaigns: number;
  draft_campaigns: number;
  scheduled_campaigns: number;
  completed_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_failed: number;
  recent_campaigns: Campaign[];
}
export interface ProviderStatus {
  provider: string;
  api_configured: boolean;
  from_email_configured: boolean;
  reply_to_configured: boolean;
  webhook_secret_configured: boolean;
}
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
export interface ApiError {
  message: string;
  fieldErrors: Record<string, string>;
  statusCode?: number;
}
export interface ImportResult {
  total: number;
  valid: number;
  invalid: number;
  duplicates: number;
  existing: number;
  imported: number;
}
export interface PrepareResult {
  selected: number;
  duplicates_removed: number;
  unsubscribed_excluded: number;
  bounced_excluded: number;
  suppressed_excluded: number;
  invalid_excluded: number;
  eligible: number;
}
export interface Preview {
  subject: string;
  html: string;
  text: string;
}
export type Query = Record<string, string | number | undefined>;
