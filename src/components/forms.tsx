import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  useController,
  type RegisterOptions,
} from "react-hook-form";
import { useBlocker } from "react-router-dom";
import {
  Button as MuiButton,
  Dialog,
  DialogActions,
  MenuItem,
  TextField,
} from "@mui/material";
import { ConfirmDialog, ErrorNotice } from "./ui";
import { normalizeError } from "../api/client";
import type { ApiError } from "../api/types";
export type FormValues = Record<string, string>;
export interface FieldSpec {
  name: string;
  label: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
  options?: string[];
  hint?: string;
  maxLength?: number;
}
export function Field({
  name,
  label,
  required,
  type = "text",
  multiline,
  options,
  hint,
  maxLength,
}: FieldSpec) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const rules: RegisterOptions<FormValues> = {
    required: required ? "This field is required." : false,
    maxLength: maxLength
      ? { value: maxLength, message: `Use ${maxLength} characters or fewer.` }
      : undefined,
  };
  if (type === "email")
    rules.pattern = {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Enter a valid email address.",
    };
  const { field } = useController({ name, control, rules });
  return (
    <TextField
      name={field.name}
      value={field.value ?? ""}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      label={label}
      type={type}
      required={required}
      select={!!options}
      multiline={multiline}
      minRows={multiline ? 5 : undefined}
      error={!!errors[name]}
      helperText={String(errors[name]?.message || hint || " ")}
      slotProps={{
        inputLabel: type === "datetime-local" ? { shrink: true } : undefined,
      }}
    >
      {options?.map((value) => (
        <MenuItem key={value} value={value}>
          {value || "None"}
        </MenuItem>
      ))}
    </TextField>
  );
}
const DialogDirtyContext = createContext<(dirty: boolean) => void>(() => {});
export function EditorDialog({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const [dirty, setDirty] = useState(false);
  const [discard, setDiscard] = useState(false);
  useEffect(() => {
    if (!open) {
      setDirty(false);
      setDiscard(false);
    }
  }, [open]);
  const close = () => (dirty ? setDiscard(true) : onClose());
  return (
    <DialogDirtyContext.Provider value={setDirty}>
      <Dialog open={open} onClose={close}>
        {open ? children : null}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <MuiButton variant="text" onClick={close}>
            Cancel
          </MuiButton>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={discard}
        title="Discard unsaved changes?"
        description="Your changes have not been saved."
        action="Discard changes"
        onClose={() => setDiscard(false)}
        onConfirm={() => {
          setDiscard(false);
          onClose();
        }}
      />
    </DialogDirtyContext.Provider>
  );
}
export function UnsavedGuard({ dirty }: { dirty: boolean }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);
  return (
    <ConfirmDialog
      open={blocker.state === "blocked"}
      title="Discard unsaved changes?"
      description="Your changes have not been saved. Leave this page and discard them?"
      action="Discard changes"
      onClose={() => blocker.reset?.()}
      onConfirm={() => blocker.proceed?.()}
    />
  );
}
export function EditorForm({
  initial,
  fields,
  onSave,
  onDone,
  submitLabel = "Save changes",
  children,
}: {
  initial: FormValues;
  fields: FieldSpec[];
  onSave: (data: FormValues) => Promise<unknown>;
  onDone: () => void;
  submitLabel?: string;
  children?: ReactNode;
}) {
  const form = useForm<FormValues>({ defaultValues: initial });
  const setDialogDirty = useContext(DialogDirtyContext);
  useEffect(
    () => setDialogDirty(form.formState.isDirty),
    [form.formState.isDirty, setDialogDirty],
  );
  const [error, setError] = useState<ApiError>();
  const [saved, setSaved] = useState(false);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    if (saved) done.current();
  }, [saved]);
  return (
    <FormProvider {...form}>
      <UnsavedGuard dirty={form.formState.isDirty && !saved} />
      <form
        noValidate
        onSubmit={form.handleSubmit(async (values) => {
          setError(undefined);
          try {
            await onSave(values);
            form.reset(values);
            setSaved(true);
          } catch (e) {
            const parsed = normalizeError(e);
            setError(parsed);
            for (const [name, message] of Object.entries(parsed.fieldErrors))
              form.setError(name, { message });
            const first = Object.keys(parsed.fieldErrors)[0];
            if (first) form.setFocus(first);
          }
        })}
      >
        <ErrorNotice error={error} />
        <div className="grid grid-2">
          {fields.map((field) => (
            <div
              key={field.name}
              style={field.multiline ? { gridColumn: "1 / -1" } : undefined}
            >
              <Field {...field} />
            </div>
          ))}
        </div>
        {children}
        <MuiButton
          type="submit"
          loading={form.formState.isSubmitting}
          sx={{ mt: 2 }}
        >
          {submitLabel}
        </MuiButton>
      </form>
    </FormProvider>
  );
}
