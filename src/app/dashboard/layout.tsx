import { Sidebar } from "@/components/dashboard/sidebar";
import { CommandPaletteWrapper } from "@/components/dashboard/command-palette-wrapper";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background xl:h-screen xl:flex-row xl:overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex min-h-0 flex-col overflow-hidden">
        <CommandPaletteWrapper />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
