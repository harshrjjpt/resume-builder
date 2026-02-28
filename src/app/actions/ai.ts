"use server";

import type { ResumeBlock, ResumeScore } from "@/types";

export async function scoreResume(blocks: ResumeBlock[]): Promise<ResumeScore> {
  await new Promise((r) => setTimeout(r, 700));

  const text = JSON.stringify(blocks).toLowerCase();
  const hasMetrics = /(increased|improved|reduced|%|x)/.test(text);
  const hasSkills = /skills/.test(text);
  const ats = Math.min(98, 62 + blocks.length * 5 + (hasSkills ? 7 : 0));
  const readability = Math.min(96, 58 + Math.floor(text.length / 120) + (hasMetrics ? 8 : 0));
  const impact = Math.min(97, 52 + blocks.length * 6 + (hasMetrics ? 12 : 0));

  return {
    ats,
    readability,
    impact,
    suggestions: [
      "Add 2-3 quantified bullets with business impact.",
      "Tailor your summary and keywords to the role description.",
      "Keep section headings consistent for ATS parsing."
    ]
  };
}

export async function generateJobSpecificVersion(jobDescription: string, blocks: ResumeBlock[]) {
  await new Promise((r) => setTimeout(r, 600));

  const keywords = jobDescription
    .split(/\W+/)
    .filter((w) => w.length > 5)
    .slice(0, 8)
    .join(", ");

  return {
    titleSuffix: " - Role Optimized",
    notes: `Prioritized keywords: ${keywords || "leadership, architecture, execution"}`,
    blocks
  };
}

export async function importGitHubProjects(username: string) {
  const raw = username.trim();
  const fromUrl = raw.match(/github\.com\/([^/?#]+)/i)?.[1];
  const clean = (fromUrl ?? raw).replace(/^@/, "").trim();
  if (!clean) {
    throw new Error("GitHub username is required.");
  }

  const res = await fetch(
    `https://api.github.com/users/${encodeURIComponent(clean)}/repos?sort=updated&per_page=8`,
    {
      headers: { Accept: "application/vnd.github+json" },
      cache: "no-store"
    }
  );

  if (!res.ok) {
    throw new Error("Unable to fetch repositories from GitHub.");
  }

  const repos = (await res.json()) as Array<{
    name?: string;
    stargazers_count?: number;
    language?: string | null;
    description?: string | null;
    html_url?: string;
    fork?: boolean;
  }>;

  const projects = repos
    .filter((r) => !r.fork)
    .map((r) => ({
      name: r.name ?? "repository",
      stars: Number(r.stargazers_count ?? 0),
      language: r.language ?? "Unknown",
      description: r.description ?? "",
      url: r.html_url ?? ""
    }));

  return {
    username: clean,
    projects,
    contributions: 0
  };
}
