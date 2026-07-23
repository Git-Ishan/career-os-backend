import prisma from "../config/prisma";
import { InterviewResult } from "@prisma/client";

interface CreateInterviewInput {
  date?: string;
  type: string;
  questionsAsked?: string;
  difficulty?: string;
  feedback?: string;
  result?: InterviewResult;
  notes?: string;
}

async function assertCompanyOwnership(userId: string, companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company || company.userId !== userId) {
    return null;
  }
  return company;
}

export async function createInterview(
  userId: string,
  companyId: string,
  data: CreateInterviewInput,
) {
  const company = await assertCompanyOwnership(userId, companyId);
  if (!company) return null;

  return prisma.interview.create({
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
      companyId,
    },
  });
}

export async function listInterviewsForCompany(
  userId: string,
  companyId: string,
) {
  const company = await assertCompanyOwnership(userId, companyId);
  if (!company) return null;

  return prisma.interview.findMany({
    where: { companyId },
    orderBy: { date: "desc" },
  });
}

export async function listUpcomingInterviews(userId: string) {
  // Used for the global "Upcoming Interviews" dashboard widget later
  return prisma.interview.findMany({
    where: {
      company: { userId },
      date: { gte: new Date() },
    },
    include: { company: { select: { name: true, role: true } } },
    orderBy: { date: "asc" },
  });
}

async function getInterviewWithOwnership(userId: string, interviewId: string) {
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { company: true },
  });
  if (!interview || interview.company.userId !== userId) {
    return null;
  }
  return interview;
}

export async function updateInterview(
  userId: string,
  interviewId: string,
  data: Partial<CreateInterviewInput>,
) {
  const existing = await getInterviewWithOwnership(userId, interviewId);
  if (!existing) return null;

  return prisma.interview.update({
    where: { id: interviewId },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}

export async function deleteInterview(userId: string, interviewId: string) {
  const existing = await getInterviewWithOwnership(userId, interviewId);
  if (!existing) return null;

  await prisma.interview.delete({ where: { id: interviewId } });
  return true;
}
