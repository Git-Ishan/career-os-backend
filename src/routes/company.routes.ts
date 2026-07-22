import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../validation/company.schema";
import * as companyController from "../controllers/company.controller";

const router = Router();

router.use(authenticate); // every route below requires a valid access token

router.post(
  "/",
  validate(createCompanySchema),
  companyController.createCompany,
);
router.get("/", companyController.listCompanies);
router.get("/:id", companyController.getCompany);
router.patch(
  "/:id",
  validate(updateCompanySchema),
  companyController.updateCompany,
);
router.delete("/:id", companyController.deleteCompany);

export default router;