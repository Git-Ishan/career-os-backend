import { z } from "zod";

const RESULTS = ["PENDING", "CLEARED", "REJECTED", "ON_HOLD"] as const;

export const createInterviewSchema = z.object({
  date: z.string().optional(),
  type: z.string().min(1),
  questionsAsked: z.string().optional(),
  difficulty: z.string().optional(),
  feedback: z.string().optional(),
  result: z.enum(RESULTS).optional(),
  notes: z.string().optional(),
});

export const updateInterviewSchema = createInterviewSchema.partial();
