import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {
  handleGenerateSummary,
  handleImproveBullet,
  handleRewriteSection,
  handleJobMatch,
  handleReview,
  handleInterview,
  handleConvertImported,
  handleSuggestSkills,
  handleCreateConvertJob,
  handleGetConvertJob,
} from "../controllers/aiController";

const router = Router();

// All routes require authentication (applied in index.ts at the router level)

router.post("/generate-summary", asyncHandler(handleGenerateSummary));
router.post("/improve-bullet", asyncHandler(handleImproveBullet));
router.post("/rewrite-section", asyncHandler(handleRewriteSection));
router.post("/job-match", asyncHandler(handleJobMatch));
router.post("/review", asyncHandler(handleReview));
router.post("/interview", asyncHandler(handleInterview));
router.post("/convert-imported-resume", asyncHandler(handleConvertImported));
router.post("/convert-jobs", asyncHandler(handleCreateConvertJob));
router.get("/convert-jobs/:id", asyncHandler(handleGetConvertJob));
router.post("/suggest-skills", asyncHandler(handleSuggestSkills));

export default router;
