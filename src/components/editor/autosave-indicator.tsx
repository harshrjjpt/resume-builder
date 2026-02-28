"use client";

import { CheckCircle2, Loader2 } from "lucide-react";

export function AutosaveIndicator({ saving = false, dirty = false }: { saving?: boolean; dirty?: boolean }) {
  if (saving) return <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> Saving...</p>;
  if (dirty) return <p className="text-xs text-amber-500">Unsaved changes</p>;
  return <p className="text-xs text-emerald-500 inline-flex items-center gap-1"><CheckCircle2 size={12} /> Saved</p>;
}
