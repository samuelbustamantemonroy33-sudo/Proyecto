import { Router } from "express";
import { createContact, deleteContact, listContacts, updateContact } from "../controllers/contactController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/", listContacts);
router.post("/", createContact);
router.put("/:id", requireAdmin, updateContact);
router.delete("/:id", requireAdmin, deleteContact);
export default router;
