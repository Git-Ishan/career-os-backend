import { Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import * as companyService from "../services/company.service";

export async function createCompany(req: AuthRequest, res: Response) {
  const company = await companyService.createCompany(req.userId!, req.body);
  res.status(201).json({ company });
}

export async function listCompanies(req: AuthRequest, res: Response) {
  const companies = await companyService.listCompanies(
    req.userId!,
    req.query as any,
  );
  res.json({ companies });
}

export async function getCompany(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const company = await companyService.getCompanyById(req.userId!, id);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.json({ company });
}

export async function updateCompany(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const company = await companyService.updateCompany(req.userId!, id, req.body);

  if (!company) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.json({ company });
}

export async function deleteCompany(req: AuthRequest, res: Response) {
  const id = req.params.id as string;

  const deleted = await companyService.deleteCompany(req.userId!, id);

  if (!deleted) {
    return res.status(404).json({ message: "Company not found" });
  }

  res.status(204).send();
}
