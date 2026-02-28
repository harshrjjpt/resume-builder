"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareLinkModal({ open, onClose, link }: { open: boolean; onClose: () => void; link: string }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/30" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl border bg-popover p-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-medium">Share public resume</h3>
        <p className="text-xs text-muted-foreground mt-1">Anyone with this link can view your published resume.</p>
        <div className="mt-3 rounded-xl border bg-background px-3 py-2 text-sm truncate">{link}</div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Close</Button>
          <Button onClick={async () => {
            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          }}>
            <Copy size={14} /> {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
