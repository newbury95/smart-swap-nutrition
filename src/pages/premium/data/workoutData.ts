
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  primaryMuscleGroups: string[];
  secondaryMuscleGroups: string[];
  exercises: Exercise[];
  imageUrl?: string;
}

export const workoutData: Workout[] = [
  {
    id: "1",
    name: "Full Body Beginner",
    description: "Great for beginners focusing on all major muscle groups",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["chest", "back", "legs"],
    secondaryMuscleGroups: ["arms", "shoulders", "core"],
    exercises: [
      { name: "Push-ups", sets: 3, reps: "8-10", rest: "60s" },
      { name: "Bodyweight Squats", sets: 3, reps: "12-15", rest: "60s" },
      { name: "Plank", sets: 3, reps: "30s hold", rest: "60s" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12", rest: "60s" }
    ]
  },
  {
    id: "2",
    name: "Upper Body Strength",
    description: "Focus on building upper body strength with compound movements",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["chest", "back", "shoulders"],
    secondaryMuscleGroups: ["arms", "core"],
    exercises: [
      { name: "Bench Press", sets: 4, reps: "8-10", rest: "90s" },
      { name: "Pull-ups", sets: 4, reps: "6-8", rest: "90s" },
      { name: "Overhead Press", sets: 3, reps: "8-10", rest: "90s" },
      { name: "Face Pulls", sets: 3, reps: "12-15", rest: "60s" }
    ]
  },
  {
    id: "3",
    name: "Lower Body Power",
    description: "Build leg strength and power with these compound movements",
    difficulty: "advanced",
    duration: "50 min",
    primaryMuscleGroups: ["quads", "hamstrings", "glutes"],
    secondaryMuscleGroups: ["calves", "core", "lower back"],
    exercises: [
      { name: "Barbell Squats", sets: 5, reps: "5-6", rest: "120s" },
      { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: "120s" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "90s" },
      { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60s" }
    ]
  },
  {
    id: "4",
    name: "Core Strength",
    description: "Strengthen your core with these targeted exercises",
    difficulty: "beginner",
    duration: "25 min",
    primaryMuscleGroups: ["abs", "obliques", "lower back"],
    secondaryMuscleGroups: ["hip flexors", "shoulders"],
    exercises: [
      { name: "Crunches", sets: 3, reps: "15-20", rest: "45s" },
      { name: "Russian Twists", sets: 3, reps: "12-15 each side", rest: "45s" },
      { name: "Dead Bug", sets: 3, reps: "10 each side", rest: "45s" },
      { name: "Bird Dog", sets: 3, reps: "10 each side", rest: "45s" }
    ]
  },
  {
    id: "5",
    name: "HIIT Cardio",
    description: "High-intensity interval training for maximum calorie burn",
    difficulty: "intermediate",
    duration: "20 min",
    primaryMuscleGroups: ["full body"],
    secondaryMuscleGroups: ["heart", "lungs"],
    exercises: [
      { name: "Burpees", sets: 4, reps: "10", rest: "30s" },
      { name: "Mountain Climbers", sets: 4, reps: "20 each leg", rest: "30s" },
      { name: "Jumping Jacks", sets: 4, reps: "25", rest: "30s" },
      { name: "High Knees", sets: 4, reps: "20 each leg", rest: "30s" }
    ]
  }
];
