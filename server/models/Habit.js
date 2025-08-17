import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Habit name is required"],
      trim: true,
      maxlength: [100, "Habit name cannot exceed 100 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Health",
        "Fitness",
        "Learning",
        "Productivity",
        "Mindfulness",
        "Social",
        "Other",
      ],
    },
    dailyGoal: {
      type: Number,
      required: [true, "Daily goal is required"],
      min: [1, "Daily goal must be at least 1"],
      default: 1,
    },
    completedDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        count: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    color: {
      type: String,
      default: "#3b82f6",
      match: [
        /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        "Please enter a valid hex color",
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to get current streak
habitSchema.methods.getCurrentStreak = function () {
  if (!this.completedDates || this.completedDates.length === 0) {
    return 0;
  }

  const sortedDates = this.completedDates
    .map((entry) => new Date(entry.date))
    .sort((a, b) => b - a);

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if completed today or yesterday
  const latestDate = sortedDates[0];
  latestDate.setHours(0, 0, 0, 0);

  if (
    latestDate.getTime() !== today.getTime() &&
    latestDate.getTime() !== yesterday.getTime()
  ) {
    return 0;
  }

  // Calculate streak
  let currentDate = new Date(today);
  for (const date of sortedDates) {
    date.setHours(0, 0, 0, 0);
    if (date.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

// Method to check if completed today
habitSchema.methods.isCompletedToday = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return this.completedDates.some((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
};

// Method to get today's completion count
habitSchema.methods.getTodayCompletionCount = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayEntry = this.completedDates.find((entry) => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  return todayEntry ? todayEntry.count : 0;
};

export default mongoose.model("Habit", habitSchema);
