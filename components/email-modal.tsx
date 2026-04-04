"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mail } from "lucide-react";
import { useEffect } from "react";
import { ContactForm } from "@/components/contact-form";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailModal({ isOpen, onClose }: EmailModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg"
          >
            <div
              className="rounded-2xl overflow-hidden border border-white/[0.15]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(20px) saturate(1.8)",
                WebkitBackdropFilter: "blur(20px) saturate(1.8)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(255,255,255,0.04)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/20">
                    <Mail className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Send a message</h3>
                    <p className="text-[11px] text-neutral-500">I&apos;ll get back to you soon.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  title="Close"
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-6">
                <ContactForm />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
