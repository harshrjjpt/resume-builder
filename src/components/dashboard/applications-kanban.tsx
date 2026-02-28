"use client";

import { useMemo, useState, useTransition } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plus } from "lucide-react";
import type { ApplicationStatus } from "@prisma/client";
import { createApplication, moveApplication } from "@/app/actions/applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    [id]
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

export function ApplicationsKanban({ applications }: { applications: ApplicationItem[] }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [pending, startTransition] = useTransition();

  const grouped = useMemo(
    () =>
      columns.map((c) => ({
        ...c,
        items: applications.filter((a) => a.status === c.id)
      })),
    [applications]
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-5">
        <div className="rounded-2xl border bg-card p-4 flex gap-2">
          <Input placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} />
          <Input placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button
            onClick={() =>
              startTransition(async () => {
                if (!company || !role) return;
                await createApplication(company, role);
                setCompany("");
                setRole("");
              })
            }
          >
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
              onDropCard={(applicationId, status) =>
                startTransition(async () => {
                  await moveApplication(applicationId, status);
                })
              }
            />
          ))}
        </div>
        {pending && <p className="text-xs text-muted-foreground">Updating board...</p>}
      </div>
    </DndProvider>
  );
}
