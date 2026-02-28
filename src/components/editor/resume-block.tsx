"use client";

import { useDrag, useDrop } from "react-dnd";
import { Trash2, GripVertical, Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeBlock as ResumeBlockType } from "@/types";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

// ─── Shared field primitives ──────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const shared =
    "w-full rounded-xl border border-border bg-muted/40 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60 focus:bg-background focus:ring-1 focus:ring-primary/30";

  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className={`${shared} py-2 resize-none leading-snug`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${shared} h-8 py-0`}
        />
      )}
    </div>
  );
}

function BulletsField({
  bullets,
  onChange,
}: {
  bullets: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <Label>Bullet Points</Label>
        <button
          onClick={() => onChange([...bullets, ""])}
          className="flex items-center gap-0.5 text-[10px] text-primary hover:opacity-70 transition"
        >
          <Plus size={10} /> Add
        </button>
      </div>
      <div className="flex flex-col gap-1.5">
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-1.5 items-start">
            <span className="mt-2 text-muted-foreground text-[10px] shrink-0">•</span>
            <textarea
              value={b}
              onChange={(e) => {
                const next = [...bullets];
                next[i] = e.target.value;
                onChange(next);
              }}
              rows={1}
              placeholder={`Bullet ${i + 1}`}
              className="flex-1 rounded-xl border border-border bg-muted/40 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/50 outline-none transition focus:border-primary/60 focus:bg-background focus:ring-1 focus:ring-primary/30 resize-none leading-snug"
            />
            <button
              onClick={() => onChange(bullets.filter((_, j) => j !== i))}
              className="mt-2 text-muted-foreground hover:text-destructive transition"
            >
              <X size={11} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Per-block form renderers ─────────────────────────────────────────────────

function HeaderForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: string) => update(block.id, { ...c, [key]: val });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onPickPhoto: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      update(block.id, { ...c, photo: String(reader.result ?? "") });
    };
    reader.readAsDataURL(file);
    e.currentTarget.value = "";
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
          Upload Photo
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => upd("photo", "")}>
          Remove Photo
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onPickPhoto} />
      </div>
      <Field label="Photo URL" value={String(c.photo ?? "")} onChange={(v) => upd("photo", v)} placeholder="https://..." />
      <Field label="Full Name" value={String(c.name ?? "")} onChange={(v) => upd("name", v)} placeholder="Jordan Lee" />
      <Field label="Role / Title" value={String(c.role ?? "")} onChange={(v) => upd("role", v)} placeholder="Senior Product Engineer" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Email" value={String(c.email ?? "")} onChange={(v) => upd("email", v)} placeholder="hi@email.com" />
        <Field label="Phone" value={String(c.phone ?? "")} onChange={(v) => upd("phone", v)} placeholder="+1 555 000" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Location" value={String(c.location ?? "")} onChange={(v) => upd("location", v)} placeholder="New York, NY" />
        <Field label="Website" value={String(c.website ?? "")} onChange={(v) => upd("website", v)} placeholder="yoursite.com" />
      </div>
      <Field label="LinkedIn" value={String(c.linkedin ?? "")} onChange={(v) => upd("linkedin", v)} placeholder="linkedin.com/in/you" />
      <Field label="Summary" value={String(c.summary ?? "")} onChange={(v) => upd("summary", v)} placeholder="A short professional summary…" multiline />
    </div>
  );
}

function ExperienceForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: unknown) => update(block.id, { ...c, [key]: val });
  const bullets = Array.isArray(c.bullets) ? (c.bullets as string[]) : [""];

  return (
    <div className="flex flex-col gap-3">
      <Field label="Job Title" value={String(c.title ?? "")} onChange={(v) => upd("title", v)} placeholder="Staff Engineer" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Company" value={String(c.company ?? "")} onChange={(v) => upd("company", v)} placeholder="Acme Inc." />
        <Field label="Dates" value={String(c.dates ?? "")} onChange={(v) => upd("dates", v)} placeholder="2021 – Present" />
      </div>
      <BulletsField bullets={bullets} onChange={(v) => upd("bullets", v)} />
    </div>
  );
}

function EducationForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: string) => update(block.id, { ...c, [key]: val });

  return (
    <div className="flex flex-col gap-3">
      <Field label="School" value={String(c.school ?? "")} onChange={(v) => upd("school", v)} placeholder="MIT" />
      <Field label="Degree" value={String(c.degree ?? "")} onChange={(v) => upd("degree", v)} placeholder="B.S. Computer Science" />
      <Field label="Dates" value={String(c.dates ?? "")} onChange={(v) => upd("dates", v)} placeholder="2013 – 2017" />
    </div>
  );
}

function ProjectsForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: string) => update(block.id, { ...c, [key]: val });

  return (
    <div className="flex flex-col gap-3">
      <Field label="Project Name" value={String(c.title ?? "")} onChange={(v) => upd("title", v)} placeholder="ResumeAI" />
      <Field label="Description" value={String(c.description ?? "")} onChange={(v) => upd("description", v)} placeholder="AI-powered resume builder…" multiline />
      <Field label="Link / URL" value={String(c.link ?? "")} onChange={(v) => upd("link", v)} placeholder="github.com/you/project" />
    </div>
  );
}

function SkillsForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const items = Array.isArray(c.items) ? (c.items as string[]) : [];
  const [draft, setDraft] = useState("");

  const add = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const splits = trimmed.split(/[,\n]+/).map((s) => s.trim()).filter(Boolean);
    update(block.id, { ...c, items: [...items, ...splits] });
    setDraft("");
  };

  return (
    <div className="flex flex-col gap-3">
      <Label>Skills</Label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-0.5 text-xs font-medium"
          >
            {item}
            <button
              onClick={() => update(block.id, { ...c, items: items.filter((_, j) => j !== i) })}
              className="text-muted-foreground hover:text-destructive transition"
            >
              <X size={9} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(draft); }
          }}
          placeholder="Type skill & press Enter"
          className="flex-1 h-8 rounded-xl border border-border bg-muted/40 px-3 text-xs outline-none transition focus:border-primary/60 focus:ring-1 focus:ring-primary/30"
        />
        <Button size="icon-sm" variant="outline" onClick={() => add(draft)}>
          <Plus size={12} />
        </Button>
      </div>
      <p className="text-[10px] text-muted-foreground -mt-1">Press Enter or comma to add multiple at once</p>
    </div>
  );
}

function MetricsForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: string) => update(block.id, { ...c, [key]: val });

  return (
    <div className="flex flex-col gap-3">
      <Field label="Headline Metric" value={String(c.headline ?? "")} onChange={(v) => upd("headline", v)} placeholder="+43% Performance" />
      <Field label="Context" value={String(c.context ?? "")} onChange={(v) => upd("context", v)} placeholder="Reduced load time through chunking and edge caching." multiline />
    </div>
  );
}

function GithubForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  const c = block.content;
  const upd = (key: string, val: string) => update(block.id, { ...c, [key]: val });

  return (
    <div className="flex flex-col gap-3">
      <Field label="Repo Name" value={String(c.repo ?? "")} onChange={(v) => upd("repo", v)} placeholder="resume-builder" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="Language" value={String(c.language ?? "")} onChange={(v) => upd("language", v)} placeholder="TypeScript" />
        <Field label="Stars" value={String(c.stars ?? "")} onChange={(v) => upd("stars", v)} placeholder="284" />
      </div>
    </div>
  );
}

function CustomForm({ block }: { block: ResumeBlockType }) {
  const update = useResumeStore((s) => s.updateBlock);
  return (
    <RichTextEditor
      value={String(block.content.body || "<p>Write content...</p>")}
      onChange={(value) =>
        update(block.id, {
          ...block.content,
          title: String(block.content.title || "Rich Text"),
          body: value,
        })
      }
    />
  );
}

// ─── Block type metadata ──────────────────────────────────────────────────────

const BLOCK_META: Record<string, { label: string; color: string }> = {
  header: { label: "Header", color: "text-violet-400" },
  experience: { label: "Experience", color: "text-blue-400" },
  education: { label: "Education", color: "text-emerald-400" },
  projects: { label: "Projects", color: "text-amber-400" },
  skills: { label: "Skills", color: "text-pink-400" },
  metrics: { label: "Metrics", color: "text-cyan-400" },
  github: { label: "GitHub", color: "text-orange-400" },
  custom: { label: "Rich Text", color: "text-slate-400" },
};

function BlockForm({ block }: { block: ResumeBlockType }) {
  switch (block.type) {
    case "header": return <HeaderForm block={block} />;
    case "experience": return <ExperienceForm block={block} />;
    case "education": return <EducationForm block={block} />;
    case "projects": return <ProjectsForm block={block} />;
    case "skills": return <SkillsForm block={block} />;
    case "metrics": return <MetricsForm block={block} />;
    case "github": return <GithubForm block={block} />;
    case "custom": return <CustomForm block={block} />;
    default: return null;
  }
}

// ─── Main ResumeBlock component ───────────────────────────────────────────────

export function ResumeBlock({
  block,
  index,
  moveBlock,
}: {
  block: ResumeBlockType;
  index: number;
  moveBlock: (from: number, to: number) => void;
}) {
  const remove = useResumeStore((s) => s.deleteBlock);
  const [collapsed, setCollapsed] = useState(block.type === "header" ? false : true);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "RESUME_BLOCK",
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveBlock(item.index, index);
          item.index = index;
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [index, moveBlock]
  );

  const [{ isDragging }, drag, dragPreview] = useDrag(
    () => ({
      type: "RESUME_BLOCK",
      item: { id: block.id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    }),
    [block.id, index]
  );

  dragPreview(drop(ref));

  const meta = BLOCK_META[block.type] ?? { label: block.type, color: "text-muted-foreground" };

  return (
    <div
      ref={ref}
      className={[
        "rounded-2xl border bg-card transition-all duration-150 overflow-hidden",
        isDragging
          ? "opacity-40 scale-[0.97] border-dashed border-primary/40 shadow-none"
          : isOver && canDrop
            ? "border-primary/70 shadow-[0_0_0_2px] shadow-primary/20 bg-primary/5"
            : "border-border shadow-sm hover:border-border/80",
      ].join(" ")}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center gap-2 px-3 py-2.5 select-none">
        {/* Drag handle */}
        <button
          ref={drag as unknown as React.Ref<HTMLButtonElement>}
          className={[
            "cursor-grab active:cursor-grabbing rounded-lg p-1 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/60",
          ].join(" ")}
          title="Drag to reorder"
        >
          <GripVertical size={14} />
        </button>

        {/* Block type pill */}
        <span
          className={`text-[10px] font-bold uppercase tracking-widest ${meta.color} flex-1`}
        >
          {meta.label}
        </span>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-lg p-1 text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/60 transition-colors"
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
        </button>

        {/* Delete */}
        <button
          onClick={() => remove(block.id)}
          className="rounded-lg p-1 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
          title="Delete section"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* ── Drop indicator line ── */}
      {isOver && canDrop && !isDragging && (
        <div className="h-0.5 bg-primary/60 mx-3 rounded-full" />
      )}

      {/* ── Form body ── */}
      {!collapsed && (
        <div className="px-3 pb-3 pt-1">
          <BlockForm block={block} />
        </div>
      )}
    </div>
  );
}
