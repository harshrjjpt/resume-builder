"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useState, useTransition } from "react";
import { importGitHubProjects } from "@/app/actions/ai";
import { useResumeStore } from "@/store/resume-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ImportModal() {
  const [pending, startTransition] = useTransition();
  const [githubUsername, setGithubUsername] = useState("");
  const [linkedinText, setLinkedinText] = useState("");
  const [githubError, setGithubError] = useState("");
  const [githubImported, setGithubImported] = useState(0);
  const { blocks, addBlock, deleteBlock } = useResumeStore((s) => ({
    blocks: s.blocks,
    addBlock: s.addBlock,
    deleteBlock: s.deleteBlock
  }));

  return (
    <Tabs.Root defaultValue="github" className="space-y-3">
      <Tabs.List className="grid grid-cols-2 rounded-xl border p-1">
        <Tabs.Trigger value="github" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-accent">GitHub</Tabs.Trigger>
        <Tabs.Trigger value="linkedin" className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-accent">LinkedIn</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="github" className="space-y-3">
        <Input placeholder="GitHub username (e.g. octocat)" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} />
        {githubError ? <p className="text-xs text-destructive">{githubError}</p> : null}
        {githubImported > 0 ? <p className="text-xs text-muted-foreground">Imported {githubImported} repositories for @{githubUsername.trim().replace(/^@/, "")}.</p> : null}
        <Button
          type="button"
          className="w-full"
          disabled={pending || !githubUsername.trim()}
          onClick={() => startTransition(async () => {
          const username = githubUsername.trim();
          if (!username) return;
          setGithubError("");
          setGithubImported(0);
          try {
            const data = await importGitHubProjects(username);
            blocks
              .filter((b) => b.type === "github")
              .forEach((b) => deleteBlock(b.id));
            data.projects.forEach((project) => {
              addBlock("github", {
                repo: project.name,
                stars: project.stars,
                language: project.language,
                description: project.description,
                link: project.url
              });
            });
            setGithubImported(data.projects.length);
          } catch {
            setGithubError("GitHub import failed. Check username or try again in a minute.");
          }
          })}
        >
          {pending ? "Importing..." : "Import from GitHub"}
        </Button>
      </Tabs.Content>

      <Tabs.Content value="linkedin" className="space-y-3">
        <Textarea
          value={linkedinText}
          onChange={(e) => setLinkedinText(e.target.value)}
          placeholder="Paste LinkedIn summary/experience text"
        />
        <Button className="w-full" onClick={() => {
          if (!linkedinText.trim()) return;
          addBlock("experience");
        }}>
          Add LinkedIn Data
        </Button>
      </Tabs.Content>
    </Tabs.Root>
  );
}
