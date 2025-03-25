
import { memo } from "react";
import { motion } from "framer-motion";
import { Activity, Flame, Footprints, Dumbbell } from "lucide-react";
import { Exercise } from "@/hooks/useExerciseTracking";
import { getBMICategory } from "@/utils/healthCalculations";
import MetricCard from "@/components/tracking/MetricCard";

interface MetricsSectionProps {
  latestBMI: number;
  exercises: Exercise[];
  caloriesBurned: number;
  steps: number;
  isPremium: boolean;
  onShowExerciseDialog: () => void;
}

const MetricsSection = memo(({
  latestBMI,
  exercises,
  caloriesBurned,
  steps,
  isPremium,
  onShowExerciseDialog
}: MetricsSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-4 gap-4 mb-8"
    >
      {/* BMI first, Exercise second */}
      <MetricCard
        icon={Activity}
        iconColor="text-primary"
        bgColor="bg-soft-green"
        title="Current BMI"
        value={latestBMI}
        buttonLabel={getBMICategory(latestBMI)}
        isPremium={true}
        priority={1}
      />

      <MetricCard
        icon={Dumbbell}
        iconColor="text-primary"
        bgColor="bg-soft-teal"
        title="Exercise"
        value={exercises.length}
        onUpdate={onShowExerciseDialog}
        isPremium={true} 
        buttonLabel="Log Exercise"
        priority={2}
      />
        
      <MetricCard
        icon={Flame}
        iconColor="text-primary"
        bgColor="bg-soft-mint"
        title="Calories Burned"
        value={caloriesBurned}
        isPremium={isPremium}
        buttonLabel="Synced with Health"
        priority={3}
      />

      <MetricCard
        icon={Footprints}
        iconColor="text-primary"
        bgColor="bg-soft-green"
        title="Daily Steps"
        value={steps}
        isPremium={isPremium}
        buttonLabel="Synced with Health"
        priority={4}
      />
    </motion.div>
  );
});

MetricsSection.displayName = 'MetricsSection';

export default MetricsSection;
