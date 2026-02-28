import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-2xl border bg-background px-3 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-primary/60",
        className
      )}
      {...props}
    />
  );
}
