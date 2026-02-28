"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const commands = [
  { label: "Go to Resumes", href: "/dashboard" },
  { label: "Open Templates", href: "/dashboard/templates" },
  { label: "Application Tracker", href: "/dashboard/applications" },
  { label: "Analytics", href: "/dashboard/analytics" }
];

export function CommandPaletteWrapper() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useHotkeys("meta+k,ctrl+k", (e) => {
    e.preventDefault();
    setOpen((p) => !p);
  });

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <>
      <div className="border-b px-4 py-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Search size={14} /> Command Menu <span className="text-xs text-muted-foreground">⌘K</span>
        </Button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-start pt-28 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-xl rounded-2xl border bg-popover p-2" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type a command"
              className="w-full h-10 rounded-xl border bg-background px-3 text-sm"
            />
            <div className="mt-2 space-y-1">
              {filtered.map((item) => (
                <button
                  key={item.href}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-accent text-sm"
                  onClick={() => {
                    router.push(item.href);
                    setOpen(false);
                    setQ("");
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
