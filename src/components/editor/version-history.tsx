"use client";

import { useEffect, useState } from "react";
import { getResumeVersions } from "@/app/actions/resume";

interface VersionItem {
  id: string;
  title: string;
  createdAt: Date;
}

export function VersionHistory({ resumeId }: { resumeId: string }) {
  const [versions, setVersions] = useState<VersionItem[]>([]);

  useEffect(() => {
    getResumeVersions(resumeId).then((v) => setVersions(v as VersionItem[]));
  }, [resumeId]);

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">Version History</p>
      <div className="space-y-2">
        {versions.length === 0 && <p className="text-xs text-muted-foreground">No versions yet.</p>}
        {versions.map((version) => (
          <div key={version.id} className="rounded-xl border p-2">
            <p className="text-sm">{version.title}</p>
            <p className="text-xs text-muted-foreground">{new Date(version.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
