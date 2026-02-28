"use client";

import React, { useMemo } from "react";
import { useResumeStore } from "@/store/resume-store";
import { TEMPLATES } from "@/lib/templates";
import type { ResumeBlock, ResumeTemplate } from "@/types";
import { applyThemeOverrides } from "@/lib/theme-overrides";

// ─── Font loader ─────────────────────────────────────────────────────────────
const FONT_MAP: Record<string, string> = {
  "'Cormorant Garamond', serif": "Cormorant+Garamond:wght@400;500;600;700",
  "'DM Sans', sans-serif": "DM+Sans:wght@400;500;600;700",
  "'Plus Jakarta Sans', sans-serif": "Plus+Jakarta+Sans:wght@400;500;600;700",
  "'Playfair Display', serif": "Playfair+Display:wght@400;700;900",
  "'Lato', sans-serif": "Lato:wght@300;400;700",
  "'EB Garamond', serif": "EB+Garamond:wght@400;500;600",
  "'Syne', sans-serif": "Syne:wght@400;600;700;800",
  "'Inter', sans-serif": "Inter:wght@400;500;600",
  "'DM Sans', sans-serif ": "DM+Sans:wght@400;500;600;700",
  "'IBM Plex Sans', sans-serif": "IBM+Plex+Sans:wght@400;500;600",
};

function FontLoader({ template }: { template: ResumeTemplate }) {
  const hrefs = useMemo(() => {
    const families = new Set<string>();
    [template.typography.headingFont, template.typography.bodyFont].forEach((f) => {
      if (f && FONT_MAP[f]) families.add(FONT_MAP[f]);
    });
    return [...families].map(
      (f) => `https://fonts.googleapis.com/css2?family=${f}&display=swap`
    );
  }, [template]);
  return (
    <>
      {hrefs.map((h) => (
        <link key={h} rel="stylesheet" href={h} />
      ))}
    </>
  );
}

// ─── Editable text primitive ─────────────────────────────────────────────────
function ET({
  value,
  onSave,
  className = "",
  style,
  tag: Tag = "p",
}: {
  value: string;
  onSave: (v: string) => void;
  className?: string;
  style?: React.CSSProperties;
  tag?: "p" | "h1" | "h2" | "h3" | "span" | "div";
}) {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`focus:outline-none focus:ring-1 focus:ring-blue-400/50 rounded-sm ${className}`}
      style={style}
      onBlur={(e) => onSave((e.currentTarget as HTMLElement).innerText)}
    >
      {value}
    </Tag>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SH({
  label,
  t,
  light = false,
}: {
  label: string;
  t: ResumeTemplate;
  light?: boolean;
}) {
  const style = t.sectionStyle ?? "caps-rule";
  const color = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const accent = t.colors.accent ?? t.colors.primary;
  const hf = t.typography.headingFont;

  if (style === "caps-rule") {
    return (
      <div className="flex items-center gap-3 mb-2.5">
        <span
          className="text-[10px] font-bold uppercase tracking-[0.2em] shrink-0"
          style={{ color, fontFamily: hf }}
        >
          {label}
        </span>
        <div className="flex-1 border-t" style={{ borderColor: `${color}30` }} />
      </div>
    );
  }
  if (style === "underline") {
    return (
      <div className="mb-2.5 border-b pb-1" style={{ borderColor: `${accent}40` }}>
        <span
          className="text-[10.5px] font-bold uppercase tracking-widest"
          style={{ color, fontFamily: hf }}
        >
          {label}
        </span>
      </div>
    );
  }
  if (style === "pill") {
    return (
      <div className="mb-2.5">
        <span
          className="text-[9.5px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ backgroundColor: accent, color: t.colors.background, fontFamily: hf }}
        >
          {label}
        </span>
      </div>
    );
  }
  if (style === "dot") {
    return (
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: light ? t.colors.sidebarText : accent }} />
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color, fontFamily: hf }}
        >
          {label}
        </span>
      </div>
    );
  }
  if (style === "bar") {
    return (
      <div className="flex items-center gap-0 mb-2.5">
        <div className="w-3 h-[14px] mr-2" style={{ backgroundColor: accent }} />
        <span
          className="text-[10.5px] font-bold uppercase tracking-widest"
          style={{ color, fontFamily: hf }}
        >
          {label}
        </span>
        <div className="flex-1 ml-2 border-t border-dashed" style={{ borderColor: `${color}25` }} />
      </div>
    );
  }
  if (style === "bracket") {
    return (
      <div className="mb-2.5">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent, fontFamily: hf }}>
          [ {label} ]
        </span>
      </div>
    );
  }
  return null;
}

// ─── Block content renderers ──────────────────────────────────────────────────
function ExperienceBlock({
  block,
  t,
  update,
  light = false,
  showSectionHeading = true,
  accentCompany = false,
}: {
  block: ResumeBlock;
  t: ResumeTemplate;
  update: (c: Record<string, unknown>) => void;
  light?: boolean;
  showSectionHeading?: boolean;
  accentCompany?: boolean;
}) {
  const { content } = block;
  const bullets = Array.isArray(content.bullets) ? (content.bullets as string[]) : ["Impact bullet"];
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const bf = t.typography.bodyFont;
  const companyColor = accentCompany ? (t.colors.highlight ?? t.colors.accent ?? t.colors.primary) : mutedColor;

  return (
    <section>
      {showSectionHeading && <SH label="Experience" t={t} light={light} />}
      <div className="flex justify-between items-start">
        <ET
          value={String(content.title ?? "Role")}
          className="text-[13px] font-semibold"
          style={{ color: bodyColor, fontFamily: bf }}
          onSave={(v) => update({ ...content, title: v })}
        />
        <ET
          value={String(content.dates ?? "Dates")}
          className="text-[11px] shrink-0 ml-2"
          style={{ color: mutedColor, fontFamily: bf }}
          onSave={(v) => update({ ...content, dates: v })}
        />
      </div>
      <ET
        value={String(content.company ?? "Company")}
        className="text-[12px] font-medium"
        style={{ color: companyColor, fontFamily: bf }}
        onSave={(v) => update({ ...content, company: v })}
      />
      <ul className="list-disc ml-4 mt-1 space-y-0.5">
        {bullets.map((b, i) => (
          <li key={i} className="text-[12px]" style={{ color: mutedColor }}>
            <span
              contentEditable
              suppressContentEditableWarning
              className="focus:outline-none focus:ring-1 focus:ring-blue-400/50"
              style={{ fontFamily: bf }}
              onBlur={(e) => {
                const next = [...bullets];
                next[i] = (e.currentTarget as HTMLElement).innerText;
                update({ ...content, bullets: next });
              }}
            >
              {b}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EducationBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="Education" t={t} light={light} />
      <ET value={String(content.school ?? "University")} className="text-[13px] font-semibold" style={{ color: bodyColor, fontFamily: bf }} onSave={(v) => update({ ...content, school: v })} />
      <ET value={String(content.degree ?? "Degree")} className="text-[12px]" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, degree: v })} />
      <ET value={String(content.dates ?? "Dates")} className="text-[11px]" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, dates: v })} />
    </section>
  );
}

function SkillsBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const items = Array.isArray(content.items) ? (content.items as string[]) : ["TypeScript", "React", "Node.js"];
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const accent = t.colors.accent ?? t.colors.primary;
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="Skills" t={t} light={light} />
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[11px] px-2 py-0.5 rounded"
            style={{
              backgroundColor: light ? `${bodyColor}18` : `${accent}15`,
              color: light ? bodyColor : accent,
              fontFamily: bf,
              border: `1px solid ${light ? bodyColor : accent}30`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <ET
        value={items.join(", ")}
        className="hidden"
        style={{ color: mutedColor, fontFamily: bf }}
        onSave={(v) => update({ ...content, items: v.split(",").map((x) => x.trim()).filter(Boolean) })}
      />
    </section>
  );
}

function ProjectsBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const accent = t.colors.accent ?? t.colors.primary;
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="Projects" t={t} light={light} />
      <ET value={String(content.title ?? "Project")} className="text-[13px] font-semibold" style={{ color: bodyColor, fontFamily: bf }} onSave={(v) => update({ ...content, title: v })} />
      <ET value={String(content.description ?? "Description")} className="text-[12px]" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, description: v })} />
      <ET value={String(content.link ?? "https://")} className="text-[11px]" style={{ color: accent, fontFamily: bf }} onSave={(v) => update({ ...content, link: v })} />
    </section>
  );
}

function GithubBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const accent = t.colors.accent ?? t.colors.primary;
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="GitHub" t={t} light={light} />
      <div className="flex items-start justify-between gap-2">
        <ET value={String(content.repo ?? "repository")} className="text-[13px] font-semibold" style={{ color: bodyColor, fontFamily: bf }} onSave={(v) => update({ ...content, repo: v })} />
        <ET value={String(content.stars ?? "0")} className="text-[11px] shrink-0" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, stars: v })} />
      </div>
      <ET value={String(content.language ?? "TypeScript")} className="text-[11.5px]" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, language: v })} />
      {content.description ? (
        <ET value={String(content.description ?? "")} className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, description: v })} />
      ) : null}
      {content.link ? (
        <ET value={String(content.link ?? "")} className="text-[11px] mt-0.5" style={{ color: accent, fontFamily: bf }} onSave={(v) => update({ ...content, link: v })} />
      ) : null}
    </section>
  );
}

function MetricsBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="Key Metrics" t={t} light={light} />
      <ET value={String(content.headline ?? "+37% conversion")} className="text-[14px] font-bold" style={{ color: bodyColor, fontFamily: bf }} onSave={(v) => update({ ...content, headline: v })} />
      <ET value={String(content.context ?? "Context")} className="text-[12px]" style={{ color: mutedColor, fontFamily: bf }} onSave={(v) => update({ ...content, context: v })} />
    </section>
  );
}

function AchievementsBlock({
  block, t, update,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void }) {
  const { content } = block;
  const bf = t.typography.bodyFont;
  const highlight = t.colors.highlight ?? t.colors.accent ?? t.colors.primary;
  return (
    <section>
      <SH label="Key Achievements" t={t} />
      <ET value={String(content.title ?? "Achievement Title")} className="text-[12.5px] font-semibold mb-0.5" style={{ color: t.colors.primary, fontFamily: bf }} onSave={(v) => update({ ...content, title: v })} />
      <ET value={String(content.description ?? "Description of achievement.")} className="text-[12px]" style={{ color: t.colors.muted, fontFamily: bf }} onSave={(v) => update({ ...content, description: v })} />
    </section>
  );
}

function LanguagesBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const items = Array.isArray(content.items)
    ? (content.items as { name: string; level: number }[])
    : [{ name: "English", level: 5 }, { name: "Spanish", level: 3 }];
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const accent = light ? (t.colors.sidebarText ?? "#fff") : (t.colors.highlight ?? t.colors.accent ?? t.colors.primary);
  const bf = t.typography.bodyFont;
  return (
    <section>
      <SH label="Languages" t={t} light={light} />
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <span className="text-[12px]" style={{ color: bodyColor, fontFamily: bf }}>{item.name}</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className="w-3.5 h-1.5 rounded-sm"
                  style={{ backgroundColor: n <= item.level ? accent : `${accent}30` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CustomBlock({
  block, t, update, light = false,
}: { block: ResumeBlock; t: ResumeTemplate; update: (c: Record<string, unknown>) => void; light?: boolean }) {
  const { content } = block;
  const bodyColor = light ? (t.colors.sidebarText ?? "#fff") : t.colors.primary;
  const mutedColor = light ? (t.colors.muted ?? "#94a3b8") : t.colors.muted;
  const bf = t.typography.bodyFont;

  return (
    <section>
      <SH label={String(content.title ?? "Custom Section")} t={t} light={light} />
      <div
        contentEditable
        suppressContentEditableWarning
        className="rounded-md border px-3 py-2 text-[12px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-400/50 [&_a]:text-sky-500 [&_a]:underline [&_a]:underline-offset-2"
        style={{ color: mutedColor, fontFamily: bf, borderColor: `${bodyColor}25`, minHeight: 84 }}
        onBlur={(e) => update({ ...content, body: (e.currentTarget as HTMLDivElement).innerHTML })}
        dangerouslySetInnerHTML={{ __html: String(content.body ?? "<p>Write details here.</p>") }}
      />
    </section>
  );
}

// ─── Generic block dispatcher ─────────────────────────────────────────────────
function BlockDispatch({
  block, t, updateBlock, light = false, accentCompany = false, showExpHeading = true,
}: {
  block: ResumeBlock;
  t: ResumeTemplate;
  updateBlock: (id: string, c: Record<string, unknown>) => void;
  light?: boolean;
  accentCompany?: boolean;
  showExpHeading?: boolean;
}) {
  const upd = (c: Record<string, unknown>) => updateBlock(block.id, c);
  if (block.type === "header") return null;
  if (block.type === "experience") return <ExperienceBlock block={block} t={t} update={upd} light={light} accentCompany={accentCompany} showSectionHeading={showExpHeading} />;
  if (block.type === "education") return <EducationBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "skills") return <SkillsBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "projects") return <ProjectsBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "github") return <GithubBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "metrics") return <MetricsBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "achievements") return <AchievementsBlock block={block} t={t} update={upd} />;
  if (block.type === "languages") return <LanguagesBlock block={block} t={t} update={upd} light={light} />;
  if (block.type === "custom") return <CustomBlock block={block} t={t} update={upd} light={light} />;
  return null;
}

// ─── Layout: MEREDITH (img 1) ─────────────────────────────────────────────────
// Monogram initials box top-left, full-width name stripe, thin CONTACT sidebar left, main right
function LayoutMeredith({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const accent = t.colors.accent ?? "#b8d4d4";
  const muted = t.colors.muted;
  const primary = t.colors.primary;

  // Derive initials from name
  const name = String(hb?.content.name ?? "Sabrina Meredith");
  const parts = name.trim().split(" ");
  const initials = parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.slice(0, 2);

  const firstName = parts.slice(0, -1).join(" ");
  const lastName = parts[parts.length - 1] ?? name;

  const sideBlocks = sorted.filter((b) => ["contact", "skills", "education", "projects"].includes(b.type));
  const mainBlocks = sorted.filter((b) => !["header", "contact", "skills", "education", "projects"].includes(b.type));

  return (
    <div>
      {/* Top header area */}
      <div className="flex items-end gap-0 mb-6">
        {/* Monogram box */}
        <div
          className="w-[72px] h-[72px] flex items-center justify-center text-[22px] font-bold mr-6 shrink-0"
          style={{ backgroundColor: accent, color: primary, fontFamily: hf }}
        >
          {initials}
        </div>
        {/* Name block */}
        <div>
          <div className="text-[13px] uppercase tracking-[0.18em] mb-0.5" style={{ color: muted, fontFamily: bf }}>
            {firstName}
          </div>
          <ET
            value={lastName}
            tag="h1"
            className={`${t.typography.heading} font-bold leading-none tracking-tight`}
            style={{ color: primary, fontFamily: hf }}
            onSave={(v) => save("name", `${firstName} ${v}`)}
          />
        </div>
      </div>
      {/* Thin horizontal rule */}
      <div className="border-t mb-6" style={{ borderColor: `${primary}20` }} />
      {/* Two-column: thin sidebar left, main right */}
      <div className="grid grid-cols-[180px_1fr] gap-8">
        {/* Left sidebar */}
        <aside className="space-y-5 border-r pr-6" style={{ borderColor: `${primary}15` }}>
          {/* Contact section */}
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2 border-l-2 pl-2" style={{ color: primary, borderColor: accent, fontFamily: bf }}>
              Contact
            </div>
            <ET value={String(hb?.content.email ?? "hello@email.com")} className="text-[11px] block mb-1" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("email", v)} />
            <ET value={String(hb?.content.phone ?? "+1 234 567 890")} className="text-[11px] block mb-1" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("phone", v)} />
            <ET value={String(hb?.content.location ?? "New York")} className="text-[11px] block" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("location", v)} />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-[0.2em] font-bold mb-2 border-l-2 pl-2" style={{ color: primary, borderColor: accent, fontFamily: bf }}>
              Role
            </div>
            <ET value={String(hb?.content.role ?? "Full-Stack Designer")} className="text-[11px]" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("role", v)} />
          </div>
          {sideBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} />
            </div>
          ))}
        </aside>
        {/* Main */}
        <main className="space-y-5">
          {/* Profile */}
          <div>
            <SH label="Profile" t={t} />
            <ET value={String(hb?.content.summary ?? "A short professional summary goes here.")} className="text-[13px] leading-relaxed" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("summary", v)} />
          </div>
          {mainBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

// ─── Layout: CHARLIE (img 2) ──────────────────────────────────────────────────
// Dark card: left panel with photo + name + contact, right panel with experience
function LayoutCharlie({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const sideText = t.colors.sidebarText ?? "#f1f5f9";
  const sideMuted = t.colors.muted;
  const sideBg = t.colors.sidebarBg ?? "#1c1c1c";
  const primary = t.colors.primary;
  const photo = String(hb?.content.photo ?? "");

  const sideBlocks = sorted.filter((b) => ["skills", "languages", "education"].includes(b.type));
  const mainBlocks = sorted.filter((b) => !["header", "skills", "languages", "education"].includes(b.type));

  return (
    <div className="grid grid-cols-[280px_1fr] min-h-[1100px] -m-12 ">
      {/* Left card panel */}
      <aside className="p-8 space-y-5 rounded-l-md" style={{ backgroundColor: sideBg }}>
        {photo ? (
          <div
            className="w-full h-[220px] rounded-xl mb-4 overflow-hidden"
            style={{ backgroundColor: `${sideText}15` }}
          >
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : null}
        {/* Name + role */}
        <div>
          <ET
            value={String(hb?.content.name ?? "Charlie Foley")}
            tag="h1"
            className={`${t.typography.heading} font-bold leading-tight`}
            style={{ color: sideText, fontFamily: hf }}
            onSave={(v) => save("name", v)}
          />
          <ET
            value={String(hb?.content.role ?? "Design Engineer @ OpenAI")}
            className="text-[13px] mt-1"
            style={{ color: sideMuted, fontFamily: bf }}
            onSave={(v) => save("role", v)}
          />
        </div>
        {/* Contact info */}
        <div className="space-y-1.5 pt-1">
          {[
            { label: "Website", key: "website", def: "charlie.studio" },
            { label: "Email", key: "email", def: "hey@charlie.studio" },
            { label: "Phone", key: "phone", def: "+77 12 34 56 78" },
          ].map(({ label, key, def }) => (
            <div key={key} className="flex justify-between items-baseline gap-2">
              <span className="text-[11px] font-medium" style={{ color: sideMuted, fontFamily: bf }}>{label}</span>
              <ET
                value={String(hb?.content[key] ?? def)}
                className="text-[11px] text-right"
                style={{ color: sideText, fontFamily: bf }}
                onSave={(v) => save(key, v)}
              />
            </div>
          ))}
        </div>
        <div className="border-t pt-4" style={{ borderColor: `${sideText}20` }}>
          {sideBlocks.map((b) => (
            <div key={b.id} className="mb-4">
              <BlockDispatch block={b} t={t} updateBlock={update} light />
            </div>
          ))}
        </div>
      </aside>
      {/* Right main panel */}
      <main className="p-8 space-y-6" style={{ backgroundColor: t.colors.background }}>
        {/* Summary */}
        <div>
          <SH label="About" t={t} />
          <ET
            value={String(hb?.content.summary ?? "A passionate designer building user-centric experiences.")}
            className="text-[13px] leading-relaxed"
            style={{ color: t.colors.muted, fontFamily: bf }}
            onSave={(v) => save("summary", v)}
          />
        </div>
        {mainBlocks.map((b) => (
          <div key={b.id}>
            <BlockDispatch block={b} t={t} updateBlock={update} accentCompany />
          </div>
        ))}
      </main>
    </div>
  );
}

// ─── Layout: FIA (img 3) ───────────────────────────────────────────────────────
// Editorial: big "Hi, I'm [name]" greeting, accent circle, date-dot timeline for experience
function LayoutFia({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const accent = t.colors.accent ?? "#f5c518";
  const primary = t.colors.primary;
  const muted = t.colors.muted;
  const photo = String(hb?.content.photo ?? "");

  const name = String(hb?.content.name ?? "fia");
  const firstName = name.split(" ")[0];

  const expBlocks = sorted.filter((b) => b.type === "experience");
  const otherBlocks = sorted.filter((b) => !["header", "experience"].includes(b.type));

  return (
    <div>
      {/* Hero greeting */}
      <div className="flex items-center gap-6 mb-8">
        {photo ? (
          <div className="w-[120px] h-[120px] rounded-full flex-shrink-0 overflow-hidden" style={{ backgroundColor: accent }}>
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : null}
        <div>
          <h1
            className={`${t.typography.heading} font-black leading-none`}
            style={{ fontFamily: hf, color: primary }}
          >
            Hi,<br />
            I'm{" "}
            <ET
              value={firstName}
              tag="span"
              className="inline"
              style={{ color: primary, fontFamily: hf }}
              onSave={(v) => save("name", `${v} ${name.split(" ").slice(1).join(" ")}`)}
            />{" "}
            <span style={{ color: accent }}>&</span><br />
            I{" "}
            <ET
              value={String(hb?.content.tagline ?? "design.")}
              tag="span"
              className="inline"
              style={{ color: primary, fontFamily: hf }}
              onSave={(v) => save("tagline", v)}
            />
          </h1>
        </div>
      </div>
      {/* Contact strip */}
      <div className="flex gap-6 text-[11px] mb-8 pb-4 border-b" style={{ borderColor: `${primary}15`, color: muted, fontFamily: bf }}>
        <ET value={String(hb?.content.website ?? "fia.studio")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("website", v)} />
        <ET value={String(hb?.content.email ?? "fia@studio.com")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("email", v)} />
        <ET value={String(hb?.content.location ?? "Remote-friendly")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("location", v)} />
      </div>
      {/* About me two-col */}
      <div className="grid grid-cols-[140px_1fr_1fr] gap-6 mb-8">
        <div className="text-[11px] font-bold uppercase tracking-widest pt-1" style={{ color: primary, fontFamily: hf }}>
          About me
        </div>
        <ET
          value={String(hb?.content.summary ?? "I'm a front-end developer with a passion for crafting beautiful, fast, and accessible websites.")}
          className="text-[12.5px] leading-relaxed col-span-2"
          style={{ color: muted, fontFamily: bf }}
          onSave={(v) => save("summary", v)}
        />
      </div>
      {/* Experience — date-dot timeline */}
      <div className="grid grid-cols-[140px_1fr] gap-6 mb-6">
        <div className="text-[11px] font-bold uppercase tracking-widest pt-1" style={{ color: primary, fontFamily: hf }}>
          Experience
        </div>
        <div className="space-y-5">
          {expBlocks.map((b) => {
            const upd = (c: Record<string, unknown>) => update(b.id, c);
            const bullets = Array.isArray(b.content.bullets) ? (b.content.bullets as string[]) : ["Impact bullet"];
            return (
              <div key={b.id} className="relative pl-5">
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-[6px] w-2 h-2 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <div className="flex items-baseline gap-3 mb-0.5">
                  <ET value={String(b.content.dates ?? "2023 – 2025")} className="text-[11px]" style={{ color: muted, fontFamily: bf }} onSave={(v) => upd({ ...b.content, dates: v })} />
                  <ET value={String(b.content.company ?? "Studio")} className="text-[11px]" style={{ color: muted, fontFamily: bf }} onSave={(v) => upd({ ...b.content, company: v })} />
                </div>
                <ET value={String(b.content.title ?? "Role")} className="text-[13px] font-semibold mb-1" style={{ color: primary, fontFamily: bf }} onSave={(v) => upd({ ...b.content, title: v })} />
                <ul className="space-y-0.5">
                  {bullets.map((bul, i) => (
                    <li key={i} className="text-[12px] flex gap-1.5" style={{ color: muted }}>
                      <span style={{ color: accent }}>•</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        className="focus:outline-none"
                        style={{ fontFamily: bf }}
                        onBlur={(e) => {
                          const next = [...bullets];
                          next[i] = (e.currentTarget as HTMLElement).innerText;
                          upd({ ...b.content, bullets: next });
                        }}
                      >{bul}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {/* Other blocks */}
      <div className="grid grid-cols-2 gap-6">
        {otherBlocks.map((b) => (
          <div key={b.id}>
            <BlockDispatch block={b} t={t} updateBlock={update} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Layout: HAMPTONE (img 4) ─────────────────────────────────────────────────
// Small role label, HUGE serif name, circle photo top-right, divider, two columns below
function LayoutHamptone({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const primary = t.colors.primary;
  const muted = t.colors.muted;
  const photo = String(hb?.content.photo ?? "");

  const sideBlocks = sorted.filter((b) => ["skills", "languages", "contact", "education"].includes(b.type));
  const mainBlocks = sorted.filter((b) => !["header", "skills", "languages", "contact", "education"].includes(b.type));

  return (
    <div>
      {/* Header: role label + huge name + circle photo */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <ET
            value={String(hb?.content.role ?? "Project Manager")}
            className="text-[10.5px] uppercase tracking-[0.22em] font-medium mb-1 block"
            style={{ color: muted, fontFamily: bf }}
            onSave={(v) => save("role", v)}
          />
          <ET
            value={String(hb?.content.name ?? "Thomas Hamptone")}
            tag="h1"
            className={`${t.typography.heading} font-bold leading-none`}
            style={{ color: primary, fontFamily: hf }}
            onSave={(v) => save("name", v)}
          />
        </div>
        {photo ? (
          <div
            className="w-[90px] h-[90px] rounded-full flex-shrink-0 ml-6 overflow-hidden"
            style={{ backgroundColor: `${primary}12`, border: `2px solid ${primary}20` }}
          >
            <img src={photo} alt="Profile" className="w-full h-full object-cover" />
          </div>
        ) : null}
      </div>
      {/* Thin divider */}
      <div className="border-t my-5" style={{ borderColor: `${primary}25` }} />
      {/* Two columns */}
      <div className="grid grid-cols-[200px_1fr] gap-8">
        {/* Left: contact + skills */}
        <aside className="space-y-5 border-r pr-6" style={{ borderColor: `${primary}15` }}>
          {/* Contact */}
          <div>
            <SH label="Contact" t={t} />
            {[
              { key: "location", def: "10 Downing Street, London", icon: "⌂" },
              { key: "phone", def: "020 7123 4567", icon: "✆" },
              { key: "email", def: "name@gmail.com", icon: "✉" },
              { key: "linkedin", def: "linkedin.com/in/name", icon: "⊞" },
            ].map(({ key, def, icon }) => (
              <div key={key} className="flex gap-2 items-start mb-1.5">
                <span className="text-[10px] mt-0.5 w-3 shrink-0" style={{ color: muted }}>{icon}</span>
                <ET
                  value={String(hb?.content[key] ?? def)}
                  className="text-[12px] leading-tight"
                  style={{ color: muted, fontFamily: bf }}
                  onSave={(v) => save(key, v)}
                />
              </div>
            ))}
          </div>
          {sideBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} />
            </div>
          ))}
        </aside>
        {/* Right: summary + experience */}
        <main className="space-y-5">
          <div>
            <SH label="Summary" t={t} />
            <ET
              value={String(hb?.content.summary ?? "Detail-oriented professional with 6+ years of experience.")}
              className="text-[13px] leading-relaxed"
              style={{ color: muted, fontFamily: bf }}
              onSave={(v) => save("summary", v)}
            />
          </div>
          {mainBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} />
            </div>
          ))}
        </main>
      </div>
    </div>
  );
}

// ─── Layout: ETHAN (img 5) ────────────────────────────────────────────────────
// Large name + colored role subtitle, contact strip, dense two-column with achievements, language bars
function LayoutEthan({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const primary = t.colors.primary;
  const muted = t.colors.muted;
  const highlight = t.colors.highlight ?? "#2563eb";

  const rightBlocks = sorted.filter((b) => ["achievements", "skills", "education", "languages", "metrics"].includes(b.type));
  const leftBlocks = sorted.filter((b) => !["header", "achievements", "skills", "education", "languages", "metrics"].includes(b.type));

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <ET
          value={String(hb?.content.name ?? "Ethan Smith")}
          tag="h1"
          className={`${t.typography.heading} font-extrabold leading-none`}
          style={{ color: primary, fontFamily: hf }}
          onSave={(v) => save("name", v)}
        />
        <ET
          value={String(hb?.content.role ?? "Chief Experience Officer | Customer-Centric Strategies | Digital Transformation")}
          className="text-[13.5px] font-semibold mt-1 leading-tight"
          style={{ color: highlight, fontFamily: bf }}
          onSave={(v) => save("role", v)}
        />
        {/* Contact strip */}
        <div className="flex gap-4 mt-2 text-[11.5px]" style={{ color: muted, fontFamily: bf }}>
          <ET value={String(hb?.content.email ?? "e.smith@email.com")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("email", v)} />
          <span>·</span>
          <ET value={String(hb?.content.linkedin ?? "LinkedIn")} className="inline" style={{ color: highlight, fontFamily: bf }} onSave={(v) => save("linkedin", v)} />
          <span>·</span>
          <ET value={String(hb?.content.location ?? "Indianapolis, Indiana")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("location", v)} />
        </div>
      </div>
      {/* Divider */}
      <div className="border-t mb-5" style={{ borderColor: `${primary}25` }} />
      {/* Two columns */}
      <div className="grid grid-cols-[1fr_240px] gap-6">
        {/* Left: summary + experience */}
        <div className="space-y-4">
          <div>
            <SH label="Summary" t={t} />
            <ET
              value={String(hb?.content.summary ?? "Over 15 years in customer experience management, proven record of success.")}
              className="text-[12.5px] leading-relaxed"
              style={{ color: muted, fontFamily: bf }}
              onSave={(v) => save("summary", v)}
            />
          </div>
          {leftBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} accentCompany />
            </div>
          ))}
        </div>
        {/* Right: achievements + skills + education + languages */}
        <div className="space-y-4 pl-4 border-l" style={{ borderColor: `${primary}15` }}>
          {rightBlocks.map((b) => (
            <div key={b.id}>
              <BlockDispatch block={b} t={t} updateBlock={update} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Layout: SIDEBAR-LEFT ─────────────────────────────────────────────────────
function LayoutSidebarLeft({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const sideBg = t.colors.sidebarBg ?? t.colors.accent ?? "#1e3a5f";
  const sideText = t.colors.sidebarText ?? "#ffffff";
  const sideMuted = t.colors.muted;

  const sideBlocks = sorted.filter((b) => ["skills", "education", "languages", "projects"].includes(b.type));
  const mainBlocks = sorted.filter((b) => !["header", "skills", "education", "languages", "projects"].includes(b.type));

  return (
    <div className="grid grid-cols-[220px_1fr] min-h-[1100px] -m-12">
      <aside className="p-8 space-y-5 rounded-l-md" style={{ backgroundColor: sideBg }}>
        <ET value={String(hb?.content.name ?? "Your Name")} tag="h1" className={`${t.typography.heading} font-bold leading-tight`} style={{ color: sideText, fontFamily: hf }} onSave={(v) => save("name", v)} />
        <ET value={String(hb?.content.role ?? "Role")} className="text-[12.5px] font-medium -mt-3 block" style={{ color: `${sideText}99`, fontFamily: bf }} onSave={(v) => save("role", v)} />
        <div className="border-t pt-4 space-y-1" style={{ borderColor: `${sideText}25` }}>
          <ET value={String(hb?.content.email ?? "email@example.com")} className="text-[11.5px] block" style={{ color: `${sideText}cc`, fontFamily: bf }} onSave={(v) => save("email", v)} />
          <ET value={String(hb?.content.phone ?? "+1 234 567 890")} className="text-[11.5px] block" style={{ color: `${sideText}cc`, fontFamily: bf }} onSave={(v) => save("phone", v)} />
          <ET value={String(hb?.content.location ?? "City, Country")} className="text-[11.5px] block" style={{ color: `${sideText}cc`, fontFamily: bf }} onSave={(v) => save("location", v)} />
        </div>
        <div className="border-t pt-4 space-y-4" style={{ borderColor: `${sideText}25` }}>
          {sideBlocks.map((b) => (
            <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} light /></div>
          ))}
        </div>
      </aside>
      <main className="p-8 space-y-5">
        <div>
          <SH label="Profile" t={t} />
          <ET value={String(hb?.content.summary ?? "Summary")} className="text-[13px] leading-relaxed" style={{ color: t.colors.muted, fontFamily: bf }} onSave={(v) => save("summary", v)} />
        </div>
        {mainBlocks.map((b) => (
          <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} accentCompany /></div>
        ))}
      </main>
    </div>
  );
}

// ─── Layout: TOP-BANNER ───────────────────────────────────────────────────────
function LayoutTopBanner({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const hBg = t.colors.headerBg ?? t.colors.primary;
  const hText = t.colors.headerText ?? "#ffffff";

  const sideBlocks = sorted.filter((b) => ["skills", "languages", "metrics", "achievements"].includes(b.type));
  const mainBlocks = sorted.filter((b) => !["header", "skills", "languages", "metrics", "achievements"].includes(b.type));

  return (
    <div>
      <div className="px-12 py-9 -mx-12 -mt-12 mb-8" style={{ backgroundColor: hBg }}>
        <ET value={String(hb?.content.name ?? "Your Name")} tag="h1" className={`${t.typography.heading} font-bold leading-none`} style={{ color: hText, fontFamily: hf }} onSave={(v) => save("name", v)} />
        <ET value={String(hb?.content.role ?? "Role")} className="text-[15px] font-medium mt-1 block opacity-80" style={{ color: hText, fontFamily: bf }} onSave={(v) => save("role", v)} />
        <div className="flex gap-4 mt-2 text-[12px] opacity-60" style={{ color: hText, fontFamily: bf }}>
          <ET value={String(hb?.content.email ?? "email@example.com")} className="inline" style={{ color: hText, fontFamily: bf }} onSave={(v) => save("email", v)} />
          <span>·</span>
          <ET value={String(hb?.content.location ?? "City, Country")} className="inline" style={{ color: hText, fontFamily: bf }} onSave={(v) => save("location", v)} />
        </div>
        <ET value={String(hb?.content.summary ?? "Summary")} className="text-[13px] mt-3 block max-w-[500px] opacity-70 leading-relaxed" style={{ color: hText, fontFamily: bf }} onSave={(v) => save("summary", v)} />
      </div>
      <div className="grid grid-cols-[1fr_230px] gap-8">
        <div className="space-y-5">{mainBlocks.map((b) => <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} accentCompany /></div>)}</div>
        <aside className="space-y-5">{sideBlocks.map((b) => <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} /></div>)}</aside>
      </div>
    </div>
  );
}

// ─── Layout: CENTERED-HEADER ──────────────────────────────────────────────────
function LayoutCenteredHeader({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const primary = t.colors.primary;
  const muted = t.colors.muted;
  const accent = t.colors.accent ?? primary;
  const allNonHdr = sorted.filter((b) => b.type !== "header");

  return (
    <div>
      <div className="text-center pb-6 mb-6 border-b" style={{ borderColor: `${accent}30` }}>
        <ET value={String(hb?.content.name ?? "Your Name")} tag="h1" className={`${t.typography.heading} font-bold leading-none`} style={{ color: primary, fontFamily: hf }} onSave={(v) => save("name", v)} />
        <ET value={String(hb?.content.role ?? "Role")} className="text-[14px] font-medium mt-1.5 block" style={{ color: accent, fontFamily: bf }} onSave={(v) => save("role", v)} />
        <div className="flex justify-center gap-4 mt-2 text-[12px]" style={{ color: muted, fontFamily: bf }}>
          <ET value={String(hb?.content.email ?? "email@example.com")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("email", v)} />
          <span>·</span>
          <ET value={String(hb?.content.location ?? "City")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("location", v)} />
        </div>
        <ET value={String(hb?.content.summary ?? "Summary")} className="text-[12.5px] mt-3 mx-auto max-w-[520px] leading-relaxed block" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("summary", v)} />
      </div>
      <div className="space-y-5">{allNonHdr.map((b) => <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} /></div>)}</div>
    </div>
  );
}

// ─── Layout: SINGLE-COLUMN ────────────────────────────────────────────────────
function LayoutSingleColumn({ sorted, t, hdr, update }: LayoutProps) {
  const hb = hdr;
  const save = (k: string, v: unknown) => hb && update(hb.id, { ...hb.content, [k]: v });
  const bf = t.typography.bodyFont;
  const hf = t.typography.headingFont;
  const primary = t.colors.primary;
  const muted = t.colors.muted;
  const accent = t.colors.accent ?? primary;
  const allNonHdr = sorted.filter((b) => b.type !== "header");

  return (
    <div>
      <div className="mb-5">
        <ET value={String(hb?.content.name ?? "Your Name")} tag="h1" className={`${t.typography.heading} font-bold leading-none`} style={{ color: primary, fontFamily: hf }} onSave={(v) => save("name", v)} />
        <ET value={String(hb?.content.role ?? "Role")} className="text-[14px] font-medium mt-1 block" style={{ color: accent, fontFamily: bf }} onSave={(v) => save("role", v)} />
        <div className="flex gap-4 mt-1.5 text-[12px]" style={{ color: muted, fontFamily: bf }}>
          <ET value={String(hb?.content.email ?? "email@example.com")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("email", v)} />
          <span>·</span>
          <ET value={String(hb?.content.location ?? "City")} className="inline" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("location", v)} />
        </div>
        <ET value={String(hb?.content.summary ?? "Summary")} className="text-[13px] mt-2 max-w-[580px] leading-relaxed block" style={{ color: muted, fontFamily: bf }} onSave={(v) => save("summary", v)} />
      </div>
      <div className="border-t mb-5" style={{ borderColor: `${primary}20` }} />
      <div className="space-y-5">{allNonHdr.map((b) => <div key={b.id}><BlockDispatch block={b} t={t} updateBlock={update} /></div>)}</div>
    </div>
  );
}

// ─── Layout router ────────────────────────────────────────────────────────────
type LayoutProps = {
  sorted: ResumeBlock[];
  t: ResumeTemplate;
  hdr: ResumeBlock | undefined;
  update: (id: string, c: Record<string, unknown>) => void;
};

export function LivePreview() {
  const { blocks, templateId, updateBlock } = useResumeStore();
  const sorted = useMemo(() => [...blocks].sort((a, b) => a.order - b.order), [blocks]);
  const hdr = sorted.find((b) => b.type === "header");
  const template = useMemo(() => {
    const base = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];
    return applyThemeOverrides(base, hdr?.content);
  }, [templateId, hdr?.content]);

  const props: LayoutProps = { sorted, t: template, hdr, update: updateBlock };

  const isFullBleed = ["meredith", "charlie", "sidebar-left", "glacier", "cardinal"].includes(template.layout);

  let content: React.ReactNode;
  switch (template.layout) {
    case "meredith": content = <LayoutMeredith {...props} />; break;
    case "charlie": content = <LayoutCharlie {...props} />; break;
    case "fia": content = <LayoutFia {...props} />; break;
    case "hamptone": content = <LayoutHamptone {...props} />; break;
    case "ethan": content = <LayoutEthan {...props} />; break;
    case "sidebar-left": content = <LayoutSidebarLeft {...props} />; break;
    case "top-banner": content = <LayoutTopBanner {...props} />; break;
    case "centered-header": content = <LayoutCenteredHeader {...props} />; break;
    default: content = <LayoutSingleColumn {...props} />; break;
  }

  // scale(0.72) shrinks the element visually but it still occupies its natural
  // layout size (850 × naturalHeight px). We compensate with a negative marginBottom
  // so the parent scroll container only sees the true scaled footprint.
  const SCALE = 0.72;
  const scaleRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = scaleRef.current;
    if (!el) return;
    const naturalH = el.scrollHeight;
    el.style.marginBottom = `${-(naturalH * (1 - SCALE))}px`;
  });

  return (
    <>
      <FontLoader template={template} />
      <article
        id="resume-preview"
        className="rounded-md border"
        style={{
          backgroundColor: template.colors.background,
          ["--template-primary" as string]: template.colors.primary,
          ["--template-muted" as string]: template.colors.muted,
          width: 850,
          minHeight: 1100,
          overflow: "visible",
        }}
      >
        <div className={isFullBleed ? "" : "p-12"}>{content}</div>
      </article>
    </>
  );
}
