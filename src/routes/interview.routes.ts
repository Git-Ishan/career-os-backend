import { Router } from "express";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import {
  createInterviewSchema,
  updateInterviewSchema,
} from "../validation/interview.schema";
import * as interviewController from "../controllers/interview.controller";

const router = Router();
router.use(authenticate);

router.get("/upcoming", interviewController.listUpcoming);
router.post(
  "/companies/:companyId/interviews",
  validate(createInterviewSchema),
  interviewController.createInterview,
);
router.get(
  "/companies/:companyId/interviews",
  interviewController.listInterviews,
);
router.patch(
  "/:id",
  validate(updateInterviewSchema),
  interviewController.updateInterview,
);
router.delete("/:id", interviewController.deleteInterview);

export default router;
