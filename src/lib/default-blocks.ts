import type { ResumeBlock } from "@/types";

export function getDefaultBlocks(): ResumeBlock[] {
  return [
    {
      id: crypto.randomUUID(),
      type: "header",
      order: 0,
      content: {
        name: "Jordan Lee",
        role: "Senior Product Engineer",
        email: "jordan.lee@email.com",
        location: "San Francisco, CA",
        summary:
          "Impact-focused engineer delivering conversion wins, strong architecture, and measurable product outcomes across web platforms."
      }
    },
    {
      id: crypto.randomUUID(),
      type: "experience",
      order: 1,
      content: {
        title: "Staff Engineer",
        company: "Acme Inc.",
        dates: "2021 - Present",
        bullets: [
          "Led platform redesign that improved paid conversion by 23% within two quarters.",
          "Built AI-assisted authoring workflow that reduced resume editing time by 40%.",
          "Mentored 6 engineers and introduced standards that lowered production incidents by 32%."
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      type: "education",
      order: 2,
      content: {
        school: "University of California, Berkeley",
        degree: "B.S. in Electrical Engineering & Computer Science",
        dates: "2013 - 2017"
      }
    },
    {
      id: crypto.randomUUID(),
      type: "projects",
      order: 3,
      content: {
        title: "ResumeAI",
        description:
          "AI-first resume builder with ATS scoring, tailored bullet generation, and shareable public resume links.",
        link: "https://example.com"
      }
    },
    {
      id: crypto.randomUUID(),
      type: "skills",
      order: 4,
      content: {
        items: [
          "Next.js",
          "React",
          "TypeScript",
          "Node.js",
          "Prisma",
          "PostgreSQL",
          "System Design",
          "Product Analytics"
        ]
      }
    },
    {
      id: crypto.randomUUID(),
      type: "metrics",
      order: 5,
      content: {
        headline: "+38% Interview Rate",
        context: "Improved resume targeting and keyword coverage across 220+ job submissions."
      }
    },
    {
      id: crypto.randomUUID(),
      type: "github",
      order: 6,
      content: {
        repo: "resume-builder",
        language: "TypeScript",
        stars: 284
      }
    }
  ];
}
