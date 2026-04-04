"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useActionState } from "react";
import { Reveal } from "@/components/ui/reveal";
import { personalInfo } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";
import { Mail, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { sendContactEmail, type ContactFormState } from "@/app/actions/contact";

export function ContactSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [state, formAction, isPending] = useActionState<
    ContactFormState,
    FormData
  >(sendContactEmail, null);

  const [focused, setFocused] = useState<string | null>(null);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleSubmit = (formData: FormData) => {
    const email = formData.get("email") as string;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setFilled({});
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
    <section id="contact" className="relative py-32 px-6 md:px-12">
      <div className="max-w-7xl mx-auto relative">
        {/* Label */}
        <Reveal variant="fade-up">
          <p className="text-xs tracking-[0.3em] text-purple-400/80 font-mono mb-6 uppercase">
            Contact
          </p>
        </Reveal>

        <Reveal variant="fade-up" delay={0.1}>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white/90">Let&apos;s work </span>
            <span className="text-purple-400">together</span>
          </h2>
        </Reveal>

        <Reveal variant="fade-up" delay={0.15}>
          <a
            href={`mailto:${personalInfo.email}`}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors duration-200 mb-16"
            data-cursor-hover
          >
            <Mail className="w-4 h-4" />
            {personalInfo.email}
          </a>
        </Reveal>

        {/* Form — left-aligned, max-width */}
        <Reveal variant="fade-up" delay={0.2}>
          <div className="max-w-2xl">
            {isMounted ? (
              <form
                id="contact-form"
                action={handleSubmit}
                className="space-y-8"
              >
                {/* Status */}
                {state && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl",
                      state.success
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    )}
                  >
                    {state.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                    <span className="text-sm">{state.message}</span>
                  </motion.div>
                )}

                {/* Name */}
                <div className="relative">
                  <label
                    htmlFor="name"
                    className={cn(
                      "absolute left-0 transition-all duration-200 pointer-events-none font-mono",
                      focused === "name" || filled["name"]
                        ? "-top-5 text-[10px] tracking-[0.2em] text-purple-400"
                        : "top-3 text-sm text-slate-600"
                    )}
                  >
                    FULL NAME
                  </label>
                  <input
                    id="name"
                    name="name"
                    onFocus={() => setFocused("name")}
                    onBlur={(e) => {
                      setFocused(null);
                      setFilled((prev) => ({ ...prev, name: !!e.target.value }));
                    }}
                    className="w-full bg-transparent border-b border-white/10 focus:border-purple-500/50 py-3 text-white outline-none transition-colors duration-300"
                    required
                    disabled={isPending}
                    autoComplete="name"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-purple-500/60"
                    initial={{ width: 0 }}
                    animate={{ width: focused === "name" ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={cn(
                      "absolute left-0 transition-all duration-200 pointer-events-none font-mono",
                      focused === "email" || filled["email"]
                        ? "-top-5 text-[10px] tracking-[0.2em] text-purple-400"
                        : "top-3 text-sm text-slate-600"
                    )}
                  >
                    EMAIL
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    onFocus={() => { setFocused("email"); setEmailError(null); }}
                    onBlur={(e) => {
                      setFocused(null);
                      const v = e.target.value;
                      setFilled((prev) => ({ ...prev, email: !!v }));
                      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) setEmailError("Please enter a valid email address");
                      else setEmailError(null);
                    }}
                    className={cn(
                      "w-full bg-transparent border-b py-3 text-white outline-none transition-colors duration-300",
                      emailError ? "border-red-500/50" : "border-white/10 focus:border-purple-500/50"
                    )}
                    required
                    disabled={isPending}
                    autoComplete="email"
                  />
                  {emailError && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs mt-1 font-mono">
                      {emailError}
                    </motion.p>
                  )}
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-purple-500/60"
                    initial={{ width: 0 }}
                    animate={{ width: focused === "email" ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Message */}
                <div className="relative">
                  <label
                    htmlFor="message"
                    className={cn(
                      "absolute left-0 transition-all duration-200 pointer-events-none font-mono",
                      focused === "message" || filled["message"]
                        ? "-top-5 text-[10px] tracking-[0.2em] text-purple-400"
                        : "top-3 text-sm text-slate-600"
                    )}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    onFocus={() => setFocused("message")}
                    onBlur={(e) => {
                      setFocused(null);
                      setFilled((prev) => ({ ...prev, message: !!e.target.value }));
                    }}
                    className="w-full bg-transparent border-b border-white/10 focus:border-purple-500/50 py-3 text-white outline-none transition-colors duration-300 resize-none"
                    required
                    disabled={isPending}
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-px bg-purple-500/60"
                    initial={{ width: 0 }}
                    animate={{ width: focused === "message" ? "100%" : "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={isPending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="px-8 py-3.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium tracking-wide transition-colors duration-300 disabled:opacity-50 flex items-center gap-2"
                  data-cursor-hover
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> SENDING...</>
                  ) : (
                    <><Send className="w-4 h-4" /> SEND MESSAGE</>
                  )}
                </motion.button>
              </form>
            ) : (
              <div className="space-y-8 animate-pulse">
                <div className="h-12 border-b border-white/10" />
                <div className="h-12 border-b border-white/10" />
                <div className="h-24 border-b border-white/10" />
                <div className="w-48 h-12 rounded-full bg-purple-600/20" />
              </div>
            )}
          </div>
        </Reveal>

        {/* Footer */}
        <Reveal variant="fade-up" delay={0.4}>
          <div className="mt-32 pt-8 border-t border-white/6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600">
              <p>{personalInfo.copyright}</p>
              <p className="font-mono">Built with Next.js & Framer Motion</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
