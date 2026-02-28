"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createResume } from "@/app/actions/resume";
import { TEMPLATES } from "@/lib/templates";
import type { ResumeBlock, ResumeTemplate } from "@/types";

const PREVIEW_BLOCKS: ResumeBlock[] = [
  {
    id: "h",
    type: "header",
    order: 0,
    content: {
      name: "Jordan Lee",
      role: "Senior Product Engineer",
      email: "jordan.lee@email.com",
      location: "San Francisco, CA",
      summary: "Impact-focused engineer delivering conversion wins, strong architecture, and measurable product outcomes across web platforms."
    }
  },
  {
    id: "e",
    type: "experience",
    order: 1,
    content: {
      title: "Lead Frontend Engineer",
      company: "Northstar Labs",
      dates: "2022 - Present",
      bullets: [
        "Shipped onboarding redesign that improved activation by 31%.",
        "Built internal component platform used across 9 product squads."
      ]
    }
  },
  {
    id: "m",
    type: "metrics",
    order: 2,
    content: {
      headline: "+43% Performance",
      context: "Reduced load time through chunking and edge caching strategy."
    }
  },
  {
    id: "p",
    type: "projects",
    order: 3,
    content: {
      title: "Resume Intelligence Platform",
      description: "AI-assisted writing and ATS optimization for role-specific resumes.",
      link: "resume.tools"
    }
  },
  {
    id: "s",
    type: "skills",
    order: 4,
    content: {
      items: ["TypeScript", "Next.js", "React", "Node.js", "Prisma", "PostgreSQL"]
    }
  },
  {
    id: "ed",
    type: "education",
    order: 5,
    content: {
      school: "University of Texas at Austin",
      degree: "B.S. Computer Science",
      dates: "2015 - 2019"
    }
  },
  {
    id: "g",
    type: "github",
    order: 6,
    content: {
      repo: "resume-builder",
      language: "TypeScript",
      stars: 284
    }
  }
];

const SIDEBAR_TYPES = new Set(["skills", "education", "projects", "github", "metrics"]);

function SectionHeading({ label, template }: { label: string; template: ResumeTemplate }) {
  const style = template.sectionStyle ?? "caps-rule";
  const primary = template.colors.primary;
  const accent = template.colors.accent ?? primary;

  if (style === "caps-rule") {
    return (
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[8px] font-bold uppercase tracking-[0.18em]" style={{ color: primary, fontFamily: template.typography.headingFont }}>
          {label}
        </span>
        <div className="flex-1 border-t" style={{ borderColor: primary, opacity: 0.25 }} />
      </div>
    );
  }
  if (style === "underline") {
    return (
      <div className="mb-1.5">
        <span className="text-[8px] font-semibold uppercase tracking-[0.16em] border-b" style={{ color: primary, borderColor: accent, fontFamily: template.typography.headingFont }}>
          {label}
        </span>
      </div>
    );
  }
  if (style === "pill") {
    return (
      <div className="mb-1.5">
        <span
          className="text-[7px] font-bold uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-full"
          style={{ color: "#ffffff", backgroundColor: accent, fontFamily: template.typography.headingFont }}
        >
          {label}
        </span>
      </div>
    );
  }
  if (style === "bracket") {
    return (
      <div className="mb-1.5">
        <span className="text-[8px] font-bold uppercase tracking-[0.16em]" style={{ color: accent, fontFamily: template.typography.headingFont }}>
          [ {label} ]
        </span>
      </div>
    );
  }
  return null;
}

function StaticBlock({ block, template }: { block: ResumeBlock; template: ResumeTemplate }) {
  const content = block.content;
  const body = template.typography.body;
  const bodyFont = template.typography.bodyFont;
  const primary = template.colors.primary;
  const muted = template.colors.muted;

  if (block.type === "header") return null;

  if (block.type === "experience") {
    const bullets = Array.isArray(content.bullets) ? (content.bullets as string[]) : [];
    return (
      <section>
        <SectionHeading label="Experience" template={template} />
        <p className={`${body} font-semibold`} style={{ color: primary, fontFamily: bodyFont }}>{String(content.title ?? "")}</p>
        <div className="flex items-center justify-between gap-2">
          <p className={body} style={{ color: muted, fontFamily: bodyFont }}>{String(content.company ?? "")}</p>
          <p className="text-[9px] shrink-0" style={{ color: muted, fontFamily: bodyFont }}>{String(content.dates ?? "")}</p>
        </div>
        <ul className="list-disc ml-3 mt-1 space-y-0.5">
          {bullets.slice(0, 2).map((b, i) => (
            <li key={i} className={body} style={{ color: muted, fontFamily: bodyFont }}>{b}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === "projects") {
    return (
      <section>
        <SectionHeading label="Projects" template={template} />
        <p className={`${body} font-semibold`} style={{ color: primary, fontFamily: bodyFont }}>{String(content.title ?? "")}</p>
        <p className={body} style={{ color: muted, fontFamily: bodyFont }}>{String(content.description ?? "")}</p>
      </section>
    );
  }

  if (block.type === "skills") {
    const items = Array.isArray(content.items) ? (content.items as string[]) : [];
    return (
      <section>
        <SectionHeading label="Skills" template={template} />
        <p className={body} style={{ color: muted, fontFamily: bodyFont }}>{items.join(", ")}</p>
      </section>
    );
  }

  if (block.type === "education") {
    return (
      <section>
        <SectionHeading label="Education" template={template} />
        <p className={`${body} font-semibold`} style={{ color: primary, fontFamily: bodyFont }}>{String(content.school ?? "")}</p>
        <p className={body} style={{ color: muted, fontFamily: bodyFont }}>{String(content.degree ?? "")}</p>
      </section>
    );
  }

  if (block.type === "metrics") {
    return (
      <section>
        <SectionHeading label="Metrics" template={template} />
        <p className={`${body} font-semibold`} style={{ color: primary, fontFamily: bodyFont }}>{String(content.headline ?? "")}</p>
        <p className={body} style={{ color: muted, fontFamily: bodyFont }}>{String(content.context ?? "")}</p>
      </section>
    );
  }

  if (block.type === "github") {
    return (
      <section>
        <SectionHeading label="GitHub" template={template} />
        <p className={`${body} font-semibold`} style={{ color: primary, fontFamily: bodyFont }}>{String(content.repo ?? "")}</p>
        <p className={body} style={{ color: muted, fontFamily: bodyFont }}>
          {String(content.language ?? "")} · {String(content.stars ?? 0)} stars
        </p>
      </section>
    );
  }

  return null;
}

function StaticHeader({ template, variant }: { template: ResumeTemplate; variant: "default" | "centered" | "banner" | "split" | "sidebar" | "magazine" }) {
  const header = PREVIEW_BLOCKS.find((b) => b.type === "header");
  if (!header) return null;
  const content = header.content;

  const headingFont = template.typography.headingFont;
  const bodyFont = template.typography.bodyFont;
  const primary = template.colors.primary;
  const muted = template.colors.muted;
  const headerBg = template.colors.headerBg ?? primary;
  const headerText = template.colors.headerText ?? template.colors.background;

  if (variant === "banner") {
    return (
      <header className="px-12 py-7 -mx-12 -mt-12 mb-6" style={{ backgroundColor: headerBg, color: headerText }}>
        <h3 className={`${template.typography.heading} font-bold leading-none`} style={{ fontFamily: headingFont }}>{String(content.name)}</h3>
        <p className="text-[13px] mt-1" style={{ fontFamily: bodyFont, opacity: 0.85 }}>{String(content.role)}</p>
        <p className="text-[11px] mt-1 max-w-[520px]" style={{ fontFamily: bodyFont, opacity: 0.72 }}>{String(content.summary)}</p>
      </header>
    );
  }

  if (variant === "centered") {
    return (
      <header className="text-center pb-5 border-b mb-5" style={{ borderColor: `${primary}22` }}>
        <h3 className={`${template.typography.heading} font-bold leading-none`} style={{ color: primary, fontFamily: headingFont }}>{String(content.name)}</h3>
        <p className="text-[13px] mt-1" style={{ color: template.colors.accent ?? primary, fontFamily: bodyFont }}>{String(content.role)}</p>
        {(() => {
          const email = String(content.email ?? "");
          const location = String(content.location ?? "");
          return (
        <div className="flex justify-center gap-4 mt-1.5 text-[11px]" style={{ color: muted, fontFamily: bodyFont }}>
          {email ? <span>{email}</span> : null}
          {email && location ? <span>·</span> : null}
          {location ? <span>{location}</span> : null}
        </div>
          );
        })()}
        <p className="text-[11px] mt-1.5 max-w-[520px] mx-auto" style={{ color: muted, fontFamily: bodyFont }}>{String(content.summary)}</p>
      </header>
    );
  }

  if (variant === "sidebar") {
    return (
      <header className="mb-5">
        <h3 className={`${template.typography.heading} font-bold leading-tight`} style={{ color: headerText, fontFamily: headingFont }}>{String(content.name)}</h3>
        <p className="text-[12px] mt-1" style={{ color: headerText, fontFamily: bodyFont, opacity: 0.85 }}>{String(content.role)}</p>
      </header>
    );
  }

  return (
    <header className="mb-5">
      <h3 className={`${template.typography.heading} font-bold leading-none`} style={{ color: primary, fontFamily: headingFont }}>{String(content.name)}</h3>
      <p className="text-[13px] mt-1" style={{ color: template.colors.accent ?? primary, fontFamily: bodyFont }}>{String(content.role)}</p>
      <p className="text-[11px] mt-1.5" style={{ color: muted, fontFamily: bodyFont }}>{String(content.summary)}</p>
    </header>
  );
}

function TemplateCardPreview({ template }: { template: ResumeTemplate }) {
  const sorted = [...PREVIEW_BLOCKS].sort((a, b) => a.order - b.order);
  const header = sorted.find((b) => b.type === "header");
  const mainBlocks = sorted.filter((b) => b.type !== "header" && !SIDEBAR_TYPES.has(b.type));
  const sideBlocks = sorted.filter((b) => SIDEBAR_TYPES.has(b.type));
  const allNonHeader = sorted.filter((b) => b.type !== "header");
  const layout = template.layout;

  let content: React.ReactNode;

  if (layout === "single-column") {
    content = <div className={template.spacing}>{header && <StaticHeader template={template} variant="default" />}{allNonHeader.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div>;
  } else if (layout === "centered-header") {
    content = <div>{header && <StaticHeader template={template} variant="centered" />}<div className={template.spacing}>{allNonHeader.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div></div>;
  } else if (layout === "top-banner") {
    content = (
      <div>
        {header && <StaticHeader template={template} variant="banner" />}
        <div className="grid grid-cols-[1fr_230px] gap-7 mt-1">
          <div className={template.spacing}>{mainBlocks.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div>
          <aside className={template.spacing}>{sideBlocks.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</aside>
        </div>
      </div>
    );
  } else if (layout === "sidebar-left") {
    content = (
      <div className="grid grid-cols-[220px_1fr] min-h-[1100px]">
        <aside className={`${template.spacing} p-6`} style={{ backgroundColor: template.colors.accent ?? "#f1f5f9" }}>
          {header && <StaticHeader template={template} variant="sidebar" />}
          <div className={template.spacing}>{sideBlocks.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div>
        </aside>
        <div className={`${template.spacing} p-8`}>{mainBlocks.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div>
      </div>
    );
  } else {
    content = <div className={template.spacing}>{header && <StaticHeader template={template} variant="default" />}{allNonHeader.map((b) => <StaticBlock key={b.id} block={b} template={template} />)}</div>;
  }

  return (
    <div className="h-full w-full flex justify-center items-center bg-black">
      <div
        className="pointer-events-none"
        style={{ transform: "scale(0.33)" }}
      >
        <article className="w-[850px] min-h-[1100px] rounded-md border overflow-hidden" style={{ backgroundColor: template.colors.background }}>
          <div className={layout === "sidebar-left" ? "" : "p-12"}>{content}</div>
        </article>
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
      <p className="text-muted-foreground mt-1">Detailed, content-rich templates with realistic preview data.</p>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {TEMPLATES.map((template, i) => (
          <motion.button
            key={template.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={async () => {
              const resume = await createResume(`New ${template.name} resume`, template.id);
              router.push(`/builder/${resume.id}`);
            }}
            className="rounded-2xl border bg-card overflow-hidden text-left"
          >
            <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 h-[300px] sm:h-[340px]" style={{ position: "relative", overflow: "hidden" }}>
              <TemplateCardPreview template={template} />
            </div>
            <div className="p-4 border-t space-y-2">
              <div>
                <p className="font-medium text-sm">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {template.highlights.map((item) => (
                  <span key={item} className="rounded-full border px-2 py-0.5 text-[10px] text-muted-foreground">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
