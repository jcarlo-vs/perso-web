"use client";

import { useActionState, useEffect, useState } from "react";
import { sendContactEmail, type ContactFormState } from "@/app/actions/contact";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
      className="max-w-md space-y-4"
    >
      {state && (
        <div
          className={cn(
            "flex items-center gap-2 p-3 rounded-lg text-xs",
            state.success
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          )}
        >
          {state.success ? (
            <CheckCircle className="w-3.5 h-3.5 shrink-0" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <input
          name="name"
          placeholder="Name"
          required
          disabled={isPending}
          autoComplete="name"
          className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/8 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/20 transition-colors"
        />
        <div>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            disabled={isPending}
            autoComplete="email"
            onFocus={() => setEmailError(null)}
            className={cn(
              "w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border text-sm text-white placeholder:text-neutral-700 outline-none transition-colors",
              emailError ? "border-red-500/30" : "border-white/8 focus:border-white/20"
            )}
          />
          {emailError && (
            <p className="text-red-400 text-[10px] mt-1">{emailError}</p>
          )}
        </div>
      </div>

      <textarea
        name="message"
        placeholder="Message"
        rows={3}
        required
        disabled={isPending}
        className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/8 text-sm text-white placeholder:text-neutral-700 outline-none focus:border-white/20 transition-colors resize-none"
      />

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/8 border border-white/10 text-sm text-white/80 hover:text-white hover:bg-white/12 transition-all disabled:opacity-50 font-medium"
      >
        {isPending ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-3.5 h-3.5" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
