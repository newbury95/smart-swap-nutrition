
import { useToast } from "@/hooks/use-toast";
import type { Meal } from "../types/meal-section.types";

export const useMealSection = () => {
  const { toast } = useToast();

  return {
    toast
  };
};
