
import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { TimeRange, TrackingData } from "@/types/tracking";
import ProgressChart from "@/components/tracking/ProgressChart";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";

interface ProgressChartSectionProps {
  data: TrackingData[];
  timeRange: TimeRange;
  onTimeRangeChange: (value: TimeRange) => void;
  isPremium: boolean;
  isLoading?: boolean;
}

const ProgressChartSection = memo(({
  data,
  timeRange,
  onTimeRangeChange,
  isPremium,
  isLoading = false
}: ProgressChartSectionProps) => {
  // Memoize the data to prevent unnecessary rerenders
  const memoizedData = useMemo(() => data, [JSON.stringify(data)]);
  
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <SkeletonLoader type="chart" />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl p-6 shadow-sm"
    >
      <ProgressChart 
        data={memoizedData}
        timeRange={timeRange}
        onTimeRangeChange={onTimeRangeChange}
        isPremium={isPremium}
      />
    </motion.div>
  );
});

ProgressChartSection.displayName = 'ProgressChartSection';

export default ProgressChartSection;
