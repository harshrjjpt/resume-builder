"use client";

import { useEffect, useMemo, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApplicationStatus = "applied" | "interview" | "offer" | "rejected";

const columns: { id: ApplicationStatus; label: string }[] = [
  { id: "applied", label: "Applied" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" }
];

interface ApplicationItem {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "hireloom:applications";

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function Card({ item }: { item: ApplicationItem }) {
  const [, drag] = useDrag(() => ({ type: "APP_CARD", item }));
  return (
    <div ref={(node) => { drag(node); }} className="rounded-xl border bg-card p-3 cursor-move">
      <p className="text-sm font-medium">{item.company}</p>
      <p className="text-xs text-muted-foreground">{item.role}</p>
    </div>
  );
}

function Column({
  id,
  label,
  items,
  onDropCard
}: {
  id: ApplicationStatus;
  label: string;
  items: ApplicationItem[];
  onDropCard: (applicationId: string, status: ApplicationStatus) => void;
}) {
  const [, drop] = useDrop(
    () => ({
      accept: "APP_CARD",
      drop: (item: ApplicationItem) => onDropCard(item.id, id)
    }),
    [id, onDropCard]
  );

  return (
    <div ref={(node) => { drop(node); }} className="rounded-2xl border bg-muted/40 p-3 min-h-[420px]">
      <h3 className="text-sm font-semibold mb-3">{label}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export function ApplicationsKanban() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ApplicationItem[];
        if (Array.isArray(parsed)) setApplications(parsed);
      }
    } catch {
      // Ignore invalid local storage data.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [hydrated, applications]);

  const grouped = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        items: applications.filter((a) => a.status === c.id)
      })),
    [applications]
  );

  const addApplication = () => {
    const c = company.trim();
    const r = role.trim();
    if (!c || !r) return;

    const now = new Date().toISOString();
    setApplications((prev) => [
      { id: createId(), company: c, role: r, status: "applied", createdAt: now, updatedAt: now },
      ...prev
    ]);
    setCompany("");
    setRole("");
  };

  const moveApplication = (applicationId: string, status: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status, updatedAt: new Date().toISOString() } : app
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-5">
        <div className="rounded-2xl border bg-card p-4 flex gap-2 flex-col sm:flex-row">
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button onClick={addApplication}>
            <Plus size={14} /> Add
          </Button>
        </div>

        <div className="grid lg:grid-cols-4 gap-4">
          {grouped.map((column) => (
            <Column
              key={column.id}
              id={column.id}
              label={column.label}
              items={column.items}
              onDropCard={moveApplication}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
}
