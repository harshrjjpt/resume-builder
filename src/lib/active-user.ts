import { getServerSession } from "next-auth";
import { getAuthOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasDatabase } from "@/lib/runtime";

const GUEST_EMAIL = "guest@hireloom.local";
const LOCAL_GUEST_ID = "guest-local";

export async function getActiveUserId() {
  if (!hasDatabase) return LOCAL_GUEST_ID;

  const session = await getServerSession(getAuthOptions());
  if (session?.user?.id) return session.user.id;

  const guest = await prisma.user.upsert({
    where: { email: GUEST_EMAIL },
    update: {},
    create: {
      email: GUEST_EMAIL,
      name: "Guest User"
    }
  });

  return guest.id;
}
