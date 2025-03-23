
import { useState, useEffect } from "react";

export type Gender = "male" | "female" | "other";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type WeightGoal = "lose" | "maintain" | "gain";

interface UseActivityCalculatorProps {
  initialWeight?: number;
  initialHeight?: number;
  initialAge?: number;
  initialGender?: Gender;
  initialActivityLevel?: ActivityLevel;
  initialWeightGoal?: WeightGoal;
}

export const useActivityCalculator = ({
  initialWeight = 70,
  initialHeight = 170,
  initialAge = 30,
  initialGender = "male",
  initialActivityLevel = "moderate",
  initialWeightGoal = "maintain"
}: UseActivityCalculatorProps = {}) => {
  // User metrics for BMR calculation
  const [weight, setWeight] = useState(initialWeight);
  const [height, setHeight] = useState(initialHeight);
  const [age, setAge] = useState(initialAge);
  const [gender, setGender] = useState<Gender>(initialGender);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialActivityLevel);
  const [weightGoal, setWeightGoal] = useState<WeightGoal>(initialWeightGoal);
  
  // Calculated values
  const [bmr, setBmr] = useState(0);
  const [tdee, setTdee] = useState(0);
  const [calorieTarget, setCalorieTarget] = useState(0);
  
  // Calculate BMR, TDEE and calorie target when inputs change
  useEffect(() => {
    // Mifflin-St Jeor Equation for BMR
    let calculatedBmr = 10 * weight + 6.25 * height - 5 * age;
    if (gender === "male") {
      calculatedBmr += 5;
    } else if (gender === "female") {
      calculatedBmr -= 161;
    } else {
      // Average for non-binary
      calculatedBmr -= 78;
    }
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    // Calculate TDEE
    const calculatedTdee = calculatedBmr * activityMultipliers[activityLevel];
    
    // Calculate calorie target based on weight goal
    let calculatedCalorieTarget = calculatedTdee;
    if (weightGoal === "lose") {
      calculatedCalorieTarget = calculatedTdee * 0.8; // 20% deficit
    } else if (weightGoal === "gain") {
      calculatedCalorieTarget = calculatedTdee * 1.15; // 15% surplus
    }
    
    // Update state with calculated values
    setBmr(Math.round(calculatedBmr));
    setTdee(Math.round(calculatedTdee));
    setCalorieTarget(Math.round(calculatedCalorieTarget));
  }, [weight, height, age, gender, activityLevel, weightGoal]);

  return {
    // Input states
    weight,
    setWeight,
    height,
    setHeight,
    age,
    setAge,
    gender,
    setGender,
    activityLevel,
    setActivityLevel,
    weightGoal,
    setWeightGoal,
    
    // Calculated values
    bmr,
    tdee,
    calorieTarget,
  };
};
