import { Router } from "express";
import { listUsers } from "../controllers/userController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", requireAuth, requireAdmin, listUsers);
export default router;
