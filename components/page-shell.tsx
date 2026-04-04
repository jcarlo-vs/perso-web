"use client";

import { useCallback } from "react";
import { CommandPalette } from "@/components/command-palette";

export function PageShell() {
  const openEmail = useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-email-modal"));
  }, []);

  return <CommandPalette onSendEmail={openEmail} />;
}
