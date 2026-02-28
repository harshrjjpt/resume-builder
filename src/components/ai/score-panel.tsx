"use client";

import { useState, useTransition } from "react";
import { scoreResume } from "@/app/actions/ai";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { ScoreGauge } from "@/components/ai/score-gauge";

export function ScorePanel() {
  const blocks = useResumeStore((s) => s.blocks);
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<{ ats: number; readability: number; impact: number; suggestions: string[] } | null>(null);

  return (
    <div className="space-y-4">
      <Button className="w-full" variant="gradient" onClick={() => startTransition(async () => setResult(await scoreResume(blocks)))}>
        {pending ? "Scoring..." : "Run AI Score"}
      </Button>

      {result && (
        <div className="space-y-3 rounded-2xl border p-3">
          <ScoreGauge label="ATS" value={result.ats} />
          <ScoreGauge label="Readability" value={result.readability} />
          <ScoreGauge label="Impact" value={result.impact} />
          <ul className="space-y-1 pt-1">
            {result.suggestions.map((s) => (
              <li key={s} className="text-xs text-muted-foreground">• {s}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
