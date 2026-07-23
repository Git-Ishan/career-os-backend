import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as interviewService from "../services/interview.service";

export async function createInterview(req: AuthRequest, res: Response) {
  const companyId = req.params.companyId as string;
  const interview = await interviewService.createInterview(
    req.userId!,
    companyId,
    req.body,
  );
  if (!interview) return res.status(404).json({ message: "Company not found" });
  res.status(201).json({ interview });
}

export async function listInterviews(req: AuthRequest, res: Response) {
  const companyId = req.params.companyId as string;
  const interviews = await interviewService.listInterviewsForCompany(
    req.userId!,
    companyId,
  );
  if (interviews === null)
    return res.status(404).json({ message: "Company not found" });
  res.json({ interviews });
}

export async function listUpcoming(req: AuthRequest, res: Response) {
  const interviews = await interviewService.listUpcomingInterviews(req.userId!);
  res.json({ interviews });
}

export async function updateInterview(req: AuthRequest, res: Response) {
  const id = req.params.id as string;
  const interview = await interviewService.updateInterview(
    req.userId!,
    id,
    req.body,
  );
  if (!interview)
    return res.status(404).json({ message: "Interview not found" });
  res.json({ interview });
}

export async function deleteInterview(req: AuthRequest, res: Response) {
  const id = req.params.id as string;
  const deleted = await interviewService.deleteInterview(req.userId!, id);
  if (!deleted) return res.status(404).json({ message: "Interview not found" });
  res.status(204).send();
}
