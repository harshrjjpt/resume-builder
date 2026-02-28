"use client";

import { useState, useTransition } from "react";
import { generateJobSpecificVersion } from "@/app/actions/ai";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function JobMatchPanel() {
  const [jobDescription, setJobDescription] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const blocks = useResumeStore((s) => s.blocks);

  return (
    <div className="space-y-3">
      <Textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description" />
      <Button className="w-full" variant="gradient" onClick={() => startTransition(async () => {
        const res = await generateJobSpecificVersion(jobDescription, blocks);
        setNote(res.notes);
      })}>
        {pending ? "Optimizing..." : "Generate Job-Matched Version"}
      </Button>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
