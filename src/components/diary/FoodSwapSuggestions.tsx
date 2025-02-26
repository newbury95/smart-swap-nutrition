
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { type FoodSwap } from "@/hooks/useSupabase";
import { ArrowRight } from "lucide-react";

interface FoodSwapSuggestionsProps {
  swaps: FoodSwap[];
  onClose: () => void;
}

export const FoodSwapSuggestions = ({ swaps, onClose }: FoodSwapSuggestionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Suggested Food Swaps</h3>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {swaps.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No food swap suggestions available for today's meals.
              </p>
            ) : (
              swaps.map((swap, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span>{swap.original_food}</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="font-medium text-green-600">{swap.suggested_food}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{swap.reason}</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Calories saved: {swap.calorie_difference} kcal</p>
                    <p>Additional protein: {swap.protein_difference}g</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </motion.div>
  );
};
