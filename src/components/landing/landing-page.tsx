"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, FileText, Gauge, WandSparkles, Globe2, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const features = [
  { icon: FileText, title: "Block-Based Builder", body: "Compose resumes with drag-and-drop sections and instant preview." },
  { icon: Gauge, title: "AI Resume Score", body: "Get ATS, readability, and impact scoring with specific fixes." },
  { icon: WandSparkles, title: "Job Match", body: "Generate role-specific resume versions in seconds." },
  { icon: Globe2, title: "Public Resume Site", body: "Publish as a personal website with analytics built in." },
  { icon: Download, title: "Free PDF Export", body: "No paywall. Export polished PDFs forever." },
  { icon: Sparkles, title: "Premium Templates", body: "Switch layouts instantly with reusable JSON-driven themes." }
];

export function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <p className="font-semibold tracking-tight">ResumeAI</p>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="gradient" size="sm">
            <Link href="/dashboard">Get Started</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-10 pb-20 relative overflow-hidden">
        <div aria-hidden className="hero-grid pointer-events-none absolute inset-0 opacity-60" />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: -80, y: -40, scale: 0.9 }}
          animate={{ opacity: 0.5, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 90, y: 30, scale: 0.85 }}
          animate={{ opacity: 0.35, x: 0, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.08, ease: "easeOut" }}
          className="pointer-events-none absolute top-4 right-[-70px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 1, delay: 0.12, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-emerald-400/15 blur-3xl hero-drift"
        />

        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -28, y: 18 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles size={12} /> Download free forever
            </p>
            <h1 className="mt-4 text-5xl md:text-6xl font-semibold tracking-tight leading-tight">
              Build resumes that get{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent premium-shimmer">
                interviews.
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              A premium AI resume builder with drag-and-drop editing, ATS score, job targeting, and public website publishing.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {["ATS-ready formats", "Instant PDF export", "Public resume site"].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5 rounded-full border bg-card/70 px-2.5 py-1">
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3">
              <Button asChild variant="gradient" size="lg">
                <Link href="/dashboard">Start Building <ArrowRight size={16} /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/dashboard/templates">View Templates</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.06, ease: "easeOut" }}
            className="relative rounded-3xl border glass p-5 shadow-soft"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 rounded-xl border bg-card/85 px-3 py-2 shadow-lg backdrop-blur-md">
              <p className="text-[10px] text-muted-foreground">ATS Score</p>
              <p className="text-sm font-semibold">92 / 100</p>
            </div>
            <div className="pointer-events-none absolute -left-4 bottom-8 rounded-xl border bg-card/85 px-3 py-2 shadow-lg backdrop-blur-md">
              <p className="text-[10px] text-muted-foreground">Interview Rate</p>
              <p className="text-sm font-semibold">+38%</p>
            </div>

            <div className="rounded-2xl bg-card border p-6 space-y-4 animate-float">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-4 w-36 rounded-full bg-foreground/10" />
                  <div className="h-2.5 w-24 rounded-full bg-foreground/10" />
                </div>
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500/80" />
              </div>
              <div className="h-px bg-border" />
              {[92, 80, 88, 73, 84, 66].map((w, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-1.5 w-16 rounded-full bg-foreground/10" />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${w}%` }}
                    transition={{ delay: i * 0.08 + 0.2, duration: 0.45 }}
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500/70 to-cyan-500/70"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group rounded-2xl border bg-card/70 p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="inline-flex rounded-lg border bg-primary/5 p-2">
                <f.icon size={16} className="text-primary" />
              </div>
              <h3 className="mt-3 font-medium">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </main>
  );
}
