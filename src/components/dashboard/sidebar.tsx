"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutTemplate, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/brand-logo";

const items = [
  { href: "/dashboard", icon: Home, label: "Resumes" },
  { href: "/dashboard/templates", icon: LayoutTemplate, label: "Templates" }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="xl:hidden border-b bg-card/80 px-3 py-2">
        <div className="mb-2 h-10 rounded-xl gradient-cta text-white flex items-center px-3 font-semibold">
          <BrandLogo light />
        </div>
        <nav className="grid grid-cols-2 gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition",
                pathname === item.href ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <item.icon size={14} /> {item.label}
            </Link>
          ))}
        </nav>
      </div>
      <aside className="hidden xl:block w-64 border-r bg-card/70 backdrop-blur-sm p-4">
        <div className="h-11 rounded-2xl gradient-cta text-white flex items-center px-3 font-semibold">
          <BrandLogo light />
        </div>
        <nav className="mt-5 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                pathname === item.href ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent"
              )}
            >
              <item.icon size={14} /> {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
