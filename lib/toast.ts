import { toast as sonnerToast } from "sonner";
import type { ExternalToast } from "sonner";

type Message = React.ReactNode;
type Options = ExternalToast;

/**
 * App-wide alert helper.
 *
 * Thin wrapper over `sonner` so every alert in JANIC looks and behaves the same.
 * Existing code can keep importing `toast` from "sonner" directly — this is additive.
 *
 *   notify.success("Saved");
 *   notify.error(err);                       // unwraps Error.message
 *   notify.promise(save(), { loading, success, error });
 *   const id = notify.loading("Uploading…"); notify.success("Done", { id });
 */
export const notify = {
  success(message: Message, options?: Options) {
    return sonnerToast.success(message, options);
  },

  error(message: Message | unknown, options?: Options) {
    return sonnerToast.error(normaliseError(message), options);
  },

  info(message: Message, options?: Options) {
    return sonnerToast.info(message, options);
  },

  warning(message: Message, options?: Options) {
    return sonnerToast.warning(message, options);
  },

  loading(message: Message, options?: Options) {
    return sonnerToast.loading(message, options);
  },

  /** Dismiss by id, or everything when called with no arguments. */
  dismiss(id?: string | number) {
    return sonnerToast.dismiss(id);
  },

  /**
   * Wraps an async operation with loading → success/error toasts and a single
   * consistent failure path.
   */
  async promise<T>(
    run: Promise<T>,
    messages: { loading: Message; success: Message; error?: Message | ((err: unknown) => Message) }
  ): Promise<T> {
    const id = sonnerToast.loading(messages.loading);
    try {
      const result = await run;
      sonnerToast.success(messages.success, { id });
      return result;
    } catch (err) {
      const msg =
        typeof messages.error === "function"
          ? messages.error(err)
          : (messages.error ?? normaliseError(err));
      sonnerToast.error(msg, { id });
      throw err;
    }
  },

  /** Confirmation with Undo/Cancel, for reversible actions. */
  action(message: Message, action: { label: string; onClick: () => void | Promise<void> }) {
    return sonnerToast(message, {
      action: {
        label: action.label,
        onClick: () => {
          void action.onClick();
        },
      },
    });
  },
};

/**
 * Accepts an Error, a string, or the API error shapes used across JANIC
 * (`{ error }` / `{ message }` / `{ errors }`), and always returns something
 * displayable rather than "[object Object]".
 */
export function normaliseError(input: unknown): string {
  if (input == null) return "Something went wrong.";

  if (typeof input === "string") return input;
  if (typeof input === "number" || typeof input === "boolean") return String(input);

  if (input instanceof Error) return input.message;

  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;

    // Field-level validation errors: surface the first message.
    if (obj.errors && typeof obj.errors === "object") {
      const first = Object.values(obj.errors as Record<string, unknown>).find(Boolean);
      if (typeof first === "string") return first;
    }
    if (typeof obj.message === "string" && obj.message) return obj.message;
    if (typeof obj.error === "string" && obj.error) return obj.error;
  }

  return "Something went wrong.";
}

/**
 * Replaces native alert()/confirm() in admin components.
 * Kept here so confirmations can adopt the app look later without touching callers.
 */
export function confirmDestructive(opts: {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  const label = opts.confirmLabel ?? opts.title;
  return Promise.resolve(window.confirm(opts.description ? `${opts.title}\n\n${opts.description}` : label));
}