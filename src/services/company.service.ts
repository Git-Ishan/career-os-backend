import prisma from "../config/prisma";
import { ApplicationStatus, Prisma } from "@prisma/client";

interface CreateCompanyInput {
  name: string;
  role: string;
  location?: string;
  package?: string;
  applicationLink?: string;
  applicationDate?: string;
  deadline?: string;
  status?: ApplicationStatus;
  notes?: string;
  hrContact?: string;
  referral?: boolean;
  priority?: boolean;
}

interface ListCompaniesQuery {
  status?: ApplicationStatus;
  search?: string;
  sortBy?: "createdAt" | "deadline" | "applicationDate";
  order?: "asc" | "desc";
}

export async function createCompany(userId: string, data: CreateCompanyInput) {
  return prisma.company.create({
    data: {
      ...data,
      applicationDate: data.applicationDate
        ? new Date(data.applicationDate)
        : undefined,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      userId,
    },
  });
}

export async function listCompanies(userId: string, query: ListCompaniesQuery) {
  const where: Prisma.CompanyWhereInput = { userId };

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { role: { contains: query.search, mode: "insensitive" } },
    ];
  }

  const sortField = query.sortBy || "createdAt";
  const sortOrder = query.order || "desc";

  const orderBy: Prisma.CompanyOrderByWithRelationInput =
    sortField === "deadline"
      ? { deadline: sortOrder }
      : sortField === "applicationDate"
        ? { applicationDate: sortOrder }
        : { createdAt: sortOrder };

  return prisma.company.findMany({
    where,
    orderBy,
  });
}

export async function getCompanyById(userId: string, companyId: string) {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company || company.userId !== userId) {
    return null; // covers both "doesn't exist" and "not yours"
  }
  return company;
}

export async function updateCompany(
  userId: string,
  companyId: string,
  data: Partial<CreateCompanyInput>,
) {
  const existing = await getCompanyById(userId, companyId);
  if (!existing) return null;

  return prisma.company.update({
    where: { id: companyId },
    data: {
      ...data,
      applicationDate: data.applicationDate
        ? new Date(data.applicationDate)
        : undefined,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    },
  });
}

export async function deleteCompany(userId: string, companyId: string) {
  const existing = await getCompanyById(userId, companyId);
  if (!existing) return null;

  await prisma.company.delete({ where: { id: companyId } });
  return true;
}
