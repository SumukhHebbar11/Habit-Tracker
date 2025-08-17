import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { habitAPI } from "../utils/api";
import Button from "./Button";
import Modal from "./Modal";
import "../styles/forms.css";

const habitSchema = z.object({
  name: z.string().min(1, "Habit name is required").max(100, "Name too long"),
  category: z.enum(["Health", "Fitness", "Learning", "Productivity", "Mindfulness", "Social", "Other"]),
  dailyGoal: z.number().min(1, "Goal must be at least 1").max(100, "Goal too high"),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color"),
});

const categoryOptions = [
  { value: "Health", label: "Health", emoji: "🏥" },
  { value: "Fitness", label: "Fitness", emoji: "💪" },
  { value: "Learning", label: "Learning", emoji: "📚" },
  { value: "Productivity", label: "Productivity", emoji: "⚡" },
  { value: "Mindfulness", label: "Mindfulness", emoji: "🧘" },
  { value: "Social", label: "Social", emoji: "👥" },
  { value: "Other", label: "Other", emoji: "📝" },
];

const colorOptions = [
  "#3b82f6", // Blue
  "#ef4444", // Red
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#84cc16", // Lime
];

const HabitForm = ({ isOpen, onClose, habit = null }) => {
  const queryClient = useQueryClient();
  const isEditing = !!habit;

  // Memoize form configuration
  const formConfig = useMemo(() => ({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      name: habit?.name || "",
      category: habit?.category || "Health",
      dailyGoal: habit?.dailyGoal || 1,
      color: habit?.color || "#3b82f6",
    },
  }), [habit]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm(formConfig);

  const selectedColor = watch("color");

  const createMutation = useMutation({
    mutationFn: habitAPI.createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habit-stats']);
      reset();
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => habitAPI.updateHabit(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['habits']);
      queryClient.invalidateQueries(['habit-stats']);
      onClose();
    },
  });

  const onSubmit = useCallback((data) => {
    if (isEditing) {
      updateMutation.mutate({ id: habit._id, data });
    } else {
      createMutation.mutate(data);
    }
  }, [isEditing, habit?._id, createMutation, updateMutation]);

  const handleColorSelect = useCallback((color) => {
    setValue("color", color);
  }, [setValue]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Habit" : "Create New Habit"}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Habit Name */}
        <div className="form-field">
          <label className="form-label">Habit Name</label>
          <input
            {...register("name")}
            type="text"
            className="form-input"
            placeholder="e.g., Drink 8 glasses of water"
          />
          {errors.name && (
            <span className="form-error">{errors.name.message}</span>
          )}
        </div>

        {/* Category */}
        <div className="form-field">
          <label className="form-label">Category</label>
          <select {...register("category")} className="form-input">
            {categoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.emoji} {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span className="form-error">{errors.category.message}</span>
          )}
        </div>

        {/* Daily Goal */}
        <div className="form-field">
          <label className="form-label">Daily Goal</label>
          <input
            {...register("dailyGoal", { valueAsNumber: true })}
            type="number"
            min="1"
            max="100"
            className="form-input"
            placeholder="1"
          />
          {errors.dailyGoal && (
            <span className="form-error">{errors.dailyGoal.message}</span>
          )}
        </div>

        {/* Color Picker */}
        <div className="form-field">
          <label className="form-label">Theme Color</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {colorOptions.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`
                  w-10 h-10 rounded-full border-4 transition-all duration-200
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${selectedColor === color 
                    ? 'border-gray-800 ring-2 ring-gray-400' 
                    : 'border-gray-300'
                  }
                `}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          {errors.color && (
            <span className="form-error">{errors.color.message}</span>
          )}
        </div>

        {/* Preview */}
        <div className="form-field">
          <label className="form-label">Preview</label>
          <div 
            className="p-4 rounded-lg border-2"
            style={{ 
              borderColor: selectedColor + '40',
              backgroundColor: selectedColor + '10' 
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium" style={{ color: selectedColor }}>
                {watch("name") || "Your habit name"}
              </span>
              <span 
                className="px-2 py-1 text-xs rounded-full"
                style={{ 
                  backgroundColor: selectedColor + '20',
                  color: selectedColor 
                }}
              >
                {watch("category")}
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions form-actions-multiple">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={createMutation.isLoading || updateMutation.isLoading}
            className="flex-1"
          >
            {isEditing ? "Update Habit" : "Create Habit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default HabitForm;
