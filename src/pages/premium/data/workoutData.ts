
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
  // BEGINNER WORKOUTS
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
    id: "2b",
    name: "Beginner Arms Builder",
    description: "Simple workout to develop arm strength for beginners",
    difficulty: "beginner",
    duration: "25 min",
    primaryMuscleGroups: ["arms"],
    secondaryMuscleGroups: ["shoulders", "chest"],
    exercises: [
      { name: "Bicep Curls", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Tricep Dips", sets: 3, reps: "8-10", rest: "60s" },
      { name: "Hammer Curls", sets: 3, reps: "10 each arm", rest: "60s" },
      { name: "Overhead Tricep Extension", sets: 3, reps: "12", rest: "60s" }
    ]
  },
  {
    id: "3b",
    name: "Beginner Core Strength",
    description: "Strengthen your core with these beginner-friendly exercises",
    difficulty: "beginner",
    duration: "20 min",
    primaryMuscleGroups: ["core"],
    secondaryMuscleGroups: ["lower back"],
    exercises: [
      { name: "Crunches", sets: 3, reps: "12-15", rest: "45s" },
      { name: "Russian Twists", sets: 3, reps: "10 each side", rest: "45s" },
      { name: "Dead Bug", sets: 3, reps: "8 each side", rest: "45s" },
      { name: "Bird Dog", sets: 3, reps: "8 each side", rest: "45s" }
    ]
  },
  {
    id: "4b",
    name: "Beginner Leg Day",
    description: "Simple workout to build leg strength for beginners",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["legs"],
    secondaryMuscleGroups: ["core", "glutes"],
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "15", rest: "60s" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "60s" },
      { name: "Glute Bridges", sets: 3, reps: "12", rest: "60s" },
      { name: "Calf Raises", sets: 3, reps: "15", rest: "60s" }
    ]
  },
  
  // INTERMEDIATE WORKOUTS
  {
    id: "5",
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
    id: "6i",
    name: "Intermediate Push-Pull",
    description: "Efficient workout to hit all major upper body muscles",
    difficulty: "intermediate",
    duration: "50 min",
    primaryMuscleGroups: ["chest", "back", "shoulders", "arms"],
    secondaryMuscleGroups: ["core"],
    exercises: [
      { name: "Incline Dumbbell Press", sets: 4, reps: "10", rest: "90s" },
      { name: "Bent Over Rows", sets: 4, reps: "10", rest: "90s" },
      { name: "Lateral Raises", sets: 3, reps: "12", rest: "60s" },
      { name: "Close-Grip Bench Press", sets: 3, reps: "10", rest: "90s" },
      { name: "Cable Curls", sets: 3, reps: "12", rest: "60s" }
    ]
  },
  {
    id: "7i",
    name: "Intermediate Core Circuit",
    description: "Circuit training focusing on core strength and endurance",
    difficulty: "intermediate",
    duration: "35 min",
    primaryMuscleGroups: ["core"],
    secondaryMuscleGroups: ["shoulders", "lower back"],
    exercises: [
      { name: "Hanging Leg Raises", sets: 3, reps: "10-12", rest: "60s" },
      { name: "Plank Variations", sets: 3, reps: "45s hold", rest: "60s" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: "8-10", rest: "60s" },
      { name: "Side Planks", sets: 3, reps: "30s each side", rest: "60s" },
      { name: "Cable Crunches", sets: 3, reps: "15", rest: "60s" }
    ]
  },
  
  // ADVANCED WORKOUTS
  {
    id: "8",
    name: "Lower Body Power",
    description: "Build leg strength and power with these compound movements",
    difficulty: "advanced",
    duration: "50 min",
    primaryMuscleGroups: ["legs"],
    secondaryMuscleGroups: ["core", "lower back"],
    exercises: [
      { name: "Barbell Squats", sets: 5, reps: "5-6", rest: "120s" },
      { name: "Romanian Deadlifts", sets: 4, reps: "8-10", rest: "120s" },
      { name: "Walking Lunges", sets: 3, reps: "10 each leg", rest: "90s" },
      { name: "Calf Raises", sets: 3, reps: "15-20", rest: "60s" }
    ]
  },
  {
    id: "9a",
    name: "Advanced Full Body",
    description: "Intense full body workout for experienced lifters",
    difficulty: "advanced",
    duration: "60 min",
    primaryMuscleGroups: ["chest", "back", "legs", "shoulders"],
    secondaryMuscleGroups: ["arms", "core"],
    exercises: [
      { name: "Deadlifts", sets: 5, reps: "5", rest: "120s" },
      { name: "Weighted Pull-ups", sets: 4, reps: "6-8", rest: "120s" },
      { name: "Front Squats", sets: 4, reps: "8", rest: "120s" },
      { name: "Dips", sets: 3, reps: "8-10", rest: "90s" },
      { name: "Barbell Rows", sets: 4, reps: "8", rest: "90s" }
    ]
  },
  {
    id: "10a",
    name: "Advanced Push Day",
    description: "High-intensity pushing workout for chest, shoulders and triceps",
    difficulty: "advanced",
    duration: "55 min",
    primaryMuscleGroups: ["chest", "shoulders", "arms"],
    secondaryMuscleGroups: ["core"],
    exercises: [
      { name: "Barbell Bench Press", sets: 5, reps: "5", rest: "120s" },
      { name: "Overhead Press", sets: 4, reps: "6-8", rest: "120s" },
      { name: "Incline Dumbbell Press", sets: 4, reps: "8", rest: "90s" },
      { name: "Weighted Dips", sets: 3, reps: "8", rest: "90s" },
      { name: "Lateral Raises", sets: 3, reps: "12", rest: "60s" }
    ]
  },
  {
    id: "11a",
    name: "Advanced Pull Day",
    description: "High-intensity pulling workout for back and biceps",
    difficulty: "advanced",
    duration: "55 min",
    primaryMuscleGroups: ["back", "arms"],
    secondaryMuscleGroups: ["shoulders", "core"],
    exercises: [
      { name: "Weighted Pull-ups", sets: 4, reps: "6-8", rest: "120s" },
      { name: "Pendlay Rows", sets: 4, reps: "8", rest: "120s" },
      { name: "Heavy Barbell Curls", sets: 4, reps: "8", rest: "90s" },
      { name: "Face Pulls", sets: 3, reps: "15", rest: "60s" },
      { name: "Hammer Curls", sets: 3, reps: "10 each arm", rest: "60s" }
    ]
  },
  {
    id: "4",
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
