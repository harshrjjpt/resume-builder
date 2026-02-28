import type { NextAuthOptions } from "next-auth";
import { hasDatabase } from "@/lib/runtime";

function hasAnyProviderEnv() {
  return Boolean(
    (process.env.GITHUB_ID && process.env.GITHUB_SECRET) ||
      (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  );
}

export function getAuthOptions(): NextAuthOptions {
  const providers: NextAuthOptions["providers"] = [];

  if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
    const GitHubProvider = require("next-auth/providers/github").default;
    providers.push(
      GitHubProvider({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET
      })
    );
  }

  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const GoogleProvider = require("next-auth/providers/google").default;
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
      })
    );
  }

  const options: NextAuthOptions = {
    session: { strategy: hasDatabase ? "database" : "jwt" },
    providers,
    callbacks: {
      async session({ session, user }) {
        if (session.user && user?.id) {
          session.user.id = user.id;
        }
        return session;
      }
    }
  };

  if (hasDatabase) {
    const { PrismaAdapter } = require("@next-auth/prisma-adapter");
    const { prisma } = require("@/lib/prisma");
    options.adapter = PrismaAdapter(prisma);
  }

  return options;
}

export function isAuthConfigured() {
  return Boolean(process.env.NEXTAUTH_SECRET) && hasAnyProviderEnv();
}
