import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BuilderClient } from "@/components/editor/builder-client";
import type { ResumeBlock } from "@/types";
import { getActiveUserId } from "@/lib/active-user";
import { hasDatabase } from "@/lib/runtime";
import { localGetResume } from "@/lib/local-store";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const userId = await getActiveUserId();

  const resume = hasDatabase
    ? await prisma.resume.findFirst({
        where: { id: params.id, userId },
        include: { blocks: { orderBy: { order: "asc" } } }
      })
    : localGetResume(userId, params.id);

  if (!resume) notFound();

  const blocks = (hasDatabase
    ? resume.blocks.map((b) => ({
        id: b.id,
        type: b.type as ResumeBlock["type"],
        content: (b.content && typeof b.content === "object" ? b.content : {}) as Record<string, unknown>,
        order: b.order
      }))
    : resume.blocks) as ResumeBlock[];

  return (
    <BuilderClient
      resumeId={resume.id}
      initialBlocks={blocks}
      initialTitle={resume.title}
      initialTemplateId={resume.templateId}
    />
  );
}
