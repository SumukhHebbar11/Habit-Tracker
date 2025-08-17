import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { habitAPI } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
// Spinner component already exists, reusing it
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const [showHabitForm, setShowHabitForm] = useState(false);

  // Fetch habits and stats
  const { data: habitsData, isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitAPI.getHabits,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['habit-stats'],
    queryFn: habitAPI.getStats,
  });

  const habits = habitsData?.data || [];
  const stats = statsData?.data || {};



  // (static sizing used for heatmap)

  // Memoize chart data to prevent re-renders
  const chartData = useMemo(() => {
    if (!stats.weeklyProgress) return [];
    return stats.weeklyProgress.map(day => ({
      date: new Date(day.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      percentage: day.percentage,
      completed: day.completed,
      total: day.total,
    }));
  }, [stats.weeklyProgress]);

  const categoryData = useMemo(() => {
    if (!stats.categoryBreakdown) return [];
    
    const colors = {
      Health: "#3b82f6",
      Fitness: "#ef4444", 
      Learning: "#10b981",
      Productivity: "#f59e0b",
      Mindfulness: "#8b5cf6",
      Social: "#ec4899",
      Other: "#6b7280",
    };

    return Object.entries(stats.categoryBreakdown).map(([category, count]) => ({
      name: category,
      value: count,
      color: colors[category] || "#6b7280",
    }));
  }, [stats.categoryBreakdown]);

  if (habitsLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Track your daily habits and build lasting routines
          </p>
        </div>
        <Button 
          onClick={() => setShowHabitForm(true)}
          variant="primary"
          className="mt-4 sm:mt-0"
        >
          + Add New Habit
        </Button>
      </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {stats.totalHabits || 0}
            </div>
            <div className="text-sm text-blue-600 mt-1">Total Habits</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700">
              {stats.completedToday || 0}
            </div>
            <div className="text-sm text-green-600 mt-1">Completed Today</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-700">
              {stats.averageStreak || 0}
            </div>
            <div className="text-sm text-purple-600 mt-1">Average Streak</div>
          </div>
        </Card>

  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-700">
              {stats.totalHabits > 0 
                ? Math.round((stats.completedToday / stats.totalHabits) * 100)
                : 0
              }%
            </div>
            <div className="text-sm text-orange-600 mt-1">Today's Progress</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <Card 
          title="Weekly Progress" 
          subtitle="Your habit completion over the last 7 days"
          padding="md"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value, name) => [`${value}%`, 'Completion Rate']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="percentage" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, fill: '#1d4ed8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

  {/* Heatmap removed */}

        {/* Category Breakdown */}
        <Card 
          title="Habit Categories" 
          subtitle="Distribution of your habits by category"
          padding="md"
        >
          <div className="h-64">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, 'Habits']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No habit data available
              </div>
            )}
          </div>
          {categoryData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center text-sm">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Today's Habits */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Habits</h2>
        {habits.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
            <p className="text-gray-600 mb-6">
              Start building good habits by creating your first one!
            </p>
            <Button onClick={() => setShowHabitForm(true)}>
              Create Your First Habit
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits
              .filter(habit => habit.isActive)
              .map((habit) => (
                <HabitCard key={habit._id} habit={habit} />
              ))}
          </div>
        )}
      </div>

      {/* Habit Form Modal */}
      <HabitForm 
        isOpen={showHabitForm}
        onClose={() => setShowHabitForm(false)}
      />
    </div>
  );
};

export default Dashboard;
