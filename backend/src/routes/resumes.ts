import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { list, getById, create, update, remove, versions } from "../controllers/resumeController";

const router = Router();

// All routes require authentication (applied in index.ts at the router level)

router.get("/", asyncHandler(list));
router.get("/:id", asyncHandler(getById));
router.get("/:id/versions", asyncHandler(versions));
router.post("/", asyncHandler(create));
router.put("/:id", asyncHandler(update));
router.delete("/:id", asyncHandler(remove));

export default router;
