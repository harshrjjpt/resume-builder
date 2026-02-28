"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Copy, ExternalLink, Globe, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createResume, deleteResume, deleteResumes, duplicateResume } from "@/app/actions/resume";
import { formatDate } from "@/lib/utils";

interface ResumeGridProps {
  resumes: Array<{
    id: string;
    title: string;
    updatedAt: Date;
    isPublished: boolean;
    templateId: string;
    _count: { blocks: number };
  }>;
}

export function ResumeGrid({ resumes }: ResumeGridProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const selectedCount = selectedIds.length;
  const allSelected = resumes.length > 0 && selectedCount === resumes.length;

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const selectAll = () => setSelectedIds(resumes.map((resume) => resume.id));
  const clearSelection = () => setSelectedIds([]);

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2">
          <p className="text-sm">
            <span className="font-medium">{selectedCount}</span> selected
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="secondary" onClick={allSelected ? clearSelection : selectAll} disabled={pending}>
              {allSelected ? "Clear all" : "Select all"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-destructive border-destructive/30 hover:bg-destructive/10"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await deleteResumes(selectedIds);
                  clearSelection();
                  setMenuOpen(null);
                  router.refresh();
                })
              }
            >
              <Trash2 size={14} className="mr-1.5" />
              Delete selected
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => startTransition(async () => {
          const resume = await createResume();
          router.push(`/builder/${resume.id}`);
        })}
        className="h-52 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 hover:border-indigo-500/50 transition"
      >
        <div className="h-10 w-10 rounded-xl bg-muted grid place-items-center"><Plus size={18} /></div>
        <div className="text-center">
          <p className="text-sm font-medium">New Resume</p>
          <p className="text-xs text-muted-foreground">Start from scratch</p>
        </div>
      </motion.button>

      {resumes.map((resume, i) => (
        <motion.div
          key={resume.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="relative h-52 rounded-2xl border bg-card overflow-hidden group"
        >
          <label className="absolute left-2 top-2 z-10 inline-flex items-center justify-center rounded bg-background/90 p-1 shadow-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-primary"
              checked={selectedIds.includes(resume.id)}
              onChange={() => toggleSelected(resume.id)}
              aria-label={`Select ${resume.title}`}
            />
          </label>

          <Link href={`/builder/${resume.id}`} className="block h-36 border-b bg-muted/30 p-4 space-y-2">
            <div className="h-3 bg-foreground/10 rounded-full w-28 mx-auto" />
            <div className="h-1.5 bg-foreground/10 rounded-full w-20 mx-auto" />
            <div className="h-px bg-border" />
            <div className="h-1.5 bg-foreground/10 rounded-full w-4/5" />
            <div className="h-1.5 bg-foreground/10 rounded-full w-3/4" />
            <div className="h-1.5 bg-foreground/10 rounded-full w-11/12" />
            <div className="h-1.5 bg-foreground/10 rounded-full w-7/12" />
          </Link>

          <div className="p-3 flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{resume.title}</p>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock size={11} /> {formatDate(resume.updatedAt)}
                {resume.isPublished && <Badge variant="success"><Globe size={10} className="mr-1" />Live</Badge>}
              </div>
            </div>
            <div className="relative">
              <Button size="icon-sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => setMenuOpen(menuOpen === resume.id ? null : resume.id)}>
                <MoreHorizontal size={14} />
              </Button>
              {menuOpen === resume.id && (
                <>
                  <div className="fixed inset-0" onClick={() => setMenuOpen(null)} />
                  <div className="absolute top-8 right-0 z-20 rounded-xl border bg-popover min-w-36 py-1 shadow-soft">
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2" onClick={() => router.push(`/builder/${resume.id}`)}><ExternalLink size={13} />Open</button>
                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2" onClick={() => startTransition(async () => { await duplicateResume(resume.id); router.refresh(); })}><Copy size={13} />Duplicate</button>
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-accent text-destructive flex items-center gap-2"
                      onClick={() =>
                        startTransition(async () => {
                          await deleteResume(resume.id);
                          setSelectedIds((prev) => prev.filter((id) => id !== resume.id));
                          setMenuOpen(null);
                          router.refresh();
                        })
                      }
                    >
                      <Trash2 size={13} />Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
      {pending && <p className="text-xs text-muted-foreground col-span-full">Syncing changes...</p>}
      </div>
    </div>
  );
}
