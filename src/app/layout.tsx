import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://hireloom.app"),
  title: "HireLoom - Build Resumes That Get Interviews",
  description:
    "HireLoom is an AI-powered resume builder with ATS scoring, job matching, and polished PDF export.",
  applicationName: "HireLoom",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: ["/favicon.svg"],
    apple: [{ url: "/favicon.svg", type: "image/svg+xml" }]
  },
  openGraph: {
    title: "HireLoom",
    description: "Build resumes that get interviews.",
    type: "website",
    images: [{ url: "/og-hireloom.svg" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "HireLoom",
    description: "Build resumes that get interviews.",
    images: ["/og-hireloom.svg"]
  }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SessionProvider session={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
