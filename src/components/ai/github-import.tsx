"use client";

import { useState, useTransition } from "react";
import { importGitHubProjects } from "@/app/actions/ai";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GitHubImport() {
  const [username, setUsername] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const { blocks, addBlock, deleteBlock } = useResumeStore((s) => ({
    blocks: s.blocks,
    addBlock: s.addBlock,
    deleteBlock: s.deleteBlock
  }));

  return (
    <div className="space-y-3">
      <Input placeholder="GitHub username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <Button
        type="button"
        className="w-full"
        disabled={pending || !username.trim()}
        onClick={() =>
          startTransition(async () => {
            if (!username.trim()) return;
            setError("");
            try {
              const data = await importGitHubProjects(username);
              blocks
                .filter((b) => b.type === "github")
                .forEach((b) => deleteBlock(b.id));
              data.projects.forEach((project) =>
                addBlock("github", {
                  repo: project.name,
                  stars: project.stars,
                  language: project.language,
                  description: project.description,
                  link: project.url
                })
              );
            } catch {
              setError("Import failed. Check username and try again.");
            }
          })
        }
      >
        {pending ? "Importing..." : "Import Projects"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
