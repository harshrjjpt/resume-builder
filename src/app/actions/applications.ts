"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@prisma/client";
import { getActiveUserId } from "@/lib/active-user";
import { hasDatabase } from "@/lib/runtime";
import { localCreateApplication, localGetApplications, localMoveApplication } from "@/lib/local-store";

async function requireUser() {
  return getActiveUserId();
}

export async function getApplications() {
  const userId = await requireUser();
  if (!hasDatabase) return localGetApplications(userId);
  return prisma.application.findMany({ where: { userId }, orderBy: { updatedAt: "desc" } });
}

export async function createApplication(company: string, role: string) {
  const userId = await requireUser();
  if (!hasDatabase) {
    localCreateApplication(userId, company, role);
    revalidatePath("/dashboard/applications");
    return;
  }
  await prisma.application.create({ data: { userId, company, role } });
  revalidatePath("/dashboard/applications");
}

export async function moveApplication(id: string, status: ApplicationStatus) {
  const userId = await requireUser();
  if (!hasDatabase) {
    localMoveApplication(userId, id, status);
    revalidatePath("/dashboard/applications");
    return;
  }
  await prisma.application.updateMany({ where: { id, userId }, data: { status } });
  revalidatePath("/dashboard/applications");
}
