import { ResumeGrid } from "@/components/dashboard/resume-grid";
import { getActiveUserId } from "@/lib/active-user";
import { localListResumes } from "@/lib/local-store";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const userId = await getActiveUserId();
  const resumes = localListResumes(userId).map((r) => ({
    id: r.id,
    title: r.title,
    updatedAt: r.updatedAt,
    isPublished: r.isPublished,
    templateId: r.templateId,
    _count: { blocks: r.blocks.length }
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Your resumes</h1>
      <p className="text-muted-foreground mt-1">Build, score, and publish resumes with premium templates.</p>
      <div className="mt-7">
        <ResumeGrid resumes={resumes} />
      </div>
    </div>
  );
}
