"use client";

import { motion } from "framer-motion";
import { Eye, FileText, Globe, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  resumes: Array<{ id: string; title: string; viewCount: number; isPublished: boolean; createdAt: Date }>;
  totalViews: number;
}

export function AnalyticsDashboard({ resumes, totalViews }: Props) {
  const published = resumes.filter((r) => r.isPublished).length;
  const avg = resumes.length ? Math.round(totalViews / resumes.length) : 0;
  const metrics = [
    { icon: Eye, label: "Total Views", value: totalViews },
    { icon: FileText, label: "Resumes", value: resumes.length },
    { icon: Globe, label: "Published", value: published },
    { icon: TrendingUp, label: "Avg/Resume", value: avg }
  ];

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            <Card>
              <CardContent className="p-5">
                <m.icon size={16} className="text-muted-foreground" />
                <p className="text-2xl font-semibold mt-2">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Resumes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resumes.map((resume) => (
            <div key={resume.id} className="flex items-center justify-between text-sm">
              <p className="font-medium truncate">{resume.title}</p>
              <p className="text-muted-foreground">{resume.viewCount} views</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
