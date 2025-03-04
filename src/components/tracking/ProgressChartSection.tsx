
import { memo } from "react";
import { motion } from "framer-motion";
import { TimeRange, TrackingData } from "@/types/tracking";
import ProgressChart from "@/components/tracking/ProgressChart";

interface ProgressChartSectionProps {
  data: TrackingData[];
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  isPremium: boolean;
}

const ProgressChartSection = memo(({
  data,
  timeRange,
  onTimeRangeChange,
  isPremium
}: ProgressChartSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <ProgressChart 
        data={data}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        isPremium={isPremium}
      />
    </motion.div>
  );
});

ProgressChartSection.displayName = 'ProgressChartSection';

export default ProgressChartSection;
