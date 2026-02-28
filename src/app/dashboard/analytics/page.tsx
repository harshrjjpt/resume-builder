import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard";
import { getActiveUserId } from "@/lib/active-user";
import { localListResumes } from "@/lib/local-store";

export default async function AnalyticsPage() {
  const userId = await getActiveUserId();
  const resumes = localListResumes(userId).map((r) => ({
    id: r.id,
    title: r.title,
    viewCount: r.viewCount,
    isPublished: r.isPublished,
    createdAt: r.updatedAt
  }));
  const totalViews = resumes.reduce((sum, r) => sum + r.viewCount, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
      <p className="text-muted-foreground mt-1">Track resume performance.</p>
      <div className="mt-7">
        <AnalyticsDashboard resumes={resumes} totalViews={totalViews} />
      </div>
    </div>
  );
}
