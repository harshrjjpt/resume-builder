import { notFound } from "next/navigation";
import { BuilderClient } from "@/components/editor/builder-client";
import type { ResumeBlock } from "@/types";
import { getActiveUserId } from "@/lib/active-user";
import { localGetResume } from "@/lib/local-store";

export const dynamic = "force-dynamic";

export default async function BuilderPage({ params }: { params: { id: string } }) {
  const userId = await getActiveUserId();
  const resume = localGetResume(userId, params.id);

  if (!resume) notFound();
  const blocks = resume.blocks as ResumeBlock[];

  return (
    <BuilderClient
      resumeId={resume.id}
      initialBlocks={blocks}
      initialTitle={resume.title}
      initialTemplateId={resume.templateId}
    />
  );
}
