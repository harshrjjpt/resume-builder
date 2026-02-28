"use server";

import { revalidatePath } from "next/cache";
import type { ResumeBlock } from "@/types";
import { getActiveUserId } from "@/lib/active-user";
import {
  localCreateResume,
  localCreateVersion,
  localDeleteResume,
  localDuplicateResume,
  localGetResume,
  localGetVersions,
  localPublishResume,
  localSaveResume
} from "@/lib/local-store";

async function requireUser() {
  return getActiveUserId();
}

export async function createResume(title = "Untitled Resume", templateId = "minimal") {
  const userId = await requireUser();
  const resume = localCreateResume(userId, title, templateId);
  revalidatePath("/dashboard");
  return resume;
}

export async function duplicateResume(id: string) {
  const userId = await requireUser();
  const local = localDuplicateResume(userId, id);
  if (!local) throw new Error("Resume not found");
  revalidatePath("/dashboard");
  return local;
}

export async function deleteResume(id: string) {
  const userId = await requireUser();
  localDeleteResume(userId, id);
  revalidatePath("/dashboard");
}

export async function deleteResumes(ids: string[]) {
  const userId = await requireUser();
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  if (!uniqueIds.length) return;

  for (const id of uniqueIds) {
    localDeleteResume(userId, id);
  }
  revalidatePath("/dashboard");
}

export async function saveResume(resumeId: string, title: string, blocks: ResumeBlock[], templateId: string) {
  const userId = await requireUser();
  const local = localSaveResume(userId, resumeId, title, blocks, templateId);
  if (!local) throw new Error("Resume not found");
  revalidatePath(`/builder/${resumeId}`);
  revalidatePath("/dashboard");
}

export async function publishResume(resumeId: string, slug: string) {
  const userId = await requireUser();
  const local = localPublishResume(userId, resumeId, slug);
  if (!local) throw new Error("Resume not found");
  revalidatePath("/dashboard");
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/u/${slug}`;
}

export async function createVersion(resumeId: string, title: string, snapshot: Record<string, unknown>) {
  const userId = await requireUser();
  const resume = localGetResume(userId, resumeId);
  if (!resume) throw new Error("Not found");
  localCreateVersion(resumeId, title, snapshot);
}

export async function getResumeVersions(resumeId: string) {
  const userId = await requireUser();
  const resume = localGetResume(userId, resumeId);
  if (!resume) return [];
  return localGetVersions(resumeId);
}
