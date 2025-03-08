
export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  primaryMuscleGroups: string[];
  secondaryMuscleGroups: string[];
  equipment: string[];
  exercises: Exercise[];
}

// Extended workout data with more specific workouts
export const workoutData: Workout[] = [
  // Chest workouts
  {
    id: "chest-beginner",
    name: "Beginner Chest Workout",
    description: "A simple chest workout for beginners focusing on building strength and form",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["chest"],
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: ["bench", "dumbbells"],
    exercises: [
      { name: "Push-ups", sets: 3, reps: "8-10" },
      { name: "Dumbbell Bench Press", sets: 3, reps: "10-12" },
      { name: "Incline Dumbbell Flyes", sets: 3, reps: "10-12" },
      { name: "Chest Dips (Assisted if needed)", sets: 2, reps: "8-10" }
    ]
  },
  {
    id: "chest-intermediate",
    name: "Intermediate Chest Workout",
    description: "A moderate chest workout for those with some experience",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["chest"],
    secondaryMuscleGroups: ["triceps", "shoulders"],
    equipment: ["bench", "barbell", "dumbbells", "cables"],
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10" },
      { name: "Incline Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Cable Flyes", sets: 3, reps: "12-15" },
      { name: "Push-ups (to failure)", sets: 3, reps: "max" },
      { name: "Dumbbell Pullovers", sets: 3, reps: "10-12" }
    ]
  },
  {
    id: "chest-advanced",
    name: "Advanced Chest Workout",
    description: "An intense chest workout for experienced lifters",
    difficulty: "advanced",
    duration: "60 min",
    primaryMuscleGroups: ["chest"],
    secondaryMuscleGroups: ["triceps", "shoulders", "core"],
    equipment: ["bench", "barbell", "dumbbells", "cables"],
    exercises: [
      { name: "Barbell Bench Press", sets: 5, reps: "6-8" },
      { name: "Incline Barbell Press", sets: 4, reps: "8-10" },
      { name: "Weighted Dips", sets: 4, reps: "8-10" },
      { name: "Cable Crossovers", sets: 3, reps: "12-15" },
      { name: "Decline Dumbbell Press", sets: 3, reps: "8-10" },
      { name: "Push-up Variations (to failure)", sets: 2, reps: "max" }
    ]
  },
  
  // Back workouts
  {
    id: "back-beginner",
    name: "Beginner Back Workout",
    description: "A fundamental back workout for beginners to develop strength and proper form",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["back"],
    secondaryMuscleGroups: ["biceps", "shoulders"],
    equipment: ["dumbbells", "pull-up bar"],
    exercises: [
      { name: "Assisted Pull-ups", sets: 3, reps: "5-8" },
      { name: "Dumbbell Rows", sets: 3, reps: "10-12" },
      { name: "Lat Pulldowns", sets: 3, reps: "10-12" },
      { name: "Seated Cable Rows", sets: 2, reps: "12-15" }
    ]
  },
  {
    id: "back-intermediate",
    name: "Intermediate Back Workout",
    description: "A comprehensive back workout for building thickness and width",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["back"],
    secondaryMuscleGroups: ["biceps", "shoulders", "traps"],
    equipment: ["barbell", "dumbbells", "cables", "pull-up bar"],
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "8-10" },
      { name: "Barbell Rows", sets: 4, reps: "8-10" },
      { name: "Seated Cable Rows", sets: 3, reps: "10-12" },
      { name: "Single-Arm Dumbbell Rows", sets: 3, reps: "10-12" },
      { name: "Face Pulls", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "back-advanced",
    name: "Advanced Back Workout",
    description: "An intensive back workout targeting all areas for maximum development",
    difficulty: "advanced",
    duration: "60 min",
    primaryMuscleGroups: ["back"],
    secondaryMuscleGroups: ["biceps", "shoulders", "traps", "core"],
    equipment: ["barbell", "dumbbells", "cables", "pull-up bar"],
    exercises: [
      { name: "Weighted Pull-ups", sets: 4, reps: "6-8" },
      { name: "Deadlifts", sets: 4, reps: "6-8" },
      { name: "T-Bar Rows", sets: 4, reps: "8-10" },
      { name: "Meadows Rows", sets: 3, reps: "8-10" },
      { name: "Straight Arm Pulldowns", sets: 3, reps: "12-15" },
      { name: "Barbell Shrugs", sets: 3, reps: "10-12" }
    ]
  },
  
  // Legs workouts
  {
    id: "legs-beginner",
    name: "Beginner Leg Workout",
    description: "A simple leg workout for beginners to build foundation strength",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["legs"],
    secondaryMuscleGroups: ["core", "glutes"],
    equipment: ["dumbbells", "bodyweight"],
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: "12-15" },
      { name: "Dumbbell Lunges", sets: 3, reps: "10 each leg" },
      { name: "Leg Press", sets: 3, reps: "12-15" },
      { name: "Calf Raises", sets: 3, reps: "15-20" }
    ]
  },
  {
    id: "legs-intermediate",
    name: "Intermediate Leg Workout",
    description: "A balanced leg workout hitting all major muscle groups",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["legs"],
    secondaryMuscleGroups: ["core", "glutes", "lower back"],
    equipment: ["barbell", "machines", "dumbbells"],
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: "8-10" },
      { name: "Romanian Deadlifts", sets: 3, reps: "10-12" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg" },
      { name: "Leg Extensions", sets: 3, reps: "12-15" },
      { name: "Seated Leg Curls", sets: 3, reps: "12-15" },
      { name: "Standing Calf Raises", sets: 4, reps: "15-20" }
    ]
  },
  {
    id: "legs-advanced",
    name: "Advanced Leg Workout",
    description: "An intense leg workout for maximum strength and hypertrophy",
    difficulty: "advanced",
    duration: "70 min",
    primaryMuscleGroups: ["legs"],
    secondaryMuscleGroups: ["core", "glutes", "lower back"],
    equipment: ["barbell", "machines", "dumbbells"],
    exercises: [
      { name: "Back Squats", sets: 5, reps: "6-8" },
      { name: "Front Squats", sets: 4, reps: "8-10" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10-12 each leg" },
      { name: "Leg Press", sets: 4, reps: "10-12" },
      { name: "Lying Leg Curls", sets: 4, reps: "10-12" },
      { name: "Hack Squats", sets: 3, reps: "10-12" },
      { name: "Seated Calf Raises", sets: 4, reps: "15-20" }
    ]
  },
  
  // Shoulders workouts
  {
    id: "shoulders-beginner",
    name: "Beginner Shoulder Workout",
    description: "A fundamental shoulder workout to build stability and strength",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["shoulders"],
    secondaryMuscleGroups: ["triceps", "traps"],
    equipment: ["dumbbells", "cables"],
    exercises: [
      { name: "Seated Dumbbell Press", sets: 3, reps: "10-12" },
      { name: "Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Front Raises", sets: 3, reps: "12-15" },
      { name: "Face Pulls", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "shoulders-intermediate",
    name: "Intermediate Shoulder Workout",
    description: "A comprehensive shoulder workout targeting all three heads",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["shoulders"],
    secondaryMuscleGroups: ["triceps", "traps", "chest"],
    equipment: ["barbell", "dumbbells", "cables"],
    exercises: [
      { name: "Seated Barbell Press", sets: 4, reps: "8-10" },
      { name: "Arnold Press", sets: 3, reps: "10-12" },
      { name: "Cable Lateral Raises", sets: 3, reps: "12-15" },
      { name: "Bent-Over Reverse Flyes", sets: 3, reps: "12-15" },
      { name: "Shrugs", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "shoulders-advanced",
    name: "Advanced Shoulder Workout",
    description: "An intense shoulder workout for maximum definition and growth",
    difficulty: "advanced",
    duration: "60 min",
    primaryMuscleGroups: ["shoulders"],
    secondaryMuscleGroups: ["triceps", "traps", "chest", "core"],
    equipment: ["barbell", "dumbbells", "cables", "machines"],
    exercises: [
      { name: "Standing Barbell Press", sets: 5, reps: "6-8" },
      { name: "Seated Dumbbell Press", sets: 4, reps: "8-10" },
      { name: "Upright Rows", sets: 4, reps: "10-12" },
      { name: "Drop Set Lateral Raises", sets: 3, reps: "12-15-failure" },
      { name: "Cable Face Pulls", sets: 3, reps: "15-20" },
      { name: "Heavy Shrugs", sets: 4, reps: "10-12" }
    ]
  },
  
  // Arms workouts
  {
    id: "arms-beginner",
    name: "Beginner Arms Workout",
    description: "A simple arms workout for beginners to build strength in biceps and triceps",
    difficulty: "beginner",
    duration: "30 min",
    primaryMuscleGroups: ["arms", "biceps", "triceps"],
    secondaryMuscleGroups: ["shoulders", "forearms"],
    equipment: ["dumbbells", "cables", "bodyweight"],
    exercises: [
      { name: "Dumbbell Curls", sets: 3, reps: "10-12" },
      { name: "Tricep Pushdowns", sets: 3, reps: "12-15" },
      { name: "Hammer Curls", sets: 3, reps: "10-12" },
      { name: "Overhead Tricep Extensions", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "arms-intermediate",
    name: "Intermediate Arms Workout",
    description: "A comprehensive arms workout for balanced development",
    difficulty: "intermediate",
    duration: "45 min",
    primaryMuscleGroups: ["arms", "biceps", "triceps"],
    secondaryMuscleGroups: ["shoulders", "forearms", "chest"],
    equipment: ["barbell", "dumbbells", "cables", "bench"],
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: "8-10" },
      { name: "Close-Grip Bench Press", sets: 4, reps: "8-10" },
      { name: "Preacher Curls", sets: 3, reps: "10-12" },
      { name: "Skull Crushers", sets: 3, reps: "10-12" },
      { name: "Hammer Curls", sets: 3, reps: "12-15" },
      { name: "Rope Pushdowns", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "arms-advanced",
    name: "Advanced Arms Blast",
    description: "An intense arms workout targeting maximum growth",
    difficulty: "advanced",
    duration: "60 min",
    primaryMuscleGroups: ["arms", "biceps", "triceps"],
    secondaryMuscleGroups: ["shoulders", "forearms", "chest"],
    equipment: ["barbell", "dumbbells", "cables", "bench"],
    exercises: [
      { name: "Weighted Chin-ups", sets: 4, reps: "8-10" },
      { name: "Dips", sets: 4, reps: "8-10" },
      { name: "Incline Dumbbell Curls", sets: 4, reps: "10-12" },
      { name: "Overhead Tricep Extensions", sets: 4, reps: "10-12" },
      { name: "Spider Curls", sets: 3, reps: "12-15" },
      { name: "Rope Tricep Kickbacks", sets: 3, reps: "12-15" },
      { name: "Wrist Curls", sets: 3, reps: "15-20" }
    ]
  },
  
  // Core workouts
  {
    id: "core-beginner",
    name: "Beginner Core Workout",
    description: "A foundation core workout for beginners to build stability",
    difficulty: "beginner",
    duration: "20 min",
    primaryMuscleGroups: ["core"],
    secondaryMuscleGroups: ["lower back"],
    equipment: ["bodyweight", "mat"],
    exercises: [
      { name: "Plank", sets: 3, reps: "30 seconds" },
      { name: "Crunches", sets: 3, reps: "15-20" },
      { name: "Mountain Climbers", sets: 3, reps: "30 seconds" },
      { name: "Russian Twists", sets: 3, reps: "10 each side" }
    ]
  },
  {
    id: "core-intermediate",
    name: "Intermediate Core Circuit",
    description: "A challenging core workout to build strength and definition",
    difficulty: "intermediate",
    duration: "30 min",
    primaryMuscleGroups: ["core"],
    secondaryMuscleGroups: ["lower back", "glutes"],
    equipment: ["medicine ball", "mat", "cables"],
    exercises: [
      { name: "Hanging Leg Raises", sets: 3, reps: "12-15" },
      { name: "Cable Crunches", sets: 3, reps: "15-20" },
      { name: "Ab Wheel Rollout", sets: 3, reps: "10-12" },
      { name: "Side Planks", sets: 3, reps: "45 seconds each side" },
      { name: "Medicine Ball Slams", sets: 3, reps: "15-20" }
    ]
  },
  {
    id: "core-advanced",
    name: "Advanced Core Shredder",
    description: "An intensive core workout for maximum definition and strength",
    difficulty: "advanced",
    duration: "40 min",
    primaryMuscleGroups: ["core"],
    secondaryMuscleGroups: ["lower back", "glutes", "shoulders"],
    equipment: ["medicine ball", "pull-up bar", "weights"],
    exercises: [
      { name: "Weighted Hanging Leg Raises", sets: 4, reps: "10-12" },
      { name: "Dragon Flags", sets: 4, reps: "8-10" },
      { name: "Weighted Russian Twists", sets: 4, reps: "15 each side" },
      { name: "Ab Wheel Standing Rollouts", sets: 3, reps: "8-10" },
      { name: "L-Sit Hold", sets: 3, reps: "30 seconds" },
      { name: "Hollow Body Rock", sets: 3, reps: "45 seconds" }
    ]
  },
  
  // Specific workouts
  {
    id: "biceps-focus",
    name: "Biceps Focus Workout",
    description: "A specialized workout for biceps development",
    difficulty: "intermediate",
    duration: "40 min",
    primaryMuscleGroups: ["biceps"],
    secondaryMuscleGroups: ["forearms"],
    equipment: ["barbell", "dumbbells", "cables", "preacher bench"],
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: "8-10" },
      { name: "Preacher Curls", sets: 4, reps: "10-12" },
      { name: "Incline Dumbbell Curls", sets: 3, reps: "10-12" },
      { name: "Hammer Curls", sets: 3, reps: "12-15" },
      { name: "Cable Curls", sets: 3, reps: "15-20" }
    ]
  },
  {
    id: "triceps-focus",
    name: "Triceps Builder",
    description: "A targeted workout for triceps growth",
    difficulty: "intermediate",
    duration: "40 min",
    primaryMuscleGroups: ["triceps"],
    secondaryMuscleGroups: ["shoulders"],
    equipment: ["barbell", "dumbbells", "cables", "bench"],
    exercises: [
      { name: "Close-Grip Bench Press", sets: 4, reps: "8-10" },
      { name: "Skull Crushers", sets: 4, reps: "10-12" },
      { name: "Overhead Tricep Extensions", sets: 3, reps: "10-12" },
      { name: "Tricep Dips", sets: 3, reps: "10-12" },
      { name: "Rope Pushdowns", sets: 3, reps: "12-15" }
    ]
  },
  {
    id: "cardio-hiit",
    name: "HIIT Cardio Workout",
    description: "A high-intensity interval training workout for cardiovascular fitness",
    difficulty: "intermediate",
    duration: "30 min",
    primaryMuscleGroups: ["cardio"],
    secondaryMuscleGroups: ["legs", "core"],
    equipment: ["bodyweight", "timer"],
    exercises: [
      { name: "Burpees", sets: 5, reps: "30 seconds on, 30 seconds rest" },
      { name: "Mountain Climbers", sets: 5, reps: "30 seconds on, 30 seconds rest" },
      { name: "Jump Squats", sets: 5, reps: "30 seconds on, 30 seconds rest" },
      { name: "High Knees", sets: 5, reps: "30 seconds on, 30 seconds rest" },
      { name: "Jumping Jacks", sets: 5, reps: "30 seconds on, 30 seconds rest" }
    ]
  }
];
