import express from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  completeHabit,
  uncompleteHabit,
  getHabitStats,
} from "../controllers/habitController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// CRUD routes
router.get("/", getHabits);
router.post("/", createHabit);
router.put("/:id", updateHabit);
router.delete("/:id", deleteHabit);

// Completion routes
router.post("/:id/complete", completeHabit);
router.post("/:id/uncomplete", uncompleteHabit);

// Stats route
router.get("/stats", getHabitStats);

export default router;
