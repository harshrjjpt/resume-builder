import type { ResumeBlock } from "@/types";
import { getDefaultBlocks } from "@/lib/default-blocks";

export type LocalResume = {
  id: string;
  userId: string;
  title: string;
  updatedAt: Date;
  isPublished: boolean;
  templateId: string;
  viewCount: number;
  slug: string | null;
  blocks: ResumeBlock[];
};

export type LocalVersion = {
  id: string;
  resumeId: string;
  title: string;
  snapshot: Record<string, unknown>;
  createdAt: Date;
};

export type LocalApplication = {
  id: string;
  userId: string;
  company: string;
  role: string;
  status: "applied" | "interview" | "offer" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

type LocalState = {
  resumes: LocalResume[];
  versions: LocalVersion[];
  applications: LocalApplication[];
};

declare global {
  // eslint-disable-next-line no-var
  var __hireloom_local_state: LocalState | undefined;
}

const state: LocalState =
  global.__hireloom_local_state ||
  (global.__hireloom_local_state = {
    resumes: [],
    versions: [],
    applications: []
  });

function now() {
  return new Date();
}

function uid() {
  return crypto.randomUUID();
}

export function localCreateResume(userId: string, title = "Untitled Resume", templateId = "minimal") {
  const resume: LocalResume = {
    id: uid(),
    userId,
    title,
    updatedAt: now(),
    isPublished: false,
    templateId,
    viewCount: 0,
    slug: null,
    blocks: getDefaultBlocks()
  };
  state.resumes.unshift(resume);
  return resume;
}

export function localListResumes(userId: string) {
  return state.resumes
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function localGetResume(userId: string, id: string) {
  return state.resumes.find((r) => r.userId === userId && r.id === id) || null;
}

export function localDuplicateResume(userId: string, id: string) {
  const source = localGetResume(userId, id);
  if (!source) return null;
  const duplicate: LocalResume = {
    ...source,
    id: uid(),
    title: `${source.title} Copy`,
    updatedAt: now(),
    isPublished: false,
    slug: null,
    blocks: source.blocks.map((b) => ({ ...b, id: uid() }))
  };
  state.resumes.unshift(duplicate);
  return duplicate;
}

export function localDeleteResume(userId: string, id: string) {
  const idx = state.resumes.findIndex((r) => r.userId === userId && r.id === id);
  if (idx >= 0) state.resumes.splice(idx, 1);
}

export function localSaveResume(userId: string, resumeId: string, title: string, blocks: ResumeBlock[], templateId: string) {
  const resume = localGetResume(userId, resumeId);
  if (!resume) return null;
  resume.title = title;
  resume.templateId = templateId;
  resume.blocks = blocks;
  resume.updatedAt = now();
  return resume;
}

export function localPublishResume(userId: string, resumeId: string, slug: string) {
  const resume = localGetResume(userId, resumeId);
  if (!resume) return null;
  resume.isPublished = true;
  resume.slug = slug;
  resume.updatedAt = now();
  return resume;
}

export function localCreateVersion(resumeId: string, title: string, snapshot: Record<string, unknown>) {
  const version: LocalVersion = { id: uid(), resumeId, title, snapshot, createdAt: now() };
  state.versions.unshift(version);
  return version;
}

export function localGetVersions(resumeId: string) {
  return state.versions.filter((v) => v.resumeId === resumeId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function localFindPublicResume(slug: string) {
  return state.resumes.find((r) => r.slug === slug && r.isPublished) || null;
}

export function localIncrementView(resumeId: string) {
  const resume = state.resumes.find((r) => r.id === resumeId);
  if (resume) resume.viewCount += 1;
}

export function localGetApplications(userId: string) {
  return state.applications
    .filter((a) => a.userId === userId)
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

export function localCreateApplication(userId: string, company: string, role: string) {
  const app: LocalApplication = {
    id: uid(),
    userId,
    company,
    role,
    status: "applied",
    createdAt: now(),
    updatedAt: now()
  };
  state.applications.unshift(app);
  return app;
}

export function localMoveApplication(userId: string, id: string, status: LocalApplication["status"]) {
  const app = state.applications.find((a) => a.userId === userId && a.id === id);
  if (!app) return null;
  app.status = status;
  app.updatedAt = now();
  return app;
}
