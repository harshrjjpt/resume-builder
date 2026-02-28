export type BlockType =
   "header"
    | "experience"
    | "education"
    | "projects"
    | "skills"
    | "metrics"
    | "github"
    | "custom"
    | "languages"
    | "achievements"
    | "contact";

export interface ResumeBlock {
  id: string;
  type: BlockType;
  content: Record<string, unknown>;
  order: number;
}

export interface ResumeBlock {
  id: string;
  type:
    | "header"
    | "experience"
    | "education"
    | "projects"
    | "skills"
    | "metrics"
    | "github"
    | "custom"
    | "languages"
    | "achievements"
    | "contact";
  content: Record<string, unknown>;
  order: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  highlights: string[];
  typography: {
    heading: string;
    body: string;
    headingFont?: string;
    bodyFont?: string;
  };
  spacing: string;
  /**
   * Layout variants:
   * "meredith"   – monogram box + giant surname, thin sidebar left, main right
   * "charlie"    – dark card, photo card left, experience list right
   * "fia"        – creative editorial, big greeting, circle-accent, date-dot timeline
   * "hamptone"   – role label + huge name + circle photo top-right, two col below
   * "ethan"      – dense two-col, colored accents, section bars, language progress
   * "sidebar-left"  – solid colored left panel, white main right
   * "top-banner"    – full-bleed header, single col or two col body
   * "centered-header" – centered name/role, content below
   * "single-column"  – classic ATS single col
   */
  layout:
    | "meredith"
    | "charlie"
    | "fia"
    | "hamptone"
    | "ethan"
    | "sidebar-left"
    | "top-banner"
    | "centered-header"
    | "single-column";
  colors: {
    primary: string;
    muted: string;
    background: string;
    accent?: string;
    headerBg?: string;
    headerText?: string;
    sidebarBg?: string;
    sidebarText?: string;
    highlight?: string; // company name color in ethan style
  };
  sectionStyle?: "caps-rule" | "underline" | "pill" | "dot" | "bracket" | "bar";
}

export interface ResumeScore {
  ats: number;
  readability: number;
  impact: number;
  suggestions: string[];
}
