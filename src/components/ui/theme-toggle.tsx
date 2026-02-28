"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <Button variant="ghost" size="icon-sm" onClick={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </Button>
  );
}
