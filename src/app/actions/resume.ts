"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getDefaultBlocks } from "@/lib/default-blocks";
import type { ResumeBlock } from "@/types";
import { getActiveUserId } from "@/lib/active-user";
import { hasDatabase } from "@/lib/runtime";
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
  if (!hasDatabase) return localCreateResume(userId, title, templateId);
  const defaults = getDefaultBlocks();

  const resume = await prisma.resume.create({
    data: {
      userId,
      title,
      templateId,
      blocks: {
        createMany: {
          data: defaults.map((b) => ({
            type: b.type,
            content: b.content,
            order: b.order
          }))
        }
      }
    }
  });

  revalidatePath("/dashboard");
  return resume;
}

export async function duplicateResume(id: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    const local = localDuplicateResume(userId, id);
    if (!local) throw new Error("Resume not found");
    return local;
  }
  const source = await prisma.resume.findFirst({ where: { id, userId }, include: { blocks: true } });
  if (!source) throw new Error("Resume not found");

  const resume = await prisma.resume.create({
    data: {
      userId,
      title: `${source.title} Copy`,
      templateId: source.templateId,
      blocks: {
        createMany: {
          data: source.blocks.map((block) => ({
            type: block.type,
            content: block.content,
            order: block.order
          }))
        }
      }
    }
  });

  revalidatePath("/dashboard");
  return resume;
}

export async function deleteResume(id: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    localDeleteResume(userId, id);
    revalidatePath("/dashboard");
    return;
  }
  await prisma.resume.deleteMany({ where: { id, userId } });
  revalidatePath("/dashboard");
}

export async function deleteResumes(ids: string[]) {
  const userId = await requireUser();
  const uniqueIds = Array.from(new Set(ids)).filter(Boolean);
  if (!uniqueIds.length) return;

  if (!hasDatabase) {
    for (const id of uniqueIds) {
      localDeleteResume(userId, id);
    }
    revalidatePath("/dashboard");
    return;
  }

  await prisma.resume.deleteMany({
    where: {
      userId,
      id: { in: uniqueIds }
    }
  });
  revalidatePath("/dashboard");
}

export async function saveResume(resumeId: string, title: string, blocks: ResumeBlock[], templateId: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    const local = localSaveResume(userId, resumeId, title, blocks, templateId);
    if (!local) throw new Error("Resume not found");
    revalidatePath(`/builder/${resumeId}`);
    revalidatePath("/dashboard");
    return;
  }

  const existing = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
  if (!existing) throw new Error("Resume not found");

  await prisma.$transaction([
    prisma.resume.update({ where: { id: resumeId }, data: { title, templateId } }),
    prisma.resumeBlock.deleteMany({ where: { resumeId } }),
    prisma.resumeBlock.createMany({
      data: blocks.map((block) => ({
        resumeId,
        type: block.type,
        order: block.order,
        content: block.content
      }))
    })
  ]);

  revalidatePath(`/builder/${resumeId}`);
  revalidatePath("/dashboard");
}

export async function publishResume(resumeId: string, slug: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    const local = localPublishResume(userId, resumeId, slug);
    if (!local) throw new Error("Resume not found");
    revalidatePath("/dashboard");
    return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/u/${slug}`;
  }
  await prisma.resume.updateMany({
    where: { id: resumeId, userId },
    data: { isPublished: true, slug }
  });
  revalidatePath("/dashboard");
  return `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/u/${slug}`;
}

export async function createVersion(resumeId: string, title: string, snapshot: Record<string, unknown>) {
  const userId = await requireUser();
  if (!hasDatabase) {
    const resume = localGetResume(userId, resumeId);
    if (!resume) throw new Error("Not found");
    localCreateVersion(resumeId, title, snapshot);
    return;
  }
  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) throw new Error("Not found");
  await prisma.resumeVersion.create({ data: { resumeId, title, snapshot } });
}

export async function getResumeVersions(resumeId: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    const resume = localGetResume(userId, resumeId);
    if (!resume) return [];
    return localGetVersions(resumeId);
  }
  const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId } });
  if (!resume) return [];
  return prisma.resumeVersion.findMany({
    where: { resumeId },
    orderBy: { createdAt: "desc" },
    take: 20
  });
}
