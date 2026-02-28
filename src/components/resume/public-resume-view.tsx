"use client";

import { useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface PublicResume {
  id: string;
  title: string;
  viewCount: number;
  blocks: Array<{ id: string; type: string; content: Record<string, unknown>; order: number }>;
  user: { name: string | null; username: string | null; image: string | null };
}

export function PublicResumeView({ resume }: { resume: PublicResume }) {
  const [showAnalytics] = useState(true);
  const sorted = [...resume.blocks].sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="font-semibold">{resume.user.name || resume.user.username || "Resume"}</p>
            <p className="text-xs text-muted-foreground">Public resume</p>
          </div>
          <ThemeToggle />
        </header>

        <article className="rounded-2xl border bg-card p-8 space-y-4">
          {sorted.map((block) => (
            <section key={block.id}>
              <h2 className="text-sm font-semibold uppercase tracking-wide mb-1">{block.type}</h2>
              {block.type === "custom" ? (
                <div
                  className="text-sm [&_h1]:text-3xl [&_h1]:font-semibold [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:text-lg [&_h4]:font-semibold [&_p]:my-2 [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_blockquote]:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: String(block.content.body || "") }}
                />
              ) : (
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans">{JSON.stringify(block.content, null, 2)}</pre>
              )}
            </section>
          ))}
        </article>

        {showAnalytics && <p className="text-xs text-muted-foreground mt-3">Views: {resume.viewCount}</p>}
      </div>
    </main>
  );
}
