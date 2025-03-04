
import { useMemo } from "react";
import { TrackingData, TimeRange } from "@/types/tracking";

/**
 * Hook to format tracking data for the progress chart based on the selected time range
 */
export const useFormattedChartData = (data: TrackingData[], timeRange: TimeRange) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    
    // For optimization, limit the number of data points based on time range
    let limitedData = [...data];
    
    // Limit data points to improve performance
    if (timeRange === "daily" && data.length > 30) {
      limitedData = data.slice(-30); // Only show last 30 days
    } else if (timeRange === "weekly" && data.length > 52) {
      limitedData = data.slice(-52); // Only show last 52 weeks
    }
    
    return limitedData.map(item => ({
      ...item,
      // Format date based on time range
      date: formatDateByTimeRange(item.date, timeRange)
    }));
  }, [data, timeRange]);
};

/**
 * Formats a date string based on the selected time range
 */
const formatDateByTimeRange = (dateString: string, timeRange: TimeRange): string => {
  const date = new Date(dateString);
  
  switch (timeRange) {
    case "daily":
      // For daily view, just show the day and month
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });
    
    case "weekly":
      // For weekly view, show the week number
      return `Week ${getWeekNumber(date)}, ${date.getFullYear()}`;
    
    case "monthly":
      // For monthly view, show month and year
      return date.toLocaleDateString(undefined, { 
        month: 'short', 
        year: 'numeric' 
      });
    
    case "yearly":
      // For yearly view, just show the year
      return date.getFullYear().toString();
    
    default:
      return dateString;
  }
};

/**
 * Get the week number for a given date
 */
const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};
