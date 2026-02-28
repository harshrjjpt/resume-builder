import { ApplicationsKanban } from "@/components/dashboard/applications-kanban";

export default function ApplicationsPage() {
  return (
    <div className="p-8 max-w-full">
      <h1 className="text-2xl font-bold tracking-tight">Application Tracker</h1>
      <p className="text-muted-foreground mt-1">Track your job pipeline with drag-and-drop kanban.</p>
      <div className="mt-7">
        <ApplicationsKanban />
      </div>
    </div>
  );
}
