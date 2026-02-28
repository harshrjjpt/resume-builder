import type { ResumeTemplate } from "@/types";

type HeaderLike = Record<string, unknown> | undefined;

function colorValue(v: unknown): string | undefined {
  return typeof v === "string" && /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(v) ? v : undefined;
}

export function applyThemeOverrides(template: ResumeTemplate, header: HeaderLike): ResumeTemplate {
  const bg = colorValue(header?.themeBg);
  const text = colorValue(header?.themeText);
  const heading = colorValue(header?.themeHeading);
  const accent = colorValue(header?.themeAccent);

  if (!bg && !text && !heading && !accent) return template;

  return {
    ...template,
    colors: {
      ...template.colors,
      background: bg ?? template.colors.background,
      muted: text ?? template.colors.muted,
      primary: heading ?? template.colors.primary,
      accent: accent ?? template.colors.accent,
      highlight: accent ?? template.colors.highlight
    }
  };
}
