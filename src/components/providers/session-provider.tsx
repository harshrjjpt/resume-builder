"use client";

export function SessionProvider({
  children,
  session: _session
}: {
  children: React.ReactNode;
  session: unknown;
}) {
  return <>{children}</>;
}
