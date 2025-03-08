
export interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  rest?: string;
  note?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  exercises: Exercise[];
}

// Export workout data array with at least 3 workouts per difficulty level for each muscle group
export const workoutData: Workout[] = [
  // CHEST WORKOUTS
  {
    id: "chest-beginner-1",
    name: "Beginner Chest Workout",
    description: "A simple chest workout focusing on building strength and form for beginners.",
    muscleGroup: "chest",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Push-ups", sets: 3, reps: "8-10", rest: "60 seconds" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Chest Flyes", sets: 2, reps: 12, rest: "60 seconds" },
      { name: "Bench Dips", sets: 2, reps: 10, rest: "60 seconds" }
    ]
  },
  {
    id: "chest-beginner-2",
    name: "Chest Fundamentals",
    description: "Build chest strength and endurance with fundamental movements.",
    muscleGroup: "chest",
    difficulty: "beginner",
    duration: "25 minutes",
    exercises: [
      { name: "Knee Push-ups", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Dumbbell Floor Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Standing Cable Flyes", sets: 3, reps: 12, rest: "60 seconds" }
    ]
  },
  {
    id: "chest-beginner-3",
    name: "Chest Starter Pack",
    description: "Perfect for those just starting their fitness journey.",
    muscleGroup: "chest",
    difficulty: "beginner",
    duration: "20 minutes",
    exercises: [
      { name: "Wall Push-ups", sets: 3, reps: 15, rest: "30 seconds" },
      { name: "Machine Chest Press", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Resistance Band Flyes", sets: 3, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "chest-intermediate-1",
    name: "Intermediate Chest Builder",
    description: "A comprehensive chest workout designed to build muscle and strength.",
    muscleGroup: "chest",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Cable Flyes", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Dips", sets: 3, reps: "8-12", rest: "90 seconds" }
    ]
  },
  {
    id: "chest-intermediate-2",
    name: "Chest Definition Workout",
    description: "Focus on muscle definition and upper/lower chest balance.",
    muscleGroup: "chest",
    difficulty: "intermediate",
    duration: "50 minutes",
    exercises: [
      { name: "Incline Barbell Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Flat Dumbbell Press", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Decline Push-ups", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Cable Crossovers", sets: 3, reps: 15, rest: "60 seconds", note: "Focus on contraction" }
    ]
  },
  {
    id: "chest-intermediate-3",
    name: "Chest Volume Builder",
    description: "Maximize chest muscle growth with volume training.",
    muscleGroup: "chest",
    difficulty: "intermediate",
    duration: "40 minutes",
    exercises: [
      { name: "Dumbbell Bench Press", sets: 4, reps: 10, rest: "75 seconds" },
      { name: "Push-ups", sets: 3, reps: "15-20", rest: "45 seconds" },
      { name: "Incline Cable Flyes", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Svend Press", sets: 3, reps: 15, rest: "60 seconds" }
    ]
  },
  {
    id: "chest-advanced-1",
    name: "Advanced Chest Destroyer",
    description: "Intense chest workout with advanced techniques for maximum hypertrophy.",
    muscleGroup: "chest",
    difficulty: "advanced",
    duration: "60 minutes",
    exercises: [
      { name: "Barbell Bench Press", sets: 5, reps: "6-8", rest: "2 minutes", note: "Pyramid sets" },
      { name: "Weighted Dips", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Incline Dumbbell Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Cable Flyes", sets: 3, reps: "12-15", rest: "60 seconds", note: "Drop sets on final set" },
      { name: "Push-up Variations", sets: 2, reps: "To failure", rest: "60 seconds" }
    ]
  },
  {
    id: "chest-advanced-2",
    name: "Chest Power & Strength",
    description: "Build explosive power and raw strength in your chest muscles.",
    muscleGroup: "chest",
    difficulty: "advanced",
    duration: "65 minutes",
    exercises: [
      { name: "Paused Bench Press", sets: 5, reps: 5, rest: "2-3 minutes", note: "3-second pause at bottom" },
      { name: "Incline Barbell Press", sets: 4, reps: 8, rest: "2 minutes" },
      { name: "Weighted Ring Dips", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Decline Dumbbell Press", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Mechanical Drop Set Push-ups", sets: 3, reps: "To failure", rest: "2 minutes" }
    ]
  },
  {
    id: "chest-advanced-3",
    name: "Athletic Chest Development",
    description: "Develop functional chest strength with athletic movements.",
    muscleGroup: "chest",
    difficulty: "advanced",
    duration: "55 minutes",
    exercises: [
      { name: "Plyometric Push-ups", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Alternating Dumbbell Press", sets: 4, reps: "10 per arm", rest: "75 seconds" },
      { name: "Single-Arm Cable Fly", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Medicine Ball Chest Pass", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Tempo Push-ups", sets: 2, reps: "10-12", rest: "60 seconds", note: "4 seconds down, 1 second up" }
    ]
  },

  // BACK WORKOUTS
  {
    id: "back-beginner-1",
    name: "Beginner Back Builder",
    description: "Introduction to back training focusing on proper form and basic movement patterns.",
    muscleGroup: "back",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Assisted Pull-ups", sets: 3, reps: "6-8", rest: "90 seconds" },
      { name: "Seated Cable Rows", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Lat Pulldowns", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Superman Holds", sets: 2, reps: "20 seconds", rest: "30 seconds" }
    ]
  },
  {
    id: "back-beginner-2",
    name: "Back Basics",
    description: "Build foundational back strength and develop good form.",
    muscleGroup: "back",
    difficulty: "beginner",
    duration: "25 minutes",
    exercises: [
      { name: "Resistance Band Pull-aparts", sets: 3, reps: 15, rest: "45 seconds" },
      { name: "Dumbbell Rows", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Seated Lat Pulldowns", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Supermans", sets: 2, reps: 12, rest: "45 seconds" }
    ]
  },
  {
    id: "back-beginner-3",
    name: "Back Strength Starter",
    description: "Learn proper back engagement with simple, effective exercises.",
    muscleGroup: "back",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Inverted Rows", sets: 3, reps: "8-10", rest: "60 seconds" },
      { name: "Standing Resistance Band Rows", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Machine Rows", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Bird Dogs", sets: 2, reps: "10 each side", rest: "30 seconds" }
    ]
  },
  {
    id: "back-intermediate-1",
    name: "Intermediate Back Blast",
    description: "A balanced back workout targeting all major muscles of the back.",
    muscleGroup: "back",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Pull-ups", sets: 4, reps: "6-8", rest: "90 seconds" },
      { name: "Barbell Rows", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Single-Arm Dumbbell Rows", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Straight-Arm Pulldowns", sets: 2, reps: 15, rest: "60 seconds" }
    ]
  },
  {
    id: "back-intermediate-2",
    name: "Back Thickness & Width",
    description: "Develop a thicker, wider back with this balanced approach.",
    muscleGroup: "back",
    difficulty: "intermediate",
    duration: "50 minutes",
    exercises: [
      { name: "Lat Pulldowns", sets: 4, reps: 10, rest: "75 seconds" },
      { name: "T-Bar Rows", sets: 3, reps: "8-10", rest: "90 seconds" },
      { name: "Seated Cable Rows", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Straight-Arm Pulldowns", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Hyperextensions", sets: 2, reps: 12, rest: "60 seconds" }
    ]
  },
  {
    id: "back-intermediate-3",
    name: "Complete Back Development",
    description: "Target all areas of the back for balanced development.",
    muscleGroup: "back",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Chin-ups", sets: 3, reps: "8-10", rest: "90 seconds" },
      { name: "Meadows Rows", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Wide-Grip Seated Rows", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Reverse Flyes", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Renegade Rows", sets: 2, reps: "8 each side", rest: "60 seconds" }
    ]
  },
  {
    id: "back-advanced-1",
    name: "Advanced Back Attack",
    description: "Intense back workout targeting all areas with advanced techniques.",
    muscleGroup: "back",
    difficulty: "advanced",
    duration: "60 minutes",
    exercises: [
      { name: "Weighted Pull-ups", sets: 4, reps: "6-8", rest: "2 minutes" },
      { name: "Pendlay Rows", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Chest-Supported Rows", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Close-Grip Pulldowns", sets: 3, reps: 12, rest: "75 seconds", note: "Drop set on final set" },
      { name: "Straight-Arm Pulldowns", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Deadlift", sets: 3, reps: 5, rest: "2-3 minutes" }
    ]
  },
  {
    id: "back-advanced-2",
    name: "Back Width Specialization",
    description: "Focus on lat development for maximum back width.",
    muscleGroup: "back",
    difficulty: "advanced",
    duration: "55 minutes",
    exercises: [
      { name: "Wide-Grip Pull-ups", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Lat Pulldowns", sets: 4, reps: 10, rest: "75 seconds", note: "Various grips" },
      { name: "Single-Arm Lat Pulldowns", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Straight-Arm Pulldowns", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Pullovers", sets: 3, reps: 12, rest: "60 seconds" }
    ]
  },
  {
    id: "back-advanced-3",
    name: "Back Thickness Focus",
    description: "Build impressive back thickness with heavy rowing movements.",
    muscleGroup: "back",
    difficulty: "advanced",
    duration: "65 minutes",
    exercises: [
      { name: "Barbell Rows", sets: 5, reps: 6, rest: "2 minutes" },
      { name: "T-Bar Rows", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Seal Rows", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Meadows Rows", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Rack Pulls", sets: 3, reps: 6, rest: "2-3 minutes" }
    ]
  },

  // LEGS WORKOUTS
  {
    id: "legs-beginner-1",
    name: "Beginner Leg Foundations",
    description: "Build a solid foundation with these beginner-friendly leg exercises.",
    muscleGroup: "legs",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Walking Lunges", sets: 2, reps: "10 each leg", rest: "60 seconds" },
      { name: "Leg Press", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Standing Calf Raises", sets: 3, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "legs-beginner-2",
    name: "Lower Body Starter",
    description: "Simple but effective leg workout for those new to training.",
    muscleGroup: "legs",
    difficulty: "beginner",
    duration: "25 minutes",
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Step-ups", sets: 2, reps: "10 each leg", rest: "45 seconds" },
      { name: "Leg Extensions", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Seated Calf Raises", sets: 3, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "legs-beginner-3",
    name: "Leg Day Basics",
    description: "Master the fundamental movements for leg development.",
    muscleGroup: "legs",
    difficulty: "beginner",
    duration: "35 minutes",
    exercises: [
      { name: "Dumbbell Split Squats", sets: 3, reps: "8 each leg", rest: "60 seconds" },
      { name: "Leg Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Romanian Deadlifts (Light)", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Standing Calf Raises", sets: 3, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "legs-intermediate-1",
    name: "Intermediate Leg Builder",
    description: "A balanced leg workout targeting all major muscles of the lower body.",
    muscleGroup: "legs",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Barbell Back Squats", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Romanian Deadlifts", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "60 seconds" },
      { name: "Leg Extensions", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Standing Calf Raises", sets: 4, reps: 20, rest: "30 seconds" }
    ]
  },
  {
    id: "legs-intermediate-2",
    name: "Quad & Hamstring Focus",
    description: "Balance quad and hamstring development with this targeted workout.",
    muscleGroup: "legs",
    difficulty: "intermediate",
    duration: "50 minutes",
    exercises: [
      { name: "Front Squats", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Leg Press", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Lying Leg Curls", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", rest: "75 seconds" },
      { name: "Seated Calf Raises", sets: 4, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "legs-intermediate-3",
    name: "Complete Lower Body",
    description: "Comprehensive leg workout for strength and hypertrophy.",
    muscleGroup: "legs",
    difficulty: "intermediate",
    duration: "55 minutes",
    exercises: [
      { name: "Hack Squats", sets: 4, reps: 10, rest: "90 seconds" },
      { name: "Stiff-Legged Deadlifts", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Leg Extensions", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Seated Leg Curls", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Standing Calf Raises", sets: 4, reps: "15-20", rest: "45 seconds" }
    ]
  },
  {
    id: "legs-advanced-1",
    name: "Advanced Leg Destroyer",
    description: "Intense leg workout targeting all areas with advanced techniques.",
    muscleGroup: "legs",
    difficulty: "advanced",
    duration: "70 minutes",
    exercises: [
      { name: "Barbell Back Squats", sets: 5, reps: "6-8", rest: "2-3 minutes", note: "Pyramid up in weight" },
      { name: "Romanian Deadlifts", sets: 4, reps: 8, rest: "2 minutes" },
      { name: "Hack Squats", sets: 3, reps: 10, rest: "90 seconds", note: "Drop set on final set" },
      { name: "Lying Leg Curls", sets: 4, reps: 10, rest: "75 seconds" },
      { name: "Walking Lunges", sets: 3, reps: "12 each leg", rest: "90 seconds" },
      { name: "Standing Calf Raises", sets: 5, reps: 15, rest: "60 seconds", note: "5 second holds at top" }
    ]
  },
  {
    id: "legs-advanced-2",
    name: "Quad Hypertrophy Special",
    description: "Specialize in quadriceps development with this advanced workout.",
    muscleGroup: "legs",
    difficulty: "advanced",
    duration: "65 minutes",
    exercises: [
      { name: "Front Squats", sets: 4, reps: 8, rest: "2 minutes" },
      { name: "Leg Press", sets: 4, reps: 12, rest: "90 seconds", note: "Feet low on platform" },
      { name: "Hack Squats", sets: 3, reps: 12, rest: "90 seconds" },
      { name: "Sissy Squats", sets: 3, reps: 15, rest: "75 seconds" },
      { name: "Leg Extensions", sets: 3, reps: "15-20", rest: "60 seconds", note: "Triple drop set on final set" },
      { name: "Walking Lunges", sets: 2, reps: "10 each leg", rest: "60 seconds" }
    ]
  },
  {
    id: "legs-advanced-3",
    name: "Hamstring & Glute Focus",
    description: "Target the posterior chain with this advanced leg workout.",
    muscleGroup: "legs",
    difficulty: "advanced",
    duration: "60 minutes",
    exercises: [
      { name: "Romanian Deadlifts", sets: 4, reps: 8, rest: "2 minutes" },
      { name: "Good Mornings", sets: 3, reps: 10, rest: "90 seconds" },
      { name: "Glute-Ham Raises", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "Lying Leg Curls", sets: 3, reps: 12, rest: "75 seconds", note: "Paused at top" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "10 each leg", rest: "75 seconds" },
      { name: "Standing Calf Raises", sets: 4, reps: 15, rest: "45 seconds" }
    ]
  },

  // ARMS WORKOUTS - INCLUDING BICEPS AND TRICEPS SPECIFIC
  {
    id: "arms-beginner-1",
    name: "Beginner Arms Builder",
    description: "Build stronger arms with these basic arm exercises.",
    muscleGroup: "arms",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Dumbbell Curls", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Tricep Pushdowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Hammer Curls", sets: 2, reps: 10, rest: "45 seconds" },
      { name: "Overhead Tricep Extensions", sets: 2, reps: 12, rest: "45 seconds" }
    ]
  },
  {
    id: "biceps-beginner-1",
    name: "Beginner Biceps Focus",
    description: "A targeted workout for biceps development.",
    muscleGroup: "arms",
    difficulty: "beginner",
    duration: "20 minutes",
    exercises: [
      { name: "Barbell Curls", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Hammer Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Concentration Curls", sets: 2, reps: "10 each arm", rest: "30 seconds" },
      { name: "Resistance Band Curls", sets: 2, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "triceps-beginner-1",
    name: "Beginner Triceps Workout",
    description: "Develop your triceps with these beginner-friendly exercises.",
    muscleGroup: "arms",
    difficulty: "beginner",
    duration: "20 minutes",
    exercises: [
      { name: "Tricep Pushdowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Overhead Tricep Extensions", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Diamond Push-ups", sets: 2, reps: "8-10", rest: "45 seconds" },
      { name: "Bench Dips", sets: 2, reps: 12, rest: "30 seconds" }
    ]
  },
  {
    id: "arms-intermediate-1",
    name: "Intermediate Arm Blast",
    description: "A balanced arm workout targeting biceps and triceps.",
    muscleGroup: "arms",
    difficulty: "intermediate",
    duration: "40 minutes",
    exercises: [
      { name: "EZ Bar Curls", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Skull Crushers", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Incline Dumbbell Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Rope Pushdowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Hammer Curls", sets: 2, reps: 15, rest: "45 seconds" },
      { name: "Overhead Tricep Extensions", sets: 2, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "biceps-intermediate-1",
    name: "Biceps Builder",
    description: "Focus on biceps development with varied movements.",
    muscleGroup: "arms",
    difficulty: "intermediate",
    duration: "35 minutes",
    exercises: [
      { name: "Barbell Curls", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Incline Hammer Curls", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Cable Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Concentration Curls", sets: 3, reps: "10 each arm", rest: "30 seconds" },
      { name: "21s", sets: 2, reps: 21, rest: "60 seconds" }
    ]
  },
  {
    id: "triceps-intermediate-1",
    name: "Triceps Development",
    description: "Target all three heads of the triceps for complete development.",
    muscleGroup: "arms",
    difficulty: "intermediate",
    duration: "35 minutes",
    exercises: [
      { name: "Close-Grip Bench Press", sets: 4, reps: 8, rest: "60 seconds" },
      { name: "Skull Crushers", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Rope Pushdowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Overhead Dumbbell Extensions", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Diamond Push-ups", sets: 2, reps: "10-15", rest: "45 seconds" }
    ]
  },
  {
    id: "arms-advanced-1",
    name: "Advanced Arm Destroyer",
    description: "Intense arm workout with advanced techniques for maximum growth.",
    muscleGroup: "arms",
    difficulty: "advanced",
    duration: "55 minutes",
    exercises: [
      { name: "Weighted Chin-ups", sets: 3, reps: "6-8", rest: "90 seconds" },
      { name: "Close-Grip Bench Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Incline Dumbbell Curls", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Skull Crushers", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Cable Curls", sets: 3, reps: 12, rest: "45 seconds", note: "Drop set on final set" },
      { name: "Rope Pushdowns", sets: 3, reps: 12, rest: "45 seconds", note: "Drop set on final set" },
      { name: "Hammer Curls", sets: 2, reps: 15, rest: "45 seconds" },
      { name: "Bench Dips", sets: 2, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "biceps-advanced-1",
    name: "Advanced Biceps Specialization",
    description: "Maximize biceps development with advanced techniques.",
    muscleGroup: "arms",
    difficulty: "advanced",
    duration: "45 minutes",
    exercises: [
      { name: "Weighted Chin-ups", sets: 4, reps: "6-8", rest: "90 seconds" },
      { name: "Barbell Drag Curls", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Spider Curls", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Cable Concentration Curls", sets: 3, reps: "10 each arm", rest: "45 seconds" },
      { name: "Preacher Curls", sets: 3, reps: 10, rest: "60 seconds", note: "Drop set on final set" },
      { name: "21s", sets: 2, reps: 21, rest: "60 seconds" }
    ]
  },
  {
    id: "triceps-advanced-1",
    name: "Advanced Triceps Blast",
    description: "Comprehensive triceps workout for advanced trainees.",
    muscleGroup: "arms",
    difficulty: "advanced",
    duration: "45 minutes",
    exercises: [
      { name: "Weighted Dips", sets: 4, reps: "8-10", rest: "90 seconds" },
      { name: "JM Press", sets: 3, reps: 8, rest: "75 seconds" },
      { name: "Reverse-Grip Pushdowns", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Tate Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Overhead Rope Extensions", sets: 3, reps: 12, rest: "60 seconds", note: "Drop set on final set" },
      { name: "Close-Grip Push-ups", sets: 2, reps: "To failure", rest: "60 seconds" }
    ]
  },

  // SHOULDERS WORKOUTS
  {
    id: "shoulders-beginner-1",
    name: "Beginner Shoulder Builder",
    description: "Build stronger shoulders with these basic exercises.",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Seated Dumbbell Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Lateral Raises", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Front Raises", sets: 2, reps: 12, rest: "45 seconds" },
      { name: "Rear Delt Flyes", sets: 2, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "shoulders-beginner-2",
    name: "Shoulder Basics",
    description: "Learn the fundamentals of shoulder training.",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    duration: "25 minutes",
    exercises: [
      { name: "Machine Shoulder Press", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Cable Lateral Raises", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "shoulders-beginner-3",
    name: "Shoulder Mobility & Strength",
    description: "Build strong, mobile shoulders with this beginner routine.",
    muscleGroup: "shoulders",
    difficulty: "beginner",
    duration: "30 minutes",
    exercises: [
      { name: "Wall Slides", sets: 2, reps: 10, rest: "30 seconds" },
      { name: "Single-Arm Dumbbell Press", sets: 3, reps: "8 each arm", rest: "45 seconds" },
      { name: "Lateral Raises", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Band Pull-Aparts", sets: 3, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "shoulders-intermediate-1",
    name: "Intermediate Shoulder Developer",
    description: "A balanced shoulder workout targeting all three deltoid heads.",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Seated Barbell Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Lateral Raises", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Front Raises", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Shrugs", sets: 3, reps: 15, rest: "60 seconds" }
    ]
  },
  {
    id: "shoulders-intermediate-2",
    name: "Shoulder Hypertrophy",
    description: "Focus on muscle growth with this intermediate shoulder workout.",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    duration: "40 minutes",
    exercises: [
      { name: "Arnold Press", sets: 4, reps: 10, rest: "75 seconds" },
      { name: "Upright Rows", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Lateral Raises", sets: 3, reps: "12-15", rest: "45 seconds" },
      { name: "Bent-Over Lateral Raises", sets: 3, reps: 15, rest: "45 seconds" },
      { name: "Face Pulls", sets: 2, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "shoulders-intermediate-3",
    name: "Shoulder Volume Builder",
    description: "Build impressive shoulders with this volume-focused workout.",
    muscleGroup: "shoulders",
    difficulty: "intermediate",
    duration: "45 minutes",
    exercises: [
      { name: "Push Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Lateral Raise Variations", sets: 4, reps: 12, rest: "45 seconds", note: "Seated, standing, cables - 1 set each" },
      { name: "Reverse Pec Deck", sets: 3, reps: 15, rest: "45 seconds" },
      { name: "Front Plate Raises", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Shrugs", sets: 3, reps: "15-20", rest: "45 seconds" }
    ]
  },
  {
    id: "shoulders-advanced-1",
    name: "Advanced Shoulder Destroyer",
    description: "Intense shoulder workout with advanced techniques for maximum development.",
    muscleGroup: "shoulders",
    difficulty: "advanced",
    duration: "55 minutes",
    exercises: [
      { name: "Seated Barbell Press", sets: 5, reps: "6-8", rest: "2 minutes", note: "Pyramid up in weight" },
      { name: "Upright Rows", sets: 4, reps: 10, rest: "75 seconds" },
      { name: "Lateral Raises", sets: 4, reps: 12, rest: "60 seconds", note: "Drop set on final set" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Single-Arm Cable Lateral Raises", sets: 3, reps: "12 each arm", rest: "45 seconds" },
      { name: "Handstand Push-ups", sets: 3, reps: "To failure", rest: "90 seconds" }
    ]
  },
  {
    id: "shoulders-advanced-2",
    name: "3D Shoulder Development",
    description: "Target all angles of the deltoids for complete development.",
    muscleGroup: "shoulders",
    difficulty: "advanced",
    duration: "60 minutes",
    exercises: [
      { name: "Z-Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Cable Lateral Raises", sets: 4, reps: 12, rest: "60 seconds", note: "Pause at top" },
      { name: "Reverse Pec Deck", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Cable Front Raises", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Behind-the-Neck Press", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "High-Pull", sets: 3, reps: 10, rest: "60 seconds" }
    ]
  },
  {
    id: "shoulders-advanced-3",
    name: "Shoulder Power & Strength",
    description: "Focus on building shoulder strength and power.",
    muscleGroup: "shoulders",
    difficulty: "advanced",
    duration: "65 minutes",
    exercises: [
      { name: "Push Press", sets: 5, reps: 5, rest: "2-3 minutes" },
      { name: "Single-Arm Dumbbell Press", sets: 4, reps: "8 each arm", rest: "75 seconds" },
      { name: "Lateral Raise Complex", sets: 3, reps: 10, rest: "90 seconds", note: "10 front, 10 lateral, 10 rear without rest" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Barbell Shrugs", sets: 4, reps: 12, rest: "60 seconds" },
      { name: "Plate Raises", sets: 2, reps: 15, rest: "45 seconds" }
    ]
  },

  // CORE WORKOUTS
  {
    id: "core-beginner-1",
    name: "Beginner Core Foundations",
    description: "Build a strong core foundation with these basic exercises.",
    muscleGroup: "core",
    difficulty: "beginner",
    duration: "20 minutes",
    exercises: [
      { name: "Crunches", sets: 3, reps: 15, rest: "30 seconds" },
      { name: "Plank", sets: 3, reps: "30 seconds", rest: "30 seconds" },
      { name: "Russian Twists", sets: 2, reps: "10 each side", rest: "30 seconds" },
      { name: "Leg Raises", sets: 2, reps: 10, rest: "30 seconds" }
    ]
  },
  {
    id: "core-beginner-2",
    name: "Core Stability Basics",
    description: "Focus on core stability with this beginner-friendly workout.",
    muscleGroup: "core",
    difficulty: "beginner",
    duration: "20 minutes",
    exercises: [
      { name: "Dead Bug", sets: 3, reps: "8 each side", rest: "30 seconds" },
      { name: "Bird Dog", sets: 3, reps: "8 each side", rest: "30 seconds" },
      { name: "Glute Bridge", sets: 3, reps: 12, rest: "30 seconds" },
      { name: "Side Plank", sets: 2, reps: "20 seconds each side", rest: "30 seconds" }
    ]
  },
  {
    id: "core-beginner-3",
    name: "Core Strength Starter",
    description: "Build foundational core strength with these simple exercises.",
    muscleGroup: "core",
    difficulty: "beginner",
    duration: "25 minutes",
    exercises: [
      { name: "Mountain Climbers", sets: 3, reps: "20 total", rest: "30 seconds" },
      { name: "Plank", sets: 3, reps: "30-45 seconds", rest: "30 seconds" },
      { name: "Bicycle Crunches", sets: 3, reps: "10 each side", rest: "30 seconds" },
      { name: "Lying Leg Raises", sets: 2, reps: 10, rest: "30 seconds" }
    ]
  },
  {
    id: "core-intermediate-1",
    name: "Intermediate Core Circuit",
    description: "A balanced core workout targeting all areas of the midsection.",
    muscleGroup: "core",
    difficulty: "intermediate",
    duration: "30 minutes",
    exercises: [
      { name: "Hanging Knee Raises", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Plank Variations", sets: 3, reps: "45 seconds", rest: "30 seconds" },
      { name: "Russian Twists", sets: 3, reps: "15 each side", rest: "45 seconds" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Cable Woodchoppers", sets: 2, reps: "12 each side", rest: "30 seconds" }
    ]
  },
  {
    id: "core-intermediate-2",
    name: "Core Strength & Stability",
    description: "Build functional core strength with this balanced approach.",
    muscleGroup: "core",
    difficulty: "intermediate",
    duration: "35 minutes",
    exercises: [
      { name: "Hanging Leg Raises", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Side Plank with Rotation", sets: 3, reps: "10 each side", rest: "30 seconds" },
      { name: "Swiss Ball Crunches", sets: 3, reps: 15, rest: "30 seconds" },
      { name: "Pallof Press", sets: 3, reps: "12 each side", rest: "30 seconds" },
      { name: "Mountain Climbers", sets: 3, reps: 20, rest: "30 seconds" }
    ]
  },
  {
    id: "core-intermediate-3",
    name: "Dynamic Core Development",
    description: "Build core strength with dynamic movements.",
    muscleGroup: "core",
    difficulty: "intermediate",
    duration: "30 minutes",
    exercises: [
      { name: "Cable Crunches", sets: 3, reps: 15, rest: "45 seconds" },
      { name: "Medicine Ball Slams", sets: 3, reps: 12, rest: "30 seconds" },
      { name: "Bicycle Crunches", sets: 3, reps: "15 each side", rest: "30 seconds" },
      { name: "Russian Twists", sets: 3, reps: "15 each side", rest: "30 seconds" },
      { name: "Plank to Push-up", sets: 2, reps: 10, rest: "45 seconds" }
    ]
  },
  {
    id: "core-advanced-1",
    name: "Advanced Core Crusher",
    description: "Intense core workout for those seeking a challenge.",
    muscleGroup: "core",
    difficulty: "advanced",
    duration: "40 minutes",
    exercises: [
      { name: "Weighted Hanging Leg Raises", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Ab Wheel Rollouts", sets: 4, reps: 12, rest: "45 seconds" },
      { name: "Dragon Flags", sets: 3, reps: 8, rest: "60 seconds" },
      { name: "Weighted Russian Twists", sets: 3, reps: "15 each side", rest: "45 seconds" },
      { name: "Hollow Body Holds", sets: 3, reps: "45 seconds", rest: "30 seconds" },
      { name: "Cable Woodchoppers", sets: 3, reps: "12 each side", rest: "30 seconds" }
    ]
  },
  {
    id: "core-advanced-2",
    name: "Athletic Core Performance",
    description: "Build a strong, functional core for athletic performance.",
    muscleGroup: "core",
    difficulty: "advanced",
    duration: "45 minutes",
    exercises: [
      { name: "Weighted Sit-ups", sets: 4, reps: 15, rest: "45 seconds" },
      { name: "Medicine Ball Throws", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Side Plank with Leg Raise", sets: 3, reps: "10 each side", rest: "30 seconds" },
      { name: "Pallof Press Variations", sets: 3, reps: "12 each side", rest: "30 seconds" },
      { name: "Hanging Windshield Wipers", sets: 3, reps: "8 each side", rest: "60 seconds" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: 10, rest: "45 seconds" }
    ]
  },
  {
    id: "core-advanced-3",
    name: "Core & Oblique Specialization",
    description: "Focus on developing visible abs and strong obliques.",
    muscleGroup: "core",
    difficulty: "advanced",
    duration: "45 minutes",
    exercises: [
      { name: "Weighted Cable Crunches", sets: 4, reps: 15, rest: "45 seconds" },
      { name: "Hanging Oblique Knee Raises", sets: 4, reps: "10 each side", rest: "45 seconds" },
      { name: "L-Sits", sets: 3, reps: "30 seconds", rest: "45 seconds" },
      { name: "Barbell Russian Twists", sets: 3, reps: "12 each side", rest: "45 seconds" },
      { name: "Dragon Flags", sets: 3, reps: 8, rest: "60 seconds" },
      { name: "Plank Complex", sets: 2, reps: "60 seconds", rest: "45 seconds", note: "Front, side, other side without rest" }
    ]
  },

  // FULLBODY WORKOUTS
  {
    id: "fullbody-beginner-1",
    name: "Beginner Full Body Workout",
    description: "A complete full body workout ideal for beginners.",
    muscleGroup: "fullbody",
    difficulty: "beginner",
    duration: "45 minutes",
    exercises: [
      { name: "Bodyweight Squats", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Push-ups", sets: 3, reps: "8-10", rest: "45 seconds" },
      { name: "Assisted Pull-ups", sets: 3, reps: 8, rest: "45 seconds" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Plank", sets: 3, reps: "30 seconds", rest: "30 seconds" }
    ]
  },
  {
    id: "fullbody-beginner-2",
    name: "Full Body Foundations",
    description: "Build a foundation of strength with this full body workout.",
    muscleGroup: "fullbody",
    difficulty: "beginner",
    duration: "40 minutes",
    exercises: [
      { name: "Goblet Squats", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Dumbbell Bench Press", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Dumbbell Rows", sets: 3, reps: 10, rest: "45 seconds" },
      { name: "Lateral Raises", sets: 2, reps: 12, rest: "30 seconds" },
      { name: "Crunches", sets: 2, reps: 15, rest: "30 seconds" }
    ]
  },
  {
    id: "fullbody-beginner-3",
    name: "Full Body Starter",
    description: "A simple full body workout for those new to training.",
    muscleGroup: "fullbody",
    difficulty: "beginner",
    duration: "35 minutes",
    exercises: [
      { name: "Leg Press", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Machine Chest Press", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Lat Pulldowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Dumbbell Curls", sets: 2, reps: 10, rest: "30 seconds" },
      { name: "Tricep Pushdowns", sets: 2, reps: 12, rest: "30 seconds" }
    ]
  },
  {
    id: "fullbody-intermediate-1",
    name: "Intermediate Full Body Circuit",
    description: "An efficient full body workout targeting all major muscle groups.",
    muscleGroup: "fullbody",
    difficulty: "intermediate",
    duration: "60 minutes",
    exercises: [
      { name: "Barbell Squats", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Bench Press", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Bent-Over Rows", sets: 4, reps: 10, rest: "60 seconds" },
      { name: "Overhead Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Dumbbell Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Tricep Extensions", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Hanging Leg Raises", sets: 3, reps: 10, rest: "45 seconds" }
    ]
  },
  {
    id: "fullbody-intermediate-2",
    name: "Full Body Strength Focus",
    description: "Build overall strength with compound movements.",
    muscleGroup: "fullbody",
    difficulty: "intermediate",
    duration: "55 minutes",
    exercises: [
      { name: "Deadlifts", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Pull-ups", sets: 3, reps: "8-10", rest: "60 seconds" },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Lunges", sets: 3, reps: "10 each leg", rest: "45 seconds" },
      { name: "Ab Wheel Rollouts", sets: 3, reps: 10, rest: "45 seconds" }
    ]
  },
  {
    id: "fullbody-intermediate-3",
    name: "Full Body Hypertrophy",
    description: "Focus on muscle growth with this complete workout.",
    muscleGroup: "fullbody",
    difficulty: "intermediate",
    duration: "65 minutes",
    exercises: [
      { name: "Hack Squats", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Dumbbell Bench Press", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Cable Rows", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Lateral Raises", sets: 3, reps: 15, rest: "45 seconds" },
      { name: "EZ Bar Curls", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Rope Pushdowns", sets: 3, reps: 12, rest: "45 seconds" },
      { name: "Cable Crunches", sets: 3, reps: 15, rest: "45 seconds" }
    ]
  },
  {
    id: "fullbody-advanced-1",
    name: "Advanced Full Body Challenge",
    description: "Challenging full body workout for experienced trainees.",
    muscleGroup: "fullbody",
    difficulty: "advanced",
    duration: "75 minutes",
    exercises: [
      { name: "Barbell Squats", sets: 5, reps: 8, rest: "90 seconds" },
      { name: "Weighted Pull-ups", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Bench Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Military Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Romanian Deadlifts", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Weighted Dips", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Barbell Curls", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Hanging Leg Raises", sets: 3, reps: 12, rest: "60 seconds" }
    ]
  },
  {
    id: "fullbody-advanced-2",
    name: "Full Body Power & Strength",
    description: "Build overall power and strength with this advanced workout.",
    muscleGroup: "fullbody",
    difficulty: "advanced",
    duration: "80 minutes",
    exercises: [
      { name: "Deadlifts", sets: 5, reps: 5, rest: "2-3 minutes" },
      { name: "Incline Bench Press", sets: 4, reps: 6, rest: "2 minutes" },
      { name: "Weighted Chin-ups", sets: 4, reps: 6, rest: "2 minutes" },
      { name: "Front Squats", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Push Press", sets: 3, reps: 8, rest: "90 seconds" },
      { name: "T-Bar Rows", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Skull Crushers", sets: 3, reps: 10, rest: "60 seconds" },
      { name: "Weighted Russian Twists", sets: 3, reps: "15 each side", rest: "60 seconds" }
    ]
  },
  {
    id: "fullbody-advanced-3",
    name: "Athletic Full Body Performance",
    description: "Build a strong, athletic physique with this comprehensive workout.",
    muscleGroup: "fullbody",
    difficulty: "advanced",
    duration: "70 minutes",
    exercises: [
      { name: "Power Cleans", sets: 4, reps: 5, rest: "2 minutes" },
      { name: "Bulgarian Split Squats", sets: 3, reps: "8 each leg", rest: "75 seconds" },
      { name: "Weighted Pull-ups", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Dumbbell Bench Press", sets: 4, reps: 8, rest: "90 seconds" },
      { name: "Hanging Leg Raises", sets: 3, reps: 12, rest: "60 seconds" },
      { name: "Arnold Press", sets: 3, reps: 10, rest: "75 seconds" },
      { name: "Face Pulls", sets: 3, reps: 15, rest: "60 seconds" },
      { name: "Plank Variations", sets: 3, reps: "45 seconds", rest: "45 seconds" }
    ]
  }
];
