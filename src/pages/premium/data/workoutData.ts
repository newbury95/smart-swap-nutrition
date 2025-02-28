import { Workout } from '../components/WorkoutCard';

export interface MuscleGroup {
  id: string;
  name: string;
  icon: string;
}

export const muscleGroups: MuscleGroup[] = [
  { id: 'chest', name: 'Chest', icon: '💪' },
  { id: 'back', name: 'Back', icon: '🔙' },
  { id: 'shoulders', name: 'Shoulders', icon: '🏋️' },
  { id: 'arms', name: 'Arms', icon: '💪' },
  { id: 'legs', name: 'Legs', icon: '🦵' },
  { id: 'core', name: 'Core', icon: '🎯' },
  { id: 'full-body', name: 'Full Body', icon: '👤' },
  { id: 'cardio', name: 'Cardio', icon: '🏃' },
];

// Sample workout plans for each muscle group and difficulty level
export const workoutPlans: Record<string, Workout[]> = {
  'full-body': [
    {
      id: 'fullbody-beginner',
      name: 'Full Body Basics',
      description: 'A beginner-friendly workout targeting all major muscle groups',
      difficulty: 'beginner',
      duration: '30 min',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Push-ups (or Modified Push-ups)', sets: 3, reps: '8-10', rest: '60 sec' },
        { name: 'Bent-over Rows with Light Weights', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Walking Lunges', sets: 2, reps: '10 per leg', rest: '60 sec' },
        { name: 'Plank', sets: 3, reps: '20-30 sec hold', rest: '45 sec' }
      ]
    },
    {
      id: 'fullbody-intermediate',
      name: 'Full Body Builder',
      description: 'An intermediate workout for those with some training experience',
      difficulty: 'intermediate',
      duration: '45 min',
      exercises: [
        { name: 'Goblet Squats', sets: 4, reps: '12-15', rest: '45 sec' },
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', rest: '60 sec' },
        { name: 'Bent-over Rows', sets: 4, reps: '10-12', rest: '60 sec' },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: '90 sec' },
        { name: 'Hanging Leg Raises', sets: 3, reps: '10-15', rest: '60 sec' },
        { name: 'Mountain Climbers', sets: 3, reps: '30 sec', rest: '30 sec' }
      ]
    },
    {
      id: 'fullbody-advanced',
      name: 'Full Body Elite',
      description: 'An advanced workout for experienced fitness enthusiasts',
      difficulty: 'advanced',
      duration: '60 min',
      exercises: [
        { name: 'Barbell Back Squats', sets: 5, reps: '5-8', rest: '120 sec' },
        { name: 'Weighted Pull-ups', sets: 4, reps: '6-8', rest: '90 sec' },
        { name: 'Barbell Bench Press', sets: 5, reps: '5-8', rest: '120 sec' },
        { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '150 sec' },
        { name: 'Weighted Dips', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Ab Wheel Rollouts', sets: 4, reps: '10-15', rest: '60 sec' },
        { name: 'Box Jumps', sets: 4, reps: '8-10', rest: '90 sec' }
      ]
    }
  ],
  'cardio': [
    {
      id: 'cardio-beginner',
      name: 'Cardio Starter',
      description: 'A gentle introduction to cardio workouts',
      difficulty: 'beginner',
      duration: '20 min',
      exercises: [
        { name: 'Brisk Walking', sets: 1, reps: '5 min', rest: '1 min' },
        { name: 'Marching in Place', sets: 3, reps: '2 min', rest: '45 sec' },
        { name: 'Step Ups (low step)', sets: 3, reps: '1 min', rest: '45 sec' },
        { name: 'Arm Circles', sets: 2, reps: '30 sec each direction', rest: '30 sec' },
        { name: 'Cool Down Walk', sets: 1, reps: '3 min', rest: '0' }
      ]
    },
    {
      id: 'cardio-intermediate',
      name: 'Cardio Builder',
      description: 'Moderate intensity cardio workout to build endurance',
      difficulty: 'intermediate',
      duration: '30 min',
      exercises: [
        { name: 'Jogging', sets: 1, reps: '5 min', rest: '1 min' },
        { name: 'Jumping Jacks', sets: 3, reps: '45 sec', rest: '30 sec' },
        { name: 'Mountain Climbers', sets: 3, reps: '45 sec', rest: '30 sec' },
        { name: 'Burpees (no push-up)', sets: 3, reps: '45 sec', rest: '45 sec' },
        { name: 'High Knees', sets: 3, reps: '45 sec', rest: '30 sec' },
        { name: 'Skater Jumps', sets: 3, reps: '45 sec', rest: '30 sec' },
        { name: 'Cool Down Jog/Walk', sets: 1, reps: '5 min', rest: '0' }
      ]
    },
    {
      id: 'cardio-advanced',
      name: 'Cardio Extreme',
      description: 'High-intensity cardio workout for maximum calorie burn',
      difficulty: 'advanced',
      duration: '45 min',
      exercises: [
        { name: 'High Knees Sprint', sets: 1, reps: '5 min', rest: '1 min' },
        { name: 'Burpees (with push-up)', sets: 4, reps: '1 min', rest: '30 sec' },
        { name: 'Jumping Lunges', sets: 4, reps: '1 min', rest: '30 sec' },
        { name: 'Mountain Climbers (fast)', sets: 4, reps: '1 min', rest: '30 sec' },
        { name: 'Box Jumps', sets: 4, reps: '1 min', rest: '30 sec' },
        { name: 'Tuck Jumps', sets: 4, reps: '45 sec', rest: '45 sec' },
        { name: 'Sprint Intervals', sets: 6, reps: '30 sec sprint, 30 sec jog', rest: '0' },
        { name: 'Cool Down Jog', sets: 1, reps: '5 min', rest: '0' }
      ]
    }
  ],
  'core': [
    {
      id: 'core-beginner',
      name: 'Core Foundations',
      description: 'Build core stability with these beginner-friendly exercises',
      difficulty: 'beginner',
      duration: '15 min',
      exercises: [
        { name: 'Plank', sets: 3, reps: '20-30 sec hold', rest: '45 sec' },
        { name: 'Glute Bridges', sets: 3, reps: '10-12', rest: '30 sec' },
        { name: 'Bird Dog', sets: 3, reps: '8 each side', rest: '30 sec' },
        { name: 'Seated Knee Lifts', sets: 3, reps: '10 each side', rest: '30 sec' },
        { name: 'Superman', sets: 3, reps: '10-12', rest: '30 sec' }
      ]
    },
    {
      id: 'core-intermediate',
      name: 'Core Sculptor',
      description: 'Intermediate core workout to strengthen and define your midsection',
      difficulty: 'intermediate',
      duration: '25 min',
      exercises: [
        { name: 'Plank Variations', sets: 3, reps: '45 sec each', rest: '30 sec' },
        { name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45 sec' },
        { name: 'Mountain Climbers', sets: 3, reps: '45 sec', rest: '30 sec' },
        { name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '45 sec' },
        { name: 'V-Ups', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Hollow Body Hold', sets: 3, reps: '30 sec', rest: '45 sec' }
      ]
    },
    {
      id: 'core-advanced',
      name: 'Core Elite',
      description: 'Advanced core training for maximum challenge',
      difficulty: 'advanced',
      duration: '35 min',
      exercises: [
        { name: 'Weighted Russian Twists', sets: 4, reps: '20 total', rest: '45 sec' },
        { name: 'Ab Wheel Rollouts', sets: 4, reps: '12-15', rest: '60 sec' },
        { name: 'Hanging Leg Raises', sets: 4, reps: '12-15', rest: '60 sec' },
        { name: 'Dragon Flags', sets: 4, reps: '8-10', rest: '60 sec' },
        { name: 'Weighted Decline Sit-ups', sets: 4, reps: '12-15', rest: '60 sec' },
        { name: 'Plank with Alternating Arm/Leg Raise', sets: 4, reps: '20 total', rest: '60 sec' },
        { name: 'L-Sit Hold', sets: 4, reps: '15-30 sec', rest: '60 sec' }
      ]
    }
  ],
  'chest': [
    {
      id: 'chest-beginner',
      name: 'Chest Basics',
      description: 'Beginner-friendly chest workout to build strength and endurance',
      difficulty: 'beginner',
      duration: '25 min',
      exercises: [
        { name: 'Push-ups (or Modified Push-ups)', sets: 3, reps: '8-12', rest: '60 sec' },
        { name: 'Dumbbell Chest Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Chest Flies', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Plank to Push-up', sets: 2, reps: '8-10 total', rest: '60 sec' }
      ]
    },
    {
      id: 'chest-intermediate',
      name: 'Chest Developer',
      description: 'Intermediate chest workout for strength and muscle development',
      difficulty: 'intermediate',
      duration: '40 min',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', rest: '60 sec' },
        { name: 'Decline Push-ups', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Cable Flies', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Dumbbell Pull-over', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Push-up Variations', sets: 3, reps: '12-15', rest: '60 sec' }
      ]
    },
    {
      id: 'chest-advanced',
      name: 'Chest Mastery',
      description: 'Advanced chest workout for serious strength and hypertrophy',
      difficulty: 'advanced',
      duration: '50 min',
      exercises: [
        { name: 'Barbell Bench Press', sets: 5, reps: '5-8', rest: '120 sec' },
        { name: 'Weighted Dips', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Incline Barbell Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Decline Barbell Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Cable Crossovers', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Plyometric Push-ups', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Svend Press', sets: 3, reps: '12-15', rest: '60 sec' }
      ]
    }
  ],
  'back': [
    {
      id: 'back-beginner',
      name: 'Back Basics',
      description: 'Beginner-friendly back workout to improve posture and build foundation',
      difficulty: 'beginner',
      duration: '25 min',
      exercises: [
        { name: 'Dumbbell Rows', sets: 3, reps: '10-12 each side', rest: '60 sec' },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Superman Hold', sets: 3, reps: '20-30 sec', rest: '45 sec' },
        { name: 'Resistance Band Pull-Aparts', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Inverted Row (with feet on floor)', sets: 3, reps: '8-10', rest: '60 sec' }
      ]
    },
    {
      id: 'back-intermediate',
      name: 'Back Builder',
      description: 'Intermediate back workout for strength and muscle development',
      difficulty: 'intermediate',
      duration: '40 min',
      exercises: [
        { name: 'Pull-ups (assisted if needed)', sets: 4, reps: '6-10', rest: '90 sec' },
        { name: 'Barbell Rows', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Seated Cable Rows', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Single-Arm Dumbbell Rows', sets: 3, reps: '10-12 each side', rest: '60 sec' },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Hyperextensions', sets: 3, reps: '12-15', rest: '60 sec' }
      ]
    },
    {
      id: 'back-advanced',
      name: 'Back Mastery',
      description: 'Advanced back workout for serious strength and width',
      difficulty: 'advanced',
      duration: '55 min',
      exercises: [
        { name: 'Weighted Pull-ups', sets: 5, reps: '6-8', rest: '120 sec' },
        { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '180 sec' },
        { name: 'T-Bar Rows', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Meadows Rows', sets: 3, reps: '8-10 each side', rest: '90 sec' },
        { name: 'Straight-Arm Pulldowns', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Pendlay Rows', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Rope Climbs or Heavy Rope Pulls', sets: 3, reps: '30-45 sec', rest: '90 sec' }
      ]
    }
  ],
  'shoulders': [
    {
      id: 'shoulders-beginner',
      name: 'Shoulder Basics',
      description: 'Beginner-friendly shoulder workout to build stability and strength',
      difficulty: 'beginner',
      duration: '25 min',
      exercises: [
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Front Raises', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Reverse Flies', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Shoulder Circles', sets: 2, reps: '30 sec each direction', rest: '30 sec' }
      ]
    },
    {
      id: 'shoulders-intermediate',
      name: 'Shoulder Developer',
      description: 'Intermediate shoulder workout for balanced development',
      difficulty: 'intermediate',
      duration: '35 min',
      exercises: [
        { name: 'Seated Barbell Shoulder Press', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Arnold Press', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Cable Lateral Raises', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Face Pulls', sets: 3, reps: '15-20', rest: '60 sec' },
        { name: 'Upright Rows', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Shrugs', sets: 3, reps: '12-15', rest: '60 sec' }
      ]
    },
    {
      id: 'shoulders-advanced',
      name: 'Shoulder Mastery',
      description: 'Advanced shoulder workout for serious strength and definition',
      difficulty: 'advanced',
      duration: '50 min',
      exercises: [
        { name: 'Standing Military Press', sets: 5, reps: '6-8', rest: '120 sec' },
        { name: 'Push Press', sets: 4, reps: '6-8', rest: '90 sec' },
        { name: 'Single-Arm Dumbbell Press', sets: 3, reps: '8-10 each side', rest: '60 sec' },
        { name: 'Drop Set Lateral Raises', sets: 4, reps: '12-15, then 8-10 heavier', rest: '75 sec' },
        { name: 'Behind-the-Neck Press', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Cable Y-Raises', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Handstand Push-ups (or progression)', sets: 3, reps: '6-10', rest: '90 sec' }
      ]
    }
  ],
  'arms': [
    {
      id: 'arms-beginner',
      name: 'Arm Basics',
      description: 'Beginner-friendly arm workout targeting biceps and triceps',
      difficulty: 'beginner',
      duration: '25 min',
      exercises: [
        { name: 'Dumbbell Bicep Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Tricep Dips (assisted if needed)', sets: 3, reps: '8-12', rest: '45 sec' },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: '45 sec' },
        { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest: '45 sec' },
        { name: 'Concentration Curls', sets: 2, reps: '12 each arm', rest: '45 sec' }
      ]
    },
    {
      id: 'arms-intermediate',
      name: 'Arm Builder',
      description: 'Intermediate arm workout for strength and definition',
      difficulty: 'intermediate',
      duration: '35 min',
      exercises: [
        { name: 'Barbell Curls', sets: 4, reps: '8-10', rest: '60 sec' },
        { name: 'Skull Crushers', sets: 4, reps: '10-12', rest: '60 sec' },
        { name: 'Preacher Curls', sets: 3, reps: '10-12', rest: '60 sec' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Cable Curls', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Diamond Push-ups', sets: 3, reps: '10-15', rest: '60 sec' }
      ]
    },
    {
      id: 'arms-advanced',
      name: 'Arm Mastery',
      description: 'Advanced arm workout for maximum size and strength',
      difficulty: 'advanced',
      duration: '45 min',
      exercises: [
        { name: 'Close-Grip Bench Press', sets: 4, reps: '6-8', rest: '90 sec' },
        { name: 'Weighted Chin-ups', sets: 4, reps: '6-8', rest: '90 sec' },
        { name: '21s Bicep Curls', sets: 3, reps: '21 (7-7-7)', rest: '90 sec' },
        { name: 'Tricep Dips (weighted)', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Spider Curls', sets: 3, reps: '10-12', rest: '75 sec' },
        { name: 'Rope Overhead Tricep Extension', sets: 3, reps: '10-12', rest: '75 sec' },
        { name: 'Drop Set Hammer Curls', sets: 3, reps: '10-8-6', rest: '90 sec' }
      ]
    }
  ],
  'legs': [
    {
      id: 'legs-beginner',
      name: 'Leg Basics',
      description: 'Beginner-friendly leg workout to build foundation and endurance',
      difficulty: 'beginner',
      duration: '30 min',
      exercises: [
        { name: 'Bodyweight Squats', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Walking Lunges', sets: 3, reps: '10 steps each leg', rest: '60 sec' },
        { name: 'Glute Bridges', sets: 3, reps: '15-20', rest: '45 sec' },
        { name: 'Leg Press (light weight)', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Seated Calf Raises', sets: 3, reps: '15-20', rest: '45 sec' }
      ]
    },
    {
      id: 'legs-intermediate',
      name: 'Leg Developer',
      description: 'Intermediate leg workout for strength and muscle development',
      difficulty: 'intermediate',
      duration: '45 min',
      exercises: [
        { name: 'Barbell Back Squats', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Romanian Deadlifts', sets: 4, reps: '10-12', rest: '90 sec' },
        { name: 'Walking Lunges with Dumbbells', sets: 3, reps: '12 steps each leg', rest: '75 sec' },
        { name: 'Leg Extensions', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: '60 sec' },
        { name: 'Standing Calf Raises', sets: 4, reps: '15-20', rest: '45 sec' }
      ]
    },
    {
      id: 'legs-advanced',
      name: 'Leg Mastery',
      description: 'Advanced leg workout for serious strength and size',
      difficulty: 'advanced',
      duration: '60 min',
      exercises: [
        { name: 'Barbell Back Squats', sets: 5, reps: '5-8', rest: '120 sec' },
        { name: 'Deadlifts', sets: 4, reps: '5-8', rest: '180 sec' },
        { name: 'Hack Squats', sets: 4, reps: '8-10', rest: '90 sec' },
        { name: 'Bulgarian Split Squats', sets: 3, reps: '8-10 each leg', rest: '90 sec' },
        { name: 'Leg Press (heavy)', sets: 3, reps: '8-10', rest: '90 sec' },
        { name: 'Seated Leg Curls', sets: 3, reps: '10-12', rest: '75 sec' },
        { name: 'Standing Calf Raises (heavy)', sets: 4, reps: '12-15, then 10 partial reps', rest: '60 sec' }
      ]
    }
  ]
};
