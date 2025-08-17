import mongoose from "mongoose";
import dotenv from "dotenv";
import Habit from "./models/Habit.js";
import User from "./models/User.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Find a user to associate habits with
    const user = await User.findOne();
    if (!user) {
      console.log("No user found. Please register a user first.");
      process.exit(1);
    }

    // Clear existing habits for this user
    await Habit.deleteMany({ user: user._id });
    console.log("Cleared existing habits...");

    // Sample habits with some completion history
    const currentDate = new Date();
    const habits = [
      {
        name: "Drink 8 glasses of water",
        category: "Health",
        dailyGoal: 8,
        color: "#3b82f6",
        user: user._id,
        completedDates: [
          // Yesterday - completed
          {
            date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
            count: 8,
          },
          // 2 days ago - completed
          {
            date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
            count: 8,
          },
          // 3 days ago - partial
          {
            date: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000),
            count: 5,
          },
        ],
      },
      {
        name: "30 minutes exercise",
        category: "Fitness",
        dailyGoal: 1,
        color: "#ef4444",
        user: user._id,
        completedDates: [
          // Yesterday - completed
          {
            date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
            count: 1,
          },
          // 2 days ago - completed
          {
            date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
            count: 1,
          },
        ],
      },
      {
        name: "Read for 30 minutes",
        category: "Learning",
        dailyGoal: 1,
        color: "#10b981",
        user: user._id,
        completedDates: [
          // Today - completed
          { date: currentDate, count: 1 },
          // Yesterday - completed
          {
            date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
            count: 1,
          },
        ],
      },
      {
        name: "Write 3 tasks for tomorrow",
        category: "Productivity",
        dailyGoal: 3,
        color: "#f59e0b",
        user: user._id,
        completedDates: [
          // Today - partial
          { date: currentDate, count: 2 },
        ],
      },
      {
        name: "Practice meditation",
        category: "Mindfulness",
        dailyGoal: 1,
        color: "#8b5cf6",
        user: user._id,
        completedDates: [
          // Yesterday - completed
          {
            date: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000),
            count: 1,
          },
          // 4 days ago - completed
          {
            date: new Date(currentDate.getTime() - 4 * 24 * 60 * 60 * 1000),
            count: 1,
          },
          // 5 days ago - completed
          {
            date: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000),
            count: 1,
          },
        ],
      },
      {
        name: "Call family or friends",
        category: "Social",
        dailyGoal: 1,
        color: "#ec4899",
        user: user._id,
        completedDates: [
          // 2 days ago - completed
          {
            date: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000),
            count: 1,
          },
        ],
      },
    ];

    // Insert habits
    const createdHabits = await Habit.insertMany(habits);
    console.log(
      `✅ Seeded ${createdHabits.length} habits for user: ${user.username}`
    );

    mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding data:", error);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
