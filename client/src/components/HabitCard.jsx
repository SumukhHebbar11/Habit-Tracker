import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitAPI } from "../utils/api";
import Button from "./Button";
import Modal from "./Modal";

const HabitCard = ({ habit }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const queryClient = useQueryClient();

  const completeMutation = useMutation({
    mutationFn: habitAPI.completeHabit,
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habit-stats']);
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    },
  });

  const uncompleteMutation = useMutation({
    mutationFn: habitAPI.uncompleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habit-stats']);
    },
  });

  const [showUncompleteConfirm, setShowUncompleteConfirm] = useState(false);

  const handleToggleComplete = useCallback(() => {
    if (habit.todayCount >= habit.dailyGoal) {
      // If already completed, ask for confirmation before undoing
      setShowUncompleteConfirm(true);
    } else {
      completeMutation.mutate(habit._id);
    }
  }, [habit._id, habit.todayCount, habit.dailyGoal, completeMutation]);

  const confirmUncomplete = useCallback(() => {
    setShowUncompleteConfirm(false);
    uncompleteMutation.mutate(habit._id);
  }, [habit._id, uncompleteMutation]);

  const progressPercentage = Math.min((habit.todayCount / habit.dailyGoal) * 100, 100);
  const isCompleted = habit.todayCount >= habit.dailyGoal;

  return (
    <div 
      className={`
        bg-white rounded-xl p-6 shadow-sm border border-gray-200
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${isAnimating ? 'animate-pulse scale-105' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{habit.name}</h3>
          <span 
            className="inline-block px-2 py-1 text-xs font-medium rounded-full"
            style={{ 
              backgroundColor: habit.color + '20',
              color: habit.color
            }}
          >
            {habit.category}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">
            {habit.currentStreak}
          </div>
          <div className="text-xs text-gray-500">
            day streak
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Progress: {habit.todayCount}/{habit.dailyGoal}
          </span>
          <span className="text-sm font-medium text-gray-900">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progressPercentage}%`,
              backgroundColor: habit.color,
              boxShadow: isCompleted ? `0 0 10px ${habit.color}50` : 'none'
            }}
          />
        </div>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleToggleComplete}
        variant={isCompleted ? "success" : "outline"}
        className="w-full"
        loading={completeMutation.isLoading || uncompleteMutation.isLoading}
        disabled={completeMutation.isLoading || uncompleteMutation.isLoading}
      >
        {isCompleted ? (
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Completed Today!
          </div>
        ) : (
          `Mark Complete (${habit.todayCount}/${habit.dailyGoal})`
        )}
      </Button>

      {/* Confirm undo modal to prevent accidental removal */}
      <Modal isOpen={showUncompleteConfirm} onClose={() => setShowUncompleteConfirm(false)} title="Undo completion?" size="sm">
        <div className="text-center">
          <p className="mb-4 text-gray-700">This will remove today's completion for "{habit.name}". Are you sure?</p>
          <div className="flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setShowUncompleteConfirm(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmUncomplete} loading={uncompleteMutation.isLoading}>Undo</Button>
          </div>
        </div>
      </Modal>

      {/* Completion Animation */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
