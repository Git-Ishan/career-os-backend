import { z } from "zod";
import { APPLICATION_STATUSES } from "../utils/companyStatus";

export const createCompanySchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  location: z.string().optional(),
  package: z.string().optional(),
  applicationLink: z.string().url().optional().or(z.literal("")),
  applicationDate: z.string().optional(),
  deadline: z.string().optional(),
  status: z.enum(APPLICATION_STATUSES as [string, ...string[]]).optional(),
  notes: z.string().optional(),
  hrContact: z.string().optional(),
  referral: z.boolean().optional(),
  priority: z.boolean().optional(),
});

export const updateCompanySchema = createCompanySchema.partial();

export const listCompaniesQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES as [string, ...string[]]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["createdAt", "deadline", "applicationDate"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
