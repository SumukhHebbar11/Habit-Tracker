import { z } from "zod";
import Habit from "../models/Habit.js";

const createHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name too long"),
  category: z.enum([
    "Health",
    "Fitness",
    "Learning",
    "Productivity",
    "Mindfulness",
    "Social",
    "Other",
  ]),
  dailyGoal: z
    .number()
    .min(1, "Daily goal must be at least 1")
    .max(100, "Daily goal too high"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
});

const updateHabitSchema = z.object({
  name: z
    .string()
    .min(1, "Habit name is required")
    .max(100, "Habit name too long")
    .optional(),
  category: z
    .enum([
      "Health",
      "Fitness",
      "Learning",
      "Productivity",
      "Mindfulness",
      "Social",
      "Other",
    ])
    .optional(),
  dailyGoal: z
    .number()
    .min(1, "Daily goal must be at least 1")
    .max(100, "Daily goal too high")
    .optional(),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format")
    .optional(),
  isActive: z.boolean().optional(),
});

// @desc    Get all habits for authenticated user
// @route   GET /api/habits
// @access  Private
export const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    // Add computed fields
    const habitsWithStats = habits.map((habit) => ({
      ...habit.toObject(),
      currentStreak: habit.getCurrentStreak(),
      isCompletedToday: habit.isCompletedToday(),
      todayCount: habit.getTodayCompletionCount(),
    }));

    res.json({
      success: true,
      data: habitsWithStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching habits" });
  }
};

// @desc    Create new habit
// @route   POST /api/habits
// @access  Private
export const createHabit = async (req, res) => {
  try {
    const validatedData = createHabitSchema.parse(req.body);

    const habit = await Habit.create({
      ...validatedData,
      user: req.user.id,
    });

    const habitWithStats = {
      ...habit.toObject(),
      currentStreak: habit.getCurrentStreak(),
      isCompletedToday: habit.isCompletedToday(),
      todayCount: habit.getTodayCompletionCount(),
    };

    res.status(201).json({
      success: true,
      data: habitWithStats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Server error while creating habit" });
  }
};

// @desc    Update habit
// @route   PUT /api/habits/:id
// @access  Private
export const updateHabit = async (req, res) => {
  try {
    const validatedData = updateHabitSchema.parse(req.body);

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    Object.assign(habit, validatedData);
    await habit.save();

    const habitWithStats = {
      ...habit.toObject(),
      currentStreak: habit.getCurrentStreak(),
      isCompletedToday: habit.isCompletedToday(),
      todayCount: habit.getTodayCompletionCount(),
    };

    res.json({
      success: true,
      data: habitWithStats,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    }
    res.status(500).json({ message: "Server error while updating habit" });
  }
};

// @desc    Delete habit
// @route   DELETE /api/habits/:id
// @access  Private
export const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await habit.deleteOne();

    res.json({
      success: true,
      message: "Habit deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting habit" });
  }
};

// @desc    Mark habit as completed for today
// @route   POST /api/habits/:id/complete
// @access  Private
export const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already completed today
    const existingEntry = habit.completedDates.find((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (existingEntry) {
      // Increment count if under daily goal
      if (existingEntry.count < habit.dailyGoal) {
        existingEntry.count += 1;
      } else {
        return res.status(400).json({
          message: "Daily goal already achieved for this habit",
        });
      }
    } else {
      // Add new completion entry
      habit.completedDates.push({
        date: today,
        count: 1,
      });
    }

    await habit.save();
    const habitWithStats = {
      ...habit.toObject(),
      currentStreak: habit.getCurrentStreak(),
      isCompletedToday: habit.isCompletedToday(),
      todayCount: habit.getTodayCompletionCount(),
    };

    res.json({
      success: true,
      data: habitWithStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while completing habit" });
  }
};

// @desc    Undo habit completion for today
// @route   POST /api/habits/:id/uncomplete
// @access  Private
export const uncompleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's entry
    const todayEntryIndex = habit.completedDates.findIndex((entry) => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    });

    if (todayEntryIndex === -1) {
      return res.status(400).json({
        message: "No completion found for today",
      });
    }

    const todayEntry = habit.completedDates[todayEntryIndex];

    if (todayEntry.count > 1) {
      // Decrement count
      todayEntry.count -= 1;
    } else {
      // Remove the entry completely
      habit.completedDates.splice(todayEntryIndex, 1);
    }

    await habit.save();
    const habitWithStats = {
      ...habit.toObject(),
      currentStreak: habit.getCurrentStreak(),
      isCompletedToday: habit.isCompletedToday(),
      todayCount: habit.getTodayCompletionCount(),
    };

    res.json({
      success: true,
      data: habitWithStats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while uncompleting habit" });
  }
};

// @desc    Get habit statistics
// @route   GET /api/habits/stats
// @access  Private
export const getHabitStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id, isActive: true });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = {
      totalHabits: habits.length,
      completedToday: 0,
      averageStreak: 0,
      categoryBreakdown: {},
      weeklyProgress: [],
    };

    let totalStreaks = 0;

    habits.forEach((habit) => {
      // Count completed today
      if (habit.isCompletedToday()) {
        stats.completedToday++;
      }

      // Calculate average streak
      totalStreaks += habit.getCurrentStreak();

      // Category breakdown
      if (!stats.categoryBreakdown[habit.category]) {
        stats.categoryBreakdown[habit.category] = 0;
      }
      stats.categoryBreakdown[habit.category]++;
    });

    stats.averageStreak =
      habits.length > 0 ? Math.round(totalStreaks / habits.length) : 0;

    // Weekly progress (last 7 days)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      let completedCount = 0;
      habits.forEach((habit) => {
        const dateEntry = habit.completedDates.find((entry) => {
          const entryDate = new Date(entry.date);
          entryDate.setHours(0, 0, 0, 0);
          return entryDate.getTime() === date.getTime();
        });

        if (dateEntry && dateEntry.count >= habit.dailyGoal) {
          completedCount++;
        }
      });

      stats.weeklyProgress.push({
        date: date.toISOString().split("T")[0],
        completed: completedCount,
        total: habits.length,
        percentage:
          habits.length > 0
            ? Math.round((completedCount / habits.length) * 100)
            : 0,
      });
    }

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching stats" });
  }
};
