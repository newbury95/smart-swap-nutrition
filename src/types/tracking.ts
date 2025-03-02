
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

export type UserPreferences = {
  theme: "light" | "dark" | "system";
  notifications: boolean;
  units: "metric" | "imperial";
};
