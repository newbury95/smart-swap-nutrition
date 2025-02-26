
export type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

export type TrackingData = {
  date: string;
  weight: number;
  height: number;
  bmi: number;
  steps: number;
  exerciseMinutes: number;
  caloriesBurned: number;
};
