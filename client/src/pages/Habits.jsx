import { useState, useMemo, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { habitAPI } from "../utils/api";
import Card from "../components/Card";
import Button from "../components/Button";
import HabitForm from "../components/HabitForm";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";

const Habits = () => {
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [deletingHabit, setDeletingHabit] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");

  const queryClient = useQueryClient();

  // Fetch habits
  const { data: habitsData, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: habitAPI.getHabits,
  });

  const habits = habitsData?.data || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: habitAPI.deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habit-stats']);
      setDeletingHabit(null);
    },
  });

  // Memoize filtered habits to prevent re-renders
  const filteredHabits = useMemo(() => {
    if (filterCategory === "All") return habits;
    return habits.filter(habit => habit.category === filterCategory);
  }, [habits, filterCategory]);

  // Memoize categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(habits.map(habit => habit.category))];
    return ["All", ...uniqueCategories.sort()];
  }, [habits]);

  const handleEditHabit = useCallback((habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setShowHabitForm(false);
    setEditingHabit(null);
  }, []);

  const handleDeleteHabit = useCallback((habit) => {
    setDeletingHabit(habit);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deletingHabit) {
      deleteMutation.mutate(deletingHabit._id);
    }
  }, [deletingHabit, deleteMutation]);

  const getCategoryIcon = useCallback((category) => {
    const icons = {
      Health: "🏥",
      Fitness: "💪",
      Learning: "📚", 
      Productivity: "⚡",
      Mindfulness: "🧘",
      Social: "👥",
      Other: "📝",
    };
    return icons[category] || "📝";
  }, []);

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">My Habits</h1>
          <p className="mt-2 text-gray-600">
            Manage all your habits and track your progress
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

      {/* Filter Bar */}
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${filterCategory === category
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {category === "All" ? "All" : `${getCategoryIcon(category)} ${category}`}
            </button>
          ))}
        </div>
      )}

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterCategory === "All" ? "No habits yet" : `No ${filterCategory} habits`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filterCategory === "All" 
              ? "Start building good habits by creating your first one!"
              : `You don't have any ${filterCategory} habits yet.`
            }
          </p>
          <Button onClick={() => setShowHabitForm(true)}>
            Create New Habit
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredHabits.map((habit) => (
            <Card 
              key={habit._id} 
              className="hover:shadow-lg transition-shadow duration-200"
              padding="none"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Habit Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {habit.name}
                      </h3>
                      <span 
                        className="inline-block px-2 py-1 text-xs font-medium rounded-full"
                        style={{ 
                          backgroundColor: habit.color + '20',
                          color: habit.color
                        }}
                      >
                        {getCategoryIcon(habit.category)} {habit.category}
                      </span>
                      {!habit.isActive && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-200 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {habit.dailyGoal}
                        </div>
                        <div className="text-xs text-gray-500">Daily Goal</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: habit.color }}>
                          {habit.currentStreak}
                        </div>
                        <div className="text-xs text-gray-500">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {habit.todayCount}
                        </div>
                        <div className="text-xs text-gray-500">Today's Count</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-600">Today's Progress</span>
                        <span className="text-sm font-medium text-gray-900">
                          {Math.round((habit.todayCount / habit.dailyGoal) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((habit.todayCount / habit.dailyGoal) * 100, 100)}%`,
                            backgroundColor: habit.color
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 ml-6">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditHabit(habit)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteHabit(habit)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm 
        isOpen={showHabitForm}
        onClose={handleCloseForm}
        habit={editingHabit}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingHabit}
        onClose={() => setDeletingHabit(null)}
        title="Delete Habit"
        size="sm"
      >
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Are you sure?
          </h3>
          <p className="text-gray-600 mb-6">
            This will permanently delete "<strong>{deletingHabit?.name}</strong>" and all its progress data. This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              onClick={() => setDeletingHabit(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
              loading={deleteMutation.isLoading}
            >
              Delete Habit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Habits;
