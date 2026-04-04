"use client";

import { useState, useCallback } from "react";
import { CommandPalette } from "@/components/command-palette";
import { EmailModal } from "@/components/email-modal";

export function PageShell() {
  const [emailOpen, setEmailOpen] = useState(false);

  const openEmail = useCallback(() => setEmailOpen(true), []);
  const closeEmail = useCallback(() => setEmailOpen(false), []);

  return (
    <>
      <CommandPalette onSendEmail={openEmail} />
      <EmailModal isOpen={emailOpen} onClose={closeEmail} />
    </>
  );
}
