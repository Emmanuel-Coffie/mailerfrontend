import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button as MuiButton,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import { campaignsApi } from "../api/campaigns";
import { listsApi } from "../api/lists";
import { templatesApi } from "../api/templates";
import { normalizeError } from "../api/client";
import type { Campaign, PrepareResult, ApiError } from "../api/types";
import { useResource, date } from "../hooks";
import {
  ConfirmDialog,
  Detail,
  EmailPreview,
  Empty,
  ErrorNotice,
  Loading,
  PageHeading,
  Summary,
  useNotice,
} from "../components/ui";
import { Field, UnsavedGuard, type FormValues } from "../components/forms";
const steps = [
  "Campaign",
  "Recipients",
  "Content",
  "Sender",
  "Test",
  "Schedule",
  "Review",
];
const defaults = {
  name: "",
  subject: "",
  html_content: "",
  text_content: "",
  from_name: "",
  from_email: "",
  reply_to: "",
};
export function CampaignWizard() {
  const [params, setParams] = useSearchParams();
  const draft = params.get("draft");
  const navigate = useNavigate();
  const form = useForm<FormValues>({ defaultValues: defaults });
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [template, setTemplate] = useState<number | null>(null);
  const [report, setReport] = useState<PrepareResult>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ApiError>();
  const [testEmail, setTestEmail] = useState("");
  const [tested, setTested] = useState(false);
  const [mode, setMode] = useState("now");
  const [when, setWhen] = useState("");
  const [confirmation, setConfirmation] = useState(false);
  const [audienceDirty, setAudienceDirty] = useState(false);
  const notice = useNotice();
  const lists = useResource(listsApi.all, "lists");
  const templates = useResource(templatesApi.all, "templates");
  const saved = useResource(
    () => (draft ? campaignsApi.get(draft) : Promise.resolve(null)),
    draft || "new",
  );
  useEffect(() => {
    if (saved.data) {
      form.reset(
        Object.fromEntries(
          Object.keys(defaults).map((k) => [
            k,
            String(saved.data![k as keyof Campaign] || ""),
          ]),
        ),
      );
      setSelected(saved.data.contact_lists);
      setTemplate(saved.data.template);
      setAudienceDirty(false);
    }
  }, [saved.data, form]);
  const scheduledLabel =
    when && !Number.isNaN(new Date(when).getTime())
      ? date(new Date(when).toISOString())
      : "Choose a date and time";
  const values = form.watch();
  const chosenTemplate = templates.data?.find((t) => t.id === template);
  const html = values.html_content || chosenTemplate?.html_content || "";
  const text = values.text_content || chosenTemplate?.text_content || "";
  const save = async () => {
    const data = { ...form.getValues(), contact_lists: selected, template };
    const campaign = draft
      ? await campaignsApi.update(draft, data)
      : await campaignsApi.create(data);
    form.reset(form.getValues());
    setAudienceDirty(false);
    if (!draft) setParams({ draft: String(campaign.id) }, { replace: true });
    return campaign;
  };
  const next = async () => {
    setError(undefined);
    const fields =
      step === 0
        ? ["name", "subject"]
        : step === 3
          ? ["from_email", "reply_to"]
          : [];
    if (!(await form.trigger(fields))) return;
    if (step === 1 && !selected.length) {
      setError({
        message: "Select at least one contact list.",
        fieldErrors: {},
      });
      return;
    }
    if (step === 2 && !html && !text) {
      setError({
        message: "Add message content or select a template.",
        fieldErrors: {},
      });
      return;
    }
    if (
      step === 5 &&
      mode === "later" &&
      (!when || new Date(when).getTime() <= Date.now())
    ) {
      setError({
        message: "Choose a date and time in the future.",
        fieldErrors: {},
      });
      return;
    }
    setBusy(true);
    try {
      const campaign = await save();
      if (step === 1) setReport(await campaignsApi.prepare(campaign.id));
      setStep((s) => Math.min(6, s + 1));
    } catch (e) {
      const parsed = normalizeError(e);
      setError(parsed);
      Object.entries(parsed.fieldErrors).forEach(([k, message]) =>
        form.setError(k, { message }),
      );
    } finally {
      setBusy(false);
    }
  };
  const reviewSend = async () => {
    setBusy(true);
    setError(undefined);
    try {
      const campaign = await save();
      const latest = await campaignsApi.prepare(campaign.id);
      setReport(latest);
      if (!latest.eligible)
        throw new Error(
          "There are no eligible recipients. Review your contact lists.",
        );
      setConfirmation(true);
    } catch (e) {
      setError(normalizeError(e));
    } finally {
      setBusy(false);
    }
  };
  if (saved.data && saved.data.status !== "draft")
    return (
      <>
        <PageHeading title="Campaign already submitted" />
        <Alert severity="info">
          This campaign is {saved.data.status} and can no longer be edited.
        </Alert>
        <MuiButton component={Link} to={`/campaigns/${draft}`} sx={{ mt: 2 }}>
          View campaign
        </MuiButton>
      </>
    );
  return (
    <>
      <PageHeading
        title={draft ? "Build your campaign" : "Create campaign"}
        description="A clear path from your idea to their inbox."
        actions={
          <MuiButton variant="outlined" component={Link} to="/campaigns">
            All campaigns
          </MuiButton>
        }
      />
      <FormProvider {...form}>
        <UnsavedGuard
          dirty={(form.formState.isDirty || audienceDirty) && !busy}
        />
        <div className="wizard-steps">
          <Stepper activeStep={step} alternativeLabel>
            {steps.map((name) => (
              <Step key={name}>
                <StepLabel>{name}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
        <ErrorNotice
          error={error || saved.error || lists.error || templates.error}
          retry={
            saved.error
              ? saved.reload
              : lists.error
                ? lists.reload
                : templates.error
                  ? templates.reload
                  : undefined
          }
        />
        {saved.error ? null : saved.loading ? (
          <Loading />
        ) : (
          <div className="wizard-layout">
            <section className="panel">
              <Typography variant="overline" color="text.secondary">
                Step {step + 1} of 7
              </Typography>
              <Typography variant="h2" sx={{ mb: 3 }}>
                {
                  [
                    "Give your campaign a name",
                    "Choose your audience",
                    "Craft your message",
                    "Set your sender",
                    "Try it in your inbox",
                    "Choose the right moment",
                    "Ready for a final look?",
                  ][step]
                }
              </Typography>
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (step < 6) void next();
                }}
              >
                {step === 0 && (
                  <div className="grid">
                    <Field
                      name="name"
                      label="Campaign name"
                      required
                      maxLength={255}
                    />
                    <Field
                      name="subject"
                      label="Subject"
                      required
                      maxLength={998}
                    />
                    <Alert severity="info">
                      Continue to save a real draft. You can come back to it
                      from Campaigns.
                    </Alert>
                  </div>
                )}
                {step === 1 && (
                  <>
                    {lists.data?.length ? (
                      <div className="grid">
                        {lists.data.map((l) => (
                          <Box
                            key={l.id}
                            sx={{
                              border: "1px solid",
                              borderColor: selected.includes(l.id)
                                ? "primary.main"
                                : "divider",
                              borderRadius: 2,
                              p: 1,
                            }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selected.includes(l.id)}
                                  onChange={(_, checked) => {
                                    setSelected((old) =>
                                      checked
                                        ? [...old, l.id]
                                        : old.filter((v) => v !== l.id),
                                    );
                                    setAudienceDirty(true);
                                    setReport(undefined);
                                  }}
                                />
                              }
                              label={
                                <>
                                  <strong>{l.name}</strong>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {l.contacts.length} contacts ·{" "}
                                    {l.description || "Contact list"}
                                  </Typography>
                                </>
                              }
                            />
                          </Box>
                        ))}
                      </div>
                    ) : (
                      <Empty
                        title="Create a contact list first"
                        description="Campaigns need an audience. Add contacts to a list, then return to this draft."
                        action={
                          <MuiButton component={Link} to="/contact-lists">
                            Contact lists
                          </MuiButton>
                        }
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      The system will prepare the audience and exclude inactive,
                      invalid, and suppressed addresses when you continue.
                    </Typography>
                  </>
                )}
                {step === 2 && (
                  <div className="grid">
                    <TextField
                      select
                      label="Choose template (optional)"
                      value={template || ""}
                      onChange={(e) => {
                        setTemplate(
                          e.target.value ? Number(e.target.value) : null,
                        );
                        setAudienceDirty(true);
                      }}
                    >
                      <MenuItem value="">No template</MenuItem>
                      {templates.data?.map((t) => (
                        <MenuItem key={t.id} value={t.id}>
                          {t.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Alert severity="info">
                      Your campaign content takes priority. Blank fields use the
                      selected template when the campaign is submitted.
                    </Alert>
                    <Field name="subject" label="Subject" required />
                    <Field
                      name="html_content"
                      label="Formatted message content"
                      multiline
                    />
                    <Field
                      name="text_content"
                      label="Plain text message"
                      multiline
                    />
                    <Typography variant="caption">
                      Variables:{" "}
                      {
                        "{{first_name}}, {{last_name}}, {{company}}, {{position}}"
                      }
                    </Typography>
                    <Typography variant="h3">Draft content preview</Typography>
                    <EmailPreview html={html} text={text} />
                  </div>
                )}
                {step === 3 && (
                  <div className="grid">
                    <Field
                      name="from_name"
                      label="From name"
                      hint="Leave blank to use the configured provider default."
                    />
                    <Field
                      name="from_email"
                      label="From email"
                      type="email"
                      hint="Use an address on your verified domain, or leave blank for the configured default."
                    />
                    <Field
                      name="reply_to"
                      label="Reply-To"
                      type="email"
                      hint="Replies will be sent to this address. Leave blank for the configured default."
                    />
                  </div>
                )}
                {step === 4 && (
                  <div className="grid">
                    <Typography color="text.secondary">
                      Check your message at an address you control. Test sends
                      do not change campaign statistics.
                    </Typography>
                    <TextField
                      label="Test email address"
                      type="email"
                      value={testEmail}
                      onChange={(e) => {
                        setTestEmail(e.target.value);
                        setTested(false);
                      }}
                    />
                    <MuiButton
                      variant="outlined"
                      loading={busy}
                      onClick={async () => {
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
                          setError({
                            message: "Enter a valid test email address.",
                            fieldErrors: {},
                          });
                          return;
                        }
                        setBusy(true);
                        setError(undefined);
                        try {
                          const campaign = await save();
                          await campaignsApi.test(campaign.id, testEmail);
                          setTested(true);
                          notice("Test email sent");
                        } catch (e) {
                          setError(normalizeError(e));
                        } finally {
                          setBusy(false);
                        }
                      }}
                    >
                      Send test email
                    </MuiButton>
                    {tested && (
                      <Alert severity="success">
                        Test email accepted for delivery.
                      </Alert>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      You can continue without a test if your email provider is
                      not configured yet.
                    </Typography>
                  </div>
                )}
                {step === 5 && (
                  <>
                    <RadioGroup
                      value={mode}
                      onChange={(e) => setMode(e.target.value)}
                    >
                      <FormControlLabel
                        value="now"
                        control={<Radio />}
                        label="Send immediately after review"
                      />
                      <FormControlLabel
                        value="later"
                        control={<Radio />}
                        label="Schedule for later"
                      />
                    </RadioGroup>
                    {mode === "later" && (
                      <TextField
                        type="datetime-local"
                        label="Send date and time"
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={when}
                        onChange={(e) => setWhen(e.target.value)}
                        sx={{ mt: 2 }}
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 2 }}
                    >
                      Timezone:{" "}
                      {Intl.DateTimeFormat().resolvedOptions().timeZone}.
                      Nothing is sent or scheduled until you confirm on the
                      review step.
                    </Typography>
                  </>
                )}
                {step === 6 && (
                  <>
                    <Detail name="Campaign">{values.name}</Detail>
                    <Detail name="Subject">
                      {values.subject || chosenTemplate?.subject}
                    </Detail>
                    <Detail name="Sender">
                      {values.from_email
                        ? `${values.from_name} <${values.from_email}>`
                        : "Configured provider default"}
                    </Detail>
                    <Detail name="Reply-To">
                      {values.reply_to || "Configured provider default"}
                    </Detail>
                    <Detail name="Schedule">
                      {mode === "later"
                        ? scheduledLabel
                        : "Immediately after confirmation"}
                    </Detail>
                    <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
                      Audience preparation
                    </Typography>
                    {report ? (
                      <Summary data={{ ...report }} />
                    ) : (
                      <Alert severity="info">
                        The audience will be prepared again before confirmation.
                      </Alert>
                    )}
                    <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
                      Content preview
                    </Typography>
                    <EmailPreview html={html} text={text} />
                  </>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    mt: 4,
                    pt: 3,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <MuiButton
                    variant="outlined"
                    disabled={step === 0 || busy}
                    onClick={() => {
                      setStep((s) => s - 1);
                      setError(undefined);
                    }}
                  >
                    Back
                  </MuiButton>
                  {step < 6 ? (
                    <MuiButton type="submit" loading={busy}>
                      Save & continue
                    </MuiButton>
                  ) : (
                    <MuiButton loading={busy} onClick={() => void reviewSend()}>
                      {mode === "later" ? "Schedule campaign" : "Send campaign"}
                    </MuiButton>
                  )}
                </Box>
              </form>
            </section>
            <aside className="panel" style={{ alignSelf: "start" }}>
              <div className="eyebrow">Campaign at a glance</div>
              <Typography
                variant="h2"
                sx={{ mt: 2, mb: 1, overflowWrap: "anywhere" }}
              >
                {values.name || "Your next campaign"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {draft ? `Draft #${draft}` : "Not saved yet"}
              </Typography>
              <Box sx={{ mt: 3 }}>
                <Detail name="Selected lists">{selected.length}</Detail>
                <Detail name="Eligible recipients">
                  {report?.eligible ??
                    saved.data?.total_recipients ??
                    "Not prepared"}
                </Detail>
                <Detail name="Delivery">
                  {mode === "later" ? "Scheduled" : "Send now"}
                </Detail>
              </Box>
              <Box sx={{ mt: 3, display: "flex", gap: 1 }}>
                <CheckCircleOutline color="primary" fontSize="small" />
                <Typography variant="caption" color="text.secondary">
                  Unsubscribe links are added automatically. Suppression is
                  checked again before delivery.
                </Typography>
              </Box>
            </aside>
          </div>
        )}
        <ConfirmDialog
          open={confirmation}
          title={mode === "later" ? "Schedule campaign?" : "Send campaign?"}
          description={`You’re about to ${mode === "later" ? "schedule" : "send"} “${values.name}” for ${report?.eligible || 0} eligible recipients${mode === "later" ? ` at ${scheduledLabel}` : ""}. Eligibility is rechecked at delivery. Emails cannot be recalled once accepted for delivery.`}
          action={mode === "later" ? "Schedule campaign" : "Send campaign"}
          danger={false}
          busy={busy}
          onClose={() => setConfirmation(false)}
          onConfirm={async () => {
            if (!draft) return;
            setBusy(true);
            setError(undefined);
            try {
              if (mode === "later")
                await campaignsApi.schedule(
                  Number(draft),
                  new Date(when).toISOString(),
                );
              else await campaignsApi.send(Number(draft));
              form.reset(form.getValues());
              setAudienceDirty(false);
              notice(
                mode === "later" ? "Campaign scheduled" : "Campaign queued",
              );
              void navigate(`/campaigns/${draft}`);
            } catch (e) {
              setError(normalizeError(e));
              setConfirmation(false);
              saved.reload();
            } finally {
              setBusy(false);
            }
          }}
        />
      </FormProvider>
    </>
  );
}
