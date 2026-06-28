"use client";

import { useActionState, useEffect, useState } from "react";
import { sendContactEmail, type ContactFormState } from "@/app/actions/contact";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const inputStyles =
  "w-full px-4 py-3 rounded-md text-sm text-white placeholder:text-neutral-600 outline-none transition-all border border-white/10 focus:border-accent/40 focus:ring-1 focus:ring-accent/20";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    sendContactEmail,
    null
  );

  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(null);
    formAction(formData);
  };

  useEffect(() => {
    if (state?.success) {
      const form = document.getElementById("contact-form") as HTMLFormElement;
      form?.reset();
    }
  }, [state]);

  return (
    <form
      id="contact-form"
      action={handleSubmit}
      className="space-y-4"
    >
      {state && (
        <div
          className={cn(
            "flex items-center gap-2.5 p-3.5 rounded-md text-xs",
            state.success
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          )}
        >
          {state.success ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      {/* Honeypot - off-screen field humans never see; bots auto-fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden"
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Your name"
          required
          maxLength={100}
          disabled={isPending}
          autoComplete="name"
          className={cn(inputStyles, "bg-white/[0.04]")}
        />
        <div>
          <input
            name="email"
            type="email"
            placeholder="Your email"
            required
            maxLength={200}
            disabled={isPending}
            autoComplete="email"
            onFocus={() => setEmailError(null)}
            className={cn(
              inputStyles,
              "bg-white/[0.04]",
              emailError && "border-red-500/30 focus:border-red-500/40 focus:ring-red-500/20"
            )}
          />
          {emailError && (
            <p className="text-red-400 text-[10px] mt-1.5 pl-1">{emailError}</p>
          )}
        </div>
      </div>

      <textarea
        name="message"
        placeholder="What's on your mind?"
        rows={4}
        required
        maxLength={5000}
        disabled={isPending}
        className={cn(inputStyles, "bg-white/[0.04] resize-none")}
      />

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-accent/15 border border-accent/25 text-sm text-accent hover:text-white hover:bg-accent/25 hover:border-accent/40 transition-all disabled:opacity-50 font-medium cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
