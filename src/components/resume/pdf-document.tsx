"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import type { ResumeBlock } from "@/types";
import { TEMPLATES } from "@/lib/templates";
import type { ResumeTemplate } from "@/types";

// ─── Font mapping ─────────────────────────────────────────────────────────────
// @react-pdf/renderer has these built-in fonts (zero network requests needed):
//   Sans-serif : Helvetica, Helvetica-Bold, Helvetica-Oblique, Helvetica-BoldOblique
//   Serif      : Times-Roman, Times-Bold, Times-Italic, Times-BoldItalic
//   Mono       : Courier, Courier-Bold, Courier-Oblique, Courier-BoldOblique
//
// We map each Google Font name to the closest built-in, eliminating ALL CDN
// fetches and font-format errors entirely.

function resolvedFont(t: ResumeTemplate, which: "heading" | "body"): string {
  const css = (which === "heading" ? t.typography.headingFont : t.typography.bodyFont) ?? "";
  const lower = css.toLowerCase();
  // Serif / editorial fonts → Times-Roman
  if (
    lower.includes("cormorant") ||
    lower.includes("playfair") ||
    lower.includes("eb garamond") ||
    lower.includes("garamond") ||
    lower.includes("georgia") ||
    lower.includes("merriweather") ||
    lower.includes("lora")
  ) {
    return "Times-Roman";
  }
  // Everything else (Inter, DM Sans, Plus Jakarta, IBM Plex, Syne, Lato …) → Helvetica
  return "Helvetica";
}

// No-op kept so call sites don't need to change
function registerFontsForTemplate(_t: ResumeTemplate) { }

function buildStyles(t: ResumeTemplate, hf: string, bf: string) {
  const primary = t.colors.primary ?? "#111111";
  const muted = t.colors.muted ?? "#6b7280";
  const accent = t.colors.accent ?? primary;
  const bg = t.colors.background ?? "#ffffff";
  const sidebarBg = t.colors.sidebarBg ?? accent;
  const sidebarText = t.colors.sidebarText ?? "#ffffff";

  return {
    primary, muted, accent, bg, sidebarBg, sidebarText,
    ss: StyleSheet.create({
      page: { backgroundColor: bg, fontSize: 10, fontFamily: bf },
      padded: { padding: 36 },
      sidebarCol: { width: 190, backgroundColor: sidebarBg, minHeight: 841, padding: 24 },
      mainCol: { flex: 1, padding: 32 },
      row: { flexDirection: "row" },
      mb4: { marginBottom: 4 },
      mb8: { marginBottom: 8 },
      mb12: { marginBottom: 12 },
      rule: { borderBottomWidth: 0.4, marginTop: 2, marginBottom: 5 },
    }),
  };
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SH({
  label, color, accent, hf, style: ss,
}: { label: string; color: string; accent: string; hf: string; style?: string }) {
  if (ss === "pill") {
    return (
      <View style={{ marginBottom: 5 }}>
        <View style={{ backgroundColor: accent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 99, alignSelf: "flex-start" }}>
          <Text style={{ fontSize: 7, fontWeight: 700, color: "#fff", fontFamily: hf, letterSpacing: 1 }}>{label.toUpperCase()}</Text>
        </View>
      </View>
    );
  }
  if (ss === "dot") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <View style={{ width: 5, height: 5, borderRadius: 99, backgroundColor: accent, marginRight: 5 }} />
        <Text style={{ fontSize: 8, fontWeight: 700, color, fontFamily: hf, letterSpacing: 1.2 }}>{label.toUpperCase()}</Text>
      </View>
    );
  }
  if (ss === "bar") {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
        <View style={{ width: 8, height: 10, backgroundColor: accent, marginRight: 5 }} />
        <Text style={{ fontSize: 8, fontWeight: 700, color, fontFamily: hf, letterSpacing: 1.2 }}>{label.toUpperCase()}</Text>
        <View style={{ flex: 1, borderBottomWidth: 0.3, borderBottomColor: color, opacity: 0.2, marginLeft: 5 }} />
      </View>
    );
  }
  if (ss === "underline") {
    return (
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: accent, paddingBottom: 2, marginBottom: 5 }}>
        <Text style={{ fontSize: 8, fontWeight: 700, color, fontFamily: hf, letterSpacing: 1.4 }}>{label.toUpperCase()}</Text>
      </View>
    );
  }
  // Default: caps-rule
  return (
    <View style={{ marginBottom: 5 }}>
      <Text style={{ fontSize: 8, fontWeight: 700, color, fontFamily: hf, letterSpacing: 1.5 }}>{label.toUpperCase()}</Text>
      <View style={{ borderBottomWidth: 0.4, borderBottomColor: color, opacity: 0.2, marginTop: 2 }} />
    </View>
  );
}

// ─── Block renderers ──────────────────────────────────────────────────────────

type RCtx = {
  primary: string; muted: string; accent: string;
  hf: string; bf: string; sectionStyle?: string;
  sidebarText?: string; light?: boolean;
};

function renderBlock(block: ResumeBlock, ctx: RCtx) {
  const { primary, muted, accent, hf, bf, sectionStyle, light } = ctx;
  const col = light ? (ctx.sidebarText ?? muted) : primary;
  const mcol = light ? `${ctx.sidebarText ?? muted}bb` : muted;
  const c = block.content;

  if (block.type === "header") return null;

  if (block.type === "experience") {
    const bullets = Array.isArray(c.bullets) ? (c.bullets as string[]) : [];
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label="Experience" color={col} accent={accent} hf={hf} style={sectionStyle} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={{ fontWeight: 700, fontSize: 10, color: col, fontFamily: bf }}>{String(c.title ?? "Role")}</Text>
          <Text style={{ fontSize: 8.5, color: mcol, fontFamily: bf }}>{String(c.dates ?? "")}</Text>
        </View>
        <Text style={{ fontSize: 9, color: mcol, fontFamily: bf, marginBottom: 2 }}>{String(c.company ?? "")}</Text>
        {bullets.map((b, i) => (
          <View key={i} style={{ flexDirection: "row", marginTop: 1.5 }}>
            <Text style={{ width: 10, color: mcol, fontSize: 9, fontFamily: bf }}>•</Text>
            <Text style={{ flex: 1, color: mcol, fontSize: 9, fontFamily: bf, lineHeight: 1.4 }}>{b}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (block.type === "education") {
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label="Education" color={col} accent={accent} hf={hf} style={sectionStyle} />
        <Text style={{ fontWeight: 700, fontSize: 10, color: col, fontFamily: bf }}>{String(c.school ?? "")}</Text>
        <Text style={{ fontSize: 9, color: mcol, fontFamily: bf }}>{String(c.degree ?? "")}</Text>
        <Text style={{ fontSize: 8.5, color: mcol, fontFamily: bf }}>{String(c.dates ?? "")}</Text>
      </View>
    );
  }

  if (block.type === "skills") {
    const items = Array.isArray(c.items) ? (c.items as string[]) : [];
    // Render as tags if sectionStyle is "pill" or "dot" (creative templates), else dot-separated
    const useTagStyle = sectionStyle === "pill" || sectionStyle === "dot";
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label="Skills" color={col} accent={accent} hf={hf} style={sectionStyle} />
        {useTagStyle ? (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
            {items.map((item, i) => (
              <View key={i} style={{ borderWidth: 0.7, borderColor: accent, borderRadius: 3, paddingHorizontal: 5, paddingVertical: 2 }}>
                <Text style={{ fontSize: 8, color: accent, fontFamily: bf }}>{item}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontSize: 9, color: mcol, fontFamily: bf, lineHeight: 1.5 }}>{items.join("  ·  ")}</Text>
        )}
      </View>
    );
  }

  if (block.type === "projects") {
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label="Projects" color={col} accent={accent} hf={hf} style={sectionStyle} />
        <Text style={{ fontWeight: 700, fontSize: 10, color: col, fontFamily: bf }}>{String(c.title ?? "")}</Text>
        <Text style={{ fontSize: 9, color: mcol, fontFamily: bf, lineHeight: 1.4 }}>{String(c.description ?? "")}</Text>
        {c.link ? <Text style={{ fontSize: 8.5, color: accent, fontFamily: bf }}>{String(c.link)}</Text> : null}
      </View>
    );
  }

  if (block.type === "metrics") {
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label="Key Metrics" color={col} accent={accent} hf={hf} style={sectionStyle} />
        <Text style={{ fontWeight: 700, fontSize: 14, color: col, fontFamily: bf }}>{String(c.headline ?? "")}</Text>
        <Text style={{ fontSize: 9, color: mcol, fontFamily: bf, lineHeight: 1.4 }}>{String(c.context ?? "")}</Text>
      </View>
    );
  }

  if (block.type === "custom") {
    const label = String(c.title ?? "Custom Section");
    const raw = String(c.body ?? "");
    const plain = raw
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return (
      <View key={block.id} style={{ marginBottom: 11 }}>
        <SH label={label} color={col} accent={accent} hf={hf} style={sectionStyle} />
        <Text style={{ fontSize: 9, color: mcol, fontFamily: bf, lineHeight: 1.45 }}>{plain}</Text>
      </View>
    );
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ResumePdfDocument({
  title, blocks, templateId,
}: {
  title: string; blocks: ResumeBlock[]; templateId: string;
}) {
  const t = TEMPLATES.find((t) => t.id === templateId) ?? TEMPLATES[0];

  // Register fonts (idempotent)
  registerFontsForTemplate(t);
  const hf = resolvedFont(t, "heading");
  const bf = resolvedFont(t, "body");

  const { primary, muted, accent, bg, sidebarBg, sidebarText, ss } = buildStyles(t, hf, bf);
  const sectionStyle = t.sectionStyle;

  const sorted = [...blocks].sort((a, b) => a.order - b.order);
  const hdr = sorted.find((b) => b.type === "header");
  const hc = hdr?.content ?? {};

  const ctx: RCtx = { primary, muted, accent, hf, bf, sectionStyle };

  // ── Sidebar layouts ────────────────────────────────────────────────────────
  const isSidebar = ["sidebar-left", "meredith", "charlie", "cardinal", "glacier"].includes(t.layout);
  if (isSidebar) {
    const sideTypes = new Set(["skills", "education", "languages", "projects"]);
    const sideBlocks = sorted.filter((b) => sideTypes.has(b.type));
    const mainBlocks = sorted.filter((b) => !sideTypes.has(b.type) && b.type !== "header");

    return (
      <Document title={title}>
        <Page size="A4" style={[ss.page, ss.row]}>
          {/* Sidebar */}
          <View style={ss.sidebarCol}>
            <Text style={{ fontSize: 18, fontWeight: 700, color: sidebarText, fontFamily: hf, lineHeight: 1.2, marginBottom: 3 }}>
              {String(hc.name ?? "Your Name")}
            </Text>
            <Text style={{ fontSize: 9, color: `${sidebarText}cc`, fontFamily: bf, marginBottom: 11 }}>
              {String(hc.role ?? "")}
            </Text>
            <View style={{ borderBottomWidth: 0.4, borderBottomColor: sidebarText, opacity: 0.3, marginBottom: 9 }} />
            {hc.email && <Text style={{ fontSize: 8.5, color: `${sidebarText}cc`, fontFamily: bf, marginBottom: 2 }}>{String(hc.email)}</Text>}
            {hc.phone && <Text style={{ fontSize: 8.5, color: `${sidebarText}cc`, fontFamily: bf, marginBottom: 2 }}>{String(hc.phone)}</Text>}
            {hc.location && <Text style={{ fontSize: 8.5, color: `${sidebarText}cc`, fontFamily: bf, marginBottom: 11 }}>{String(hc.location)}</Text>}
            <View style={{ borderBottomWidth: 0.4, borderBottomColor: sidebarText, opacity: 0.3, marginBottom: 9 }} />
            {sideBlocks.map((b) =>
              renderBlock(b, { ...ctx, primary: sidebarText, muted: `${sidebarText}99`, sidebarText, light: true })
            )}
          </View>
          {/* Main */}
          <View style={ss.mainCol}>
            {hc.summary && (
              <View style={{ marginBottom: 13 }}>
                <SH label="Profile" color={primary} accent={accent} hf={hf} style={sectionStyle} />
                <Text style={{ fontSize: 9, color: muted, fontFamily: bf, lineHeight: 1.5 }}>{String(hc.summary)}</Text>
              </View>
            )}
            {mainBlocks.map((b) => renderBlock(b, ctx))}
          </View>
        </Page>
      </Document>
    );
  }

  // ── Top banner ─────────────────────────────────────────────────────────────
  if (t.layout === "top-banner") {
    const headerBg = t.colors.headerBg ?? primary;
    const headerText = t.colors.headerText ?? "#ffffff";
    const sideTypes = new Set(["skills", "languages", "metrics", "achievements"]);
    const sideBlocks = sorted.filter((b) => sideTypes.has(b.type));
    const mainBlocks = sorted.filter((b) => !sideTypes.has(b.type) && b.type !== "header");
    return (
      <Document title={title}>
        <Page size="A4" style={ss.page}>
          <View style={{ backgroundColor: headerBg, paddingHorizontal: 36, paddingVertical: 22 }}>
            <Text style={{ fontSize: 24, fontWeight: 700, color: headerText, fontFamily: hf }}>{String(hc.name ?? "")}</Text>
            <Text style={{ fontSize: 11, color: headerText, opacity: 0.85, fontFamily: bf, marginTop: 2 }}>{String(hc.role ?? "")}</Text>
            <Text style={{ fontSize: 8.5, color: headerText, opacity: 0.6, fontFamily: bf, marginTop: 5, lineHeight: 1.5 }}>{String(hc.summary ?? "")}</Text>
          </View>
          <View style={{ flexDirection: "row", padding: 32, gap: 20 }}>
            <View style={{ flex: 1 }}>{mainBlocks.map((b) => renderBlock(b, ctx))}</View>
            <View style={{ width: 175 }}>{sideBlocks.map((b) => renderBlock(b, ctx))}</View>
          </View>
        </Page>
      </Document>
    );
  }

  // ── Centered header ────────────────────────────────────────────────────────
  if (t.layout === "centered-header") {
    const nonHeader = sorted.filter((b) => b.type !== "header");
    return (
      <Document title={title}>
        <Page size="A4" style={[ss.page, ss.padded]}>
          <View style={{ alignItems: "center", borderBottomWidth: 0.5, borderBottomColor: accent, paddingBottom: 14, marginBottom: 14 }}>
            <Text style={{ fontSize: 26, fontWeight: 700, color: primary, fontFamily: hf }}>{String(hc.name ?? "")}</Text>
            <Text style={{ fontSize: 10, color: accent, fontFamily: bf, marginTop: 2 }}>{String(hc.role ?? "")}</Text>
            <Text style={{ fontSize: 9, color: muted, fontFamily: bf, marginTop: 5, textAlign: "center", lineHeight: 1.5 }}>{String(hc.summary ?? "")}</Text>
          </View>
          {nonHeader.map((b) => renderBlock(b, ctx))}
        </Page>
      </Document>
    );
  }

  // ── FIA — Editorial: greeting header, timeline experience, 2-col grid bottom
  if (t.layout === "fia") {
    const name = String(hc.name ?? "");
    const firstName = name.split(" ")[0];
    const expBlocks = sorted.filter((b) => b.type === "experience");
    const otherBlocks = sorted.filter((b) => !["header", "experience"].includes(b.type));
    const leftOther = otherBlocks.filter((_, i) => i % 2 === 0);
    const rightOther = otherBlocks.filter((_, i) => i % 2 === 1);

    return (
      <Document title={title}>
        <Page size="A4" style={[ss.page, ss.padded]}>
          {/* Hero greeting row */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18, marginBottom: 18 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: accent, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 22, color: "#fff" }}>●</Text>
            </View>
            <View>
              <Text style={{ fontSize: 22, fontWeight: 900, color: primary, fontFamily: hf, lineHeight: 1.15 }}>
                {`Hi,\nI'm ${firstName} &\nI ${String(hc.tagline ?? "design.")}`}
              </Text>
            </View>
          </View>
          {/* Contact strip */}
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 14, paddingBottom: 8, borderBottomWidth: 0.4, borderBottomColor: `${primary}20` }}>
            {hc.website && <Text style={{ fontSize: 8, color: muted, fontFamily: bf }}>{String(hc.website)}</Text>}
            {hc.email && <Text style={{ fontSize: 8, color: muted, fontFamily: bf }}>{String(hc.email)}</Text>}
            {hc.location && <Text style={{ fontSize: 8, color: muted, fontFamily: bf }}>{String(hc.location)}</Text>}
          </View>
          {/* About me row */}
          {hc.summary && (
            <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: primary, fontFamily: hf, letterSpacing: 1.4, width: 65, textTransform: "uppercase", paddingTop: 2 }}>About Me</Text>
              <Text style={{ flex: 1, fontSize: 9, color: muted, fontFamily: bf, lineHeight: 1.5 }}>{String(hc.summary)}</Text>
            </View>
          )}
          {/* Experience — timeline */}
          {expBlocks.length > 0 && (
            <View style={{ flexDirection: "row", gap: 14, marginBottom: 14 }}>
              <Text style={{ fontSize: 7, fontWeight: 700, color: primary, fontFamily: hf, letterSpacing: 1.4, width: 65, textTransform: "uppercase", paddingTop: 2 }}>Experience</Text>
              <View style={{ flex: 1 }}>
                {expBlocks.map((b) => {
                  const bullets = Array.isArray(b.content.bullets) ? (b.content.bullets as string[]) : [];
                  return (
                    <View key={b.id} style={{ marginBottom: 10, paddingLeft: 10, borderLeftWidth: 1.5, borderLeftColor: accent }}>
                      <View style={{ flexDirection: "row", gap: 8, marginBottom: 2 }}>
                        <Text style={{ fontSize: 8, color: muted, fontFamily: bf }}>{String(b.content.dates ?? "")}</Text>
                        <Text style={{ fontSize: 8, color: muted, fontFamily: bf }}>{String(b.content.company ?? "")}</Text>
                      </View>
                      <Text style={{ fontSize: 9.5, fontWeight: 700, color: primary, fontFamily: bf, marginBottom: 2 }}>{String(b.content.title ?? "")}</Text>
                      {bullets.map((bul, i) => (
                        <View key={i} style={{ flexDirection: "row", gap: 4, marginTop: 1.5 }}>
                          <Text style={{ fontSize: 8, color: accent, fontFamily: bf }}>•</Text>
                          <Text style={{ flex: 1, fontSize: 8.5, color: muted, fontFamily: bf, lineHeight: 1.4 }}>{bul}</Text>
                        </View>
                      ))}
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          {/* Other blocks — 2-column grid */}
          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>{leftOther.map((b) => renderBlock(b, ctx))}</View>
            <View style={{ flex: 1 }}>{rightOther.map((b) => renderBlock(b, ctx))}</View>
          </View>
        </Page>
      </Document>
    );
  }

  // ── HAMPTONE — Huge name + role label, left contact sidebar, right main content
  if (t.layout === "hamptone") {
    const sideBlocks = sorted.filter((b) => ["skills", "education", "languages"].includes(b.type));
    const mainBlocks = sorted.filter((b) => !["header", "skills", "education", "languages", "contact"].includes(b.type));

    return (
      <Document title={title}>
        <Page size="A4" style={[ss.page, ss.padded]}>
          {/* Big header */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 7.5, color: muted, fontFamily: bf, letterSpacing: 1.8, textTransform: "uppercase", marginBottom: 4 }}>{String(hc.role ?? "")}</Text>
              <Text style={{ fontSize: 32, fontWeight: 700, color: primary, fontFamily: hf, lineHeight: 1.05 }}>{String(hc.name ?? "")}</Text>
            </View>
            {hc.photo ? (
              <Image
                src={String(hc.photo)}
                style={{ width: 52, height: 52, borderRadius: 26, marginLeft: 14, objectFit: "cover" as const }}
              />
            ) : null}
          </View>
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: `${primary}25`, marginBottom: 12 }} />
          {/* Two columns */}
          <View style={{ flexDirection: "row", gap: 0 }}>
            {/* Left sidebar */}
            <View style={{ width: 145, paddingRight: 14, borderRightWidth: 0.4, borderRightColor: `${primary}18` }}>
              {/* Contact */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7, fontWeight: 700, color: primary, fontFamily: hf, letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 5 }}>Contact</Text>
                {hc.location && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf, marginBottom: 3 }}>⌂ {String(hc.location)}</Text>}
                {hc.email && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf, marginBottom: 3 }}>✉ {String(hc.email)}</Text>}
                {hc.phone && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf, marginBottom: 3 }}>✆ {String(hc.phone)}</Text>}
                {hc.linkedin && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf, marginBottom: 3 }}>⊞ {String(hc.linkedin)}</Text>}
              </View>
              {sideBlocks.map((b) => renderBlock(b, ctx))}
            </View>
            {/* Right main */}
            <View style={{ flex: 1, paddingLeft: 18 }}>
              {hc.summary && (
                <View style={{ marginBottom: 12 }}>
                  <SH label="Summary" color={primary} accent={accent} hf={hf} style={sectionStyle} />
                  <Text style={{ fontSize: 9, color: muted, fontFamily: bf, lineHeight: 1.5 }}>{String(hc.summary)}</Text>
                </View>
              )}
              {mainBlocks.map((b) => renderBlock(b, ctx))}
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  // ── ETHAN — two-column body, plain page header ──────────────────────────
  if (t.layout === "ethan") {
    const leftTypes = new Set(["experience", "projects", "metrics", "custom"]);
    const rightTypes = new Set(["skills", "education", "languages", "achievements", "github"]);
    const leftBlocks = sorted.filter((b) => leftTypes.has(b.type));
    const rightBlocks = sorted.filter((b) => rightTypes.has(b.type));

    return (
      <Document title={title}>
        <Page size="A4" style={[ss.page, ss.padded]}>
          <View style={{ marginBottom: 14 }}>
            <Text style={{ fontSize: 26, fontWeight: 700, color: primary, fontFamily: hf, lineHeight: 1.1 }}>{String(hc.name ?? "")}</Text>
            <Text style={{ fontSize: 11, color: accent, fontFamily: bf, marginTop: 2 }}>{String(hc.role ?? "")}</Text>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 3 }}>
              {hc.email && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf }}>{String(hc.email)}</Text>}
              {hc.location && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf }}>{String(hc.location)}</Text>}
            </View>
            {hc.summary && <Text style={{ fontSize: 9, color: muted, fontFamily: bf, marginTop: 5, lineHeight: 1.5 }}>{String(hc.summary)}</Text>}
          </View>
          <View style={{ borderBottomWidth: 0.5, borderBottomColor: primary, opacity: 0.15, marginBottom: 14 }} />
          <View style={{ flexDirection: "row", gap: 24 }}>
            <View style={{ flex: 1 }}>{leftBlocks.map((b) => renderBlock(b, ctx))}</View>
            <View style={{ width: 185 }}>{rightBlocks.map((b) => renderBlock(b, ctx))}</View>
          </View>
        </Page>
      </Document>
    );
  }

  // ── Default / single column ───────────────────────────────────────────────
  const nonHeader = sorted.filter((b) => b.type !== "header");
  return (
    <Document title={title}>
      <Page size="A4" style={[ss.page, ss.padded]}>
        <View style={{ marginBottom: 14 }}>
          <Text style={{ fontSize: 28, fontWeight: 700, color: primary, fontFamily: hf, lineHeight: 1.1 }}>{String(hc.name ?? "")}</Text>
          <Text style={{ fontSize: 11, color: accent, fontFamily: bf, marginTop: 2 }}>{String(hc.role ?? "")}</Text>
          <View style={{ flexDirection: "row", gap: 14, marginTop: 3 }}>
            {hc.email && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf }}>{String(hc.email)}</Text>}
            {hc.location && <Text style={{ fontSize: 8.5, color: muted, fontFamily: bf }}>{String(hc.location)}</Text>}
          </View>
          {hc.summary && <Text style={{ fontSize: 9, color: muted, fontFamily: bf, marginTop: 5, lineHeight: 1.5 }}>{String(hc.summary)}</Text>}
        </View>
        <View style={{ borderBottomWidth: 0.5, borderBottomColor: primary, opacity: 0.15, marginBottom: 14 }} />
        {nonHeader.map((b) => renderBlock(b, ctx))}
      </Page>
    </Document>
  );
}
