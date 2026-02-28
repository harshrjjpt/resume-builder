import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PublicResumeView } from "@/components/resume/public-resume-view";
import { hasDatabase } from "@/lib/runtime";
import { localFindPublicResume, localIncrementView } from "@/lib/local-store";

interface Props {
  params: { username: string };
}

async function getPublicResume(slug: string) {
  if (!hasDatabase) {
    const local = localFindPublicResume(slug);
    if (!local) return null;
    return {
      id: local.id,
      title: local.title,
      viewCount: local.viewCount,
      blocks: local.blocks.map((block) => ({
        id: block.id,
        type: block.type,
        content: block.content,
        order: block.order
      })),
      user: { name: "Guest User", username: "guest", image: null }
    };
  }

  return prisma.resume.findFirst({
    where: { slug, isPublished: true },
    include: {
      blocks: { orderBy: { order: "asc" } },
      user: { select: { name: true, username: true, image: true } }
    }
  });
}

async function getPublicResumeWithView(slug: string) {
  const resume = await getPublicResume(slug);

  if (resume) {
    if (hasDatabase) {
      await prisma.resume.update({
        where: { id: resume.id },
        data: { viewCount: { increment: 1 } }
      });
    } else {
      localIncrementView(resume.id);
    }
  }

  return resume;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resume = await getPublicResume(params.username);
  if (!resume) return { title: "Resume Not Found" };

  const header = resume.blocks[0]?.content as Record<string, string> | undefined;
  const name = header?.name ?? resume.user.name ?? params.username;

  return {
    title: `${name} - Resume`,
    description: header?.summary ?? `Resume of ${name}`
  };
}

export default async function PublicResumePage({ params }: Props) {
  const resume = await getPublicResumeWithView(params.username);
  if (!resume) notFound();

  return (
    <PublicResumeView
      resume={{
        id: resume.id,
        title: resume.title,
        viewCount: resume.viewCount,
        blocks: resume.blocks.map((block) => ({
          id: block.id,
          type: block.type,
          content: block.content as Record<string, unknown>,
          order: block.order
        })),
        user: resume.user
      }}
    />
  );
}
