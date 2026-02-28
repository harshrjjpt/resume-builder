"use client";

import { TEMPLATES } from "@/lib/templates";
import { useResumeStore } from "@/store/resume-store";
import type { ResumeTemplate } from "@/types";
import { applyThemeOverrides } from "@/lib/theme-overrides";

function PreviewCard({ template }: { template: ResumeTemplate }) {
  const c = template.colors;
  const hf = template.typography.headingFont;
  const bf = template.typography.bodyFont;
  const isSidebar = template.layout === "sidebar-left" || template.layout === "meredith" || template.layout === "charlie";
  const isTopBanner = template.layout === "top-banner";
  const isCentered = template.layout === "centered-header";
  const isTwoCol = template.layout === "ethan";

  return (
    <div
      className="relative h-24 w-full overflow-hidden rounded-lg border"
      style={{ backgroundColor: c.background, borderColor: `${c.primary}26` }}
    >
      {isTopBanner ? (
        <div className="h-7 w-full" style={{ backgroundColor: c.headerBg ?? c.primary }} />
      ) : null}

      <div className={`h-full w-full ${isTopBanner ? "pt-1.5" : "pt-2"} px-2`}>
        {isSidebar ? (
          <div className="grid h-full grid-cols-[28%_1fr] gap-2">
            <div className="rounded-sm" style={{ backgroundColor: c.sidebarBg ?? c.accent ?? c.primary }} />
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded-sm" style={{ backgroundColor: `${c.primary}cc` }} />
              <div className="h-1.5 w-16 rounded-sm" style={{ backgroundColor: `${c.muted}cc` }} />
              <div className="h-1.5 w-24 rounded-sm" style={{ backgroundColor: `${c.muted}80` }} />
            </div>
          </div>
        ) : isCentered ? (
          <div className="space-y-2">
            <div className="mx-auto h-2.5 w-24 rounded-sm" style={{ backgroundColor: `${c.primary}cc` }} />
            <div className="mx-auto h-1.5 w-16 rounded-sm" style={{ backgroundColor: `${(c.accent ?? c.primary)}b3` }} />
            <div className="h-px w-full" style={{ backgroundColor: `${(c.accent ?? c.primary)}55` }} />
            <div className="mx-auto h-1.5 w-28 rounded-sm" style={{ backgroundColor: `${c.muted}88` }} />
          </div>
        ) : isTwoCol ? (
          <div className="grid h-full grid-cols-[1fr_34%] gap-2">
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded-sm" style={{ backgroundColor: `${c.primary}cc` }} />
              <div className="h-1.5 w-24 rounded-sm" style={{ backgroundColor: `${c.muted}a6` }} />
              <div className="h-1.5 w-20 rounded-sm" style={{ backgroundColor: `${c.muted}7a` }} />
            </div>
            <div className="rounded-sm border-l pl-2" style={{ borderColor: `${c.primary}2b` }}>
              <div className="h-1.5 w-12 rounded-sm" style={{ backgroundColor: `${(c.highlight ?? c.accent ?? c.primary)}b3` }} />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="h-2.5 w-24 rounded-sm" style={{ backgroundColor: `${c.primary}cc` }} />
            <div className="h-1.5 w-16 rounded-sm" style={{ backgroundColor: `${(c.accent ?? c.primary)}9a` }} />
            <div className="h-1.5 w-28 rounded-sm" style={{ backgroundColor: `${c.muted}8f` }} />
            <div className="h-1.5 w-20 rounded-sm" style={{ backgroundColor: `${c.muted}66` }} />
          </div>
        )}
      </div>

      <div className="absolute right-1.5 top-1.5 rounded bg-black/10 px-1 py-0.5 text-[8px] uppercase tracking-wide text-white/90">
        {template.layout}
      </div>

      <div className="absolute bottom-1 left-1.5 right-1.5 flex items-end justify-between">
        <span
          className="text-[9px] font-semibold leading-none"
          style={{ color: c.primary, fontFamily: hf }}
        >
          Aa
        </span>
        <span
          className="text-[8px] leading-none"
          style={{ color: c.muted, fontFamily: bf }}
        >
          Body
        </span>
      </div>
    </div>
  );
}

export function TemplateSwitcher() {
  const templateId = useResumeStore((s) => s.templateId);
  const setTemplateId = useResumeStore((s) => s.setTemplateId);
  const blocks = useResumeStore((s) => s.blocks);
  const updateBlock = useResumeStore((s) => s.updateBlock);
  const header = blocks.find((b) => b.type === "header");
  const selected = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
  const active = applyThemeOverrides(selected, header?.content);

  const setThemeColor = (key: "themeBg" | "themeText" | "themeHeading" | "themeAccent", value: string) => {
    if (!header) return;
    updateBlock(header.id, { ...header.content, [key]: value });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border p-3 space-y-2">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Theme Palette</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center justify-between rounded-lg border px-2 py-1.5">
            <span>Background</span>
            <input type="color" value={String((header?.content.themeBg as string) ?? active.colors.background)} onChange={(e) => setThemeColor("themeBg", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />
          </label>
          <label className="flex items-center justify-between rounded-lg border px-2 py-1.5">
            <span>Text</span>
            <input type="color" value={String((header?.content.themeText as string) ?? active.colors.muted)} onChange={(e) => setThemeColor("themeText", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />
          </label>
          <label className="flex items-center justify-between rounded-lg border px-2 py-1.5">
            <span>Heading</span>
            <input type="color" value={String((header?.content.themeHeading as string) ?? active.colors.primary)} onChange={(e) => setThemeColor("themeHeading", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />
          </label>
          <label className="flex items-center justify-between rounded-lg border px-2 py-1.5">
            <span>Accent</span>
            <input type="color" value={String((header?.content.themeAccent as string) ?? (active.colors.accent ?? active.colors.primary))} onChange={(e) => setThemeColor("themeAccent", e.target.value)} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />
          </label>
        </div>
      </div>

      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          onClick={() => {
            setTemplateId(template.id);
            if (header) {
              const next = { ...header.content };
              delete next.themeBg;
              delete next.themeText;
              delete next.themeHeading;
              delete next.themeAccent;
              updateBlock(header.id, next);
            }
          }}
          className={`w-full rounded-xl border p-2 text-left transition ${templateId === template.id ? "border-primary bg-primary/5 shadow-sm" : "hover:bg-accent/50"}`}
        >
          <PreviewCard template={template.id === templateId ? active : template} />
          <p className="mt-2 text-sm font-medium">{template.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
        </button>
      ))}
    </div>
  );
}
