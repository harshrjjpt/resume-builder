"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Briefcase, ChevronDown, Download, FolderOpen, Github, GraduationCap, Grid2x2, LayoutTemplate, PenSquare, Plus, RotateCcw, RotateCw, Share2, Sparkles, Target, User, Wrench, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { saveResume, publishResume, createVersion } from "@/app/actions/resume";
import { useResumeStore } from "@/store/resume-store";
import type { BlockType, ResumeBlock as ResumeBlockType } from "@/types";
import { ResumeBlock } from "@/components/editor/resume-block";
import { LivePreview } from "@/components/resume/live-preview";
import { TemplateSwitcher } from "@/components/resume/template-switcher";
import { ScorePanel } from "@/components/ai/score-panel";
import { JobMatchPanel } from "@/components/ai/job-match";
import { ImportModal } from "@/components/ai/import-modal";
import { AutosaveIndicator } from "@/components/editor/autosave-indicator";
import { Button } from "@/components/ui/button";
import { ShareLinkModal } from "@/components/editor/share-link-modal";
import { VersionHistory } from "@/components/editor/version-history";

const options: { type: BlockType; label: string }[] = [
  { type: "experience", label: "Experience" },
  { type: "education", label: "Education" },
  { type: "projects", label: "Projects" },
  { type: "skills", label: "Skills" },
  { type: "metrics", label: "Metrics" },
  { type: "custom", label: "Rich Text" }
];

type RightPanel = "ai" | "templates" | "github" | "jobmatch" | "history" | null;
type EditorTabId = "personal" | "experience" | "education" | "skills" | "projects" | "custom" | "more";

const EDITOR_TABS: Array<{ id: EditorTabId; label: string; icon: LucideIcon }> = [
  { id: "personal", label: "Personal", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "custom", label: "Custom", icon: PenSquare },
  { id: "more", label: "More", icon: Grid2x2 }
];

const TAB_BLOCK_TYPES: Record<EditorTabId, BlockType[]> = {
  personal: ["header", "contact"],
  experience: ["experience"],
  education: ["education"],
  skills: ["skills", "languages"],
  projects: ["projects", "github"],
  custom: ["custom"],
  more: ["metrics", "achievements"]
};

export function BuilderClient({
  resumeId,
  initialBlocks,
  initialTitle,
  initialTemplateId
}: {
  resumeId: string;
  initialBlocks: ResumeBlockType[];
  initialTitle: string;
  initialTemplateId: string;
}) {
  const {
    loadResume,
    blocks,
    title,
    templateId,
    setTitle,
    addBlock,
    moveBlock,
    undo,
    redo,
    dirty,
    markSaved
  } = useResumeStore();

  const [panel, setPanel] = useState<RightPanel>("ai");
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, startSaving] = useTransition();
  const [publishing, startPublishing] = useTransition();
  const [showShare, setShowShare] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [mobilePane, setMobilePane] = useState<"editor" | "preview" | "tools">("preview");
  const [mobileToolPanel, setMobileToolPanel] = useState<Exclude<RightPanel, null>>("ai");
  const [editorTab, setEditorTab] = useState<EditorTabId>("personal");

  useEffect(() => {
    loadResume(resumeId, initialBlocks, initialTitle, initialTemplateId);
  }, [resumeId, initialBlocks, initialTitle, initialTemplateId, loadResume]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!dirty) return;
      startSaving(async () => {
        await saveResume(resumeId, title, blocks, templateId);
        markSaved();
      });
    }, 2000);

    return () => clearInterval(id);
  }, [resumeId, title, blocks, templateId, dirty, markSaved]);

  useEffect(() => {
    if (panel) setMobileToolPanel(panel);
  }, [panel]);

  const sorted = useMemo(() => [...blocks].sort((a, b) => a.order - b.order), [blocks]);
  const tabTypes = TAB_BLOCK_TYPES[editorTab];
  const visibleEditorBlocks = sorted.filter((block) => tabTypes.includes(block.type));
  const tabOptions = options.filter((opt) => tabTypes.includes(opt.type));
  const hasCreatableTabOptions = tabOptions.length > 0;
  const toolItems = [
    { id: "ai", icon: Sparkles },
    { id: "templates", icon: LayoutTemplate },
    { id: "github", icon: Github },
    { id: "jobmatch", icon: Target },
    { id: "history", icon: RotateCcw }
  ] as const;

  const renderToolsContent = (active: Exclude<RightPanel, null>) => (
    <>
      {active === "ai" && <ScorePanel />}
      {active === "templates" && <TemplateSwitcher />}
      {active === "github" && <ImportModal />}
      {active === "jobmatch" && <JobMatchPanel />}
      {active === "history" && <VersionHistory resumeId={resumeId} />}
    </>
  );

  const editorPane = (
    <>
      <div className="-mx-1 mb-3 overflow-x-auto">
        <div className="flex min-w-max gap-1 border-b px-1">
          {EDITOR_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setEditorTab(tab.id);
                setOpenAdd(false);
              }}
              className={`inline-flex items-center gap-1.5 border-b-2 px-2 py-2 text-xs font-medium transition ${editorTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {visibleEditorBlocks.map((block) => {
          const index = sorted.findIndex((item) => item.id === block.id);
          return <ResumeBlock key={block.id} block={block} index={index} moveBlock={moveBlock} />;
        })}
        {visibleEditorBlocks.length === 0 ? (
          <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            No {editorTab} sections yet. Add one below.
          </div>
        ) : null}
      </div>

      <div className="mt-3 relative">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          disabled={!hasCreatableTabOptions}
          onClick={() => setOpenAdd((v) => !v)}
        >
          <Plus size={13} />
          {hasCreatableTabOptions ? `Add ${EDITOR_TABS.find((t) => t.id === editorTab)?.label}` : "No Sections"}
          <ChevronDown size={12} className="ml-auto" />
        </Button>
        <AnimatePresence>
          {openAdd && hasCreatableTabOptions && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute bottom-10 inset-x-0 rounded-xl border bg-popover p-1 shadow-soft z-20">
              {tabOptions.map((opt) => (
                <button key={opt.type} onClick={() => { addBlock(opt.type); setOpenAdd(false); }} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent">
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-[100dvh] overflow-hidden flex flex-col">
        <header className="border-b bg-card/80 backdrop-blur-sm px-2 py-2 sm:px-4 flex flex-wrap items-center gap-2">
          <Link href="/dashboard"><Button size="icon-sm" variant="ghost"><ArrowLeft size={14} /></Button></Link>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="min-w-0 flex-1 max-w-[240px] sm:max-w-sm bg-transparent text-sm font-medium rounded-lg px-2 py-1 outline-none focus:bg-muted/60" />
          <div className="hidden sm:block"><AutosaveIndicator saving={saving} dirty={dirty} /></div>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={undo} className="hidden sm:inline-flex"><RotateCcw size={14} />Undo</Button>
          <Button variant="ghost" size="sm" onClick={redo} className="hidden sm:inline-flex"><RotateCw size={14} />Redo</Button>
          <Button
            variant="ghost"
            size="icon-sm"
            title="Export PDF"
            onClick={() => {
              const preview = document.getElementById("resume-preview");
              if (!preview) return;

              // Collect all stylesheets from the current page
              const styleSheets = Array.from(document.styleSheets)
                .map((sheet) => {
                  try {
                    return Array.from(sheet.cssRules)
                      .map((rule) => rule.cssText)
                      .join("\n");
                  } catch {
                    // Cross-origin sheet — link it by href instead
                    if (sheet.href) return `@import url("${sheet.href}");`;
                    return "";
                  }
                })
                .join("\n");

              // Build the full HTML for the iframe
              const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      ${styleSheets}
      /* Print overrides */
      @page { size: A4; margin: 0; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      html, body { margin: 0; padding: 0; background: white; }
      article {
        width: 210mm !important;
        min-height: 297mm !important;
        transform: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        overflow: visible !important;
        margin: 0 !important;
      }
    </style>
  </head>
  <body>${preview.outerHTML}</body>
</html>`;

              // Create a hidden iframe, write the HTML into it, then print it
              const iframe = document.createElement("iframe");
              iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:210mm;height:297mm;border:none;";
              document.body.appendChild(iframe);

              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (!iframeDoc) return;
              iframeDoc.open();
              iframeDoc.write(html);
              iframeDoc.close();

              // Wait for fonts/images to load then print
              iframe.onload = () => {
                setTimeout(() => {
                  iframe.contentWindow?.focus();
                  iframe.contentWindow?.print();
                  setTimeout(() => document.body.removeChild(iframe), 1000);
                }, 500);
              };
            }}
          >
            <Download size={14} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => setShowShare(true)}><Share2 size={14} /></Button>
          <Button variant="gradient" size="sm" onClick={() => startPublishing(async () => {
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume";
            const link = await publishResume(resumeId, slug);
            setShareLink(link);
            setShowShare(true);
            await createVersion(resumeId, `Published ${new Date().toLocaleString()}`, { title, blocks, templateId });
          })}>{publishing ? "Publishing..." : "Publish"}</Button>
        </header>

        <div className="xl:hidden border-b bg-card px-2 py-1.5">
          <div className="grid grid-cols-3 gap-1">
            <Button size="sm" variant={mobilePane === "editor" ? "secondary" : "ghost"} onClick={() => setMobilePane("editor")}>Editor</Button>
            <Button size="sm" variant={mobilePane === "preview" ? "secondary" : "ghost"} onClick={() => setMobilePane("preview")}>Preview</Button>
            <Button size="sm" variant={mobilePane === "tools" ? "secondary" : "ghost"} onClick={() => setMobilePane("tools")}>Tools</Button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <aside className="hidden xl:block w-80 border-r p-4 overflow-y-auto">
            {editorPane}
          </aside>

          <aside className={`${mobilePane === "editor" ? "block" : "hidden"} xl:hidden flex-1 overflow-y-auto p-3`}>
            {editorPane}
          </aside>

          <section className={`${mobilePane === "preview" ? "flex" : "hidden"} xl:flex flex-1 bg-muted/30 overflow-auto p-2 sm:p-4 xl:p-8 justify-center`}>
            <div className="origin-top xl:scale-100 max-xl:scale-[0.62] max-sm:scale-[0.42]">
              <LivePreview />
            </div>
          </section>

          <section className={`${mobilePane === "tools" ? "block" : "hidden"} xl:hidden flex-1 overflow-y-auto bg-card`}>
            <div className="p-3 border-b flex items-center gap-1 overflow-x-auto">
              {toolItems.map((item) => (
                <Button key={item.id} variant={mobileToolPanel === item.id ? "secondary" : "ghost"} size="icon-sm" onClick={() => setMobileToolPanel(item.id)}>
                  <item.icon size={14} />
                </Button>
              ))}
            </div>
            <div className="p-4">
              {renderToolsContent(mobileToolPanel)}
            </div>
          </section>

          <AnimatePresence>
            {panel && (
              <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="hidden xl:block border-l bg-card overflow-hidden">
                <div className="w-[300px] h-full flex flex-col">
                  <div className="p-3 border-b flex items-center justify-between">
                    <div className="flex gap-1">
                      {toolItems.map((item) => (
                        <Button key={item.id} variant={panel === item.id ? "secondary" : "ghost"} size="icon-sm" onClick={() => setPanel(item.id as RightPanel)}>
                          <item.icon size={14} />
                        </Button>
                      ))}
                    </div>
                    <Button variant="ghost" size="icon-sm" onClick={() => setPanel(null)}><X size={14} /></Button>
                  </div>
                  <div className="p-4 overflow-y-auto">
                    {renderToolsContent(panel)}
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        <ShareLinkModal open={showShare} onClose={() => setShowShare(false)} link={shareLink} />
      </div>
    </DndProvider>
  );
}
