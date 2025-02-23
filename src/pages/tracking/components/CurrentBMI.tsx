
import { getBMICategory } from "../hooks/useTrackingData";
import type { TrackingData } from "../hooks/useTrackingData";

interface CurrentBMIProps {
  trackingData: TrackingData[];
}

export const CurrentBMI = ({ trackingData }: CurrentBMIProps) => {
  const latestBMI = trackingData[trackingData.length - 1]?.bmi || 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Current BMI</h2>
      <div className="text-center">
        <div className="text-4xl font-bold text-green-600 mb-2">
          {latestBMI}
        </div>
        <div className="text-gray-600 mb-4">
          {getBMICategory(latestBMI)}
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {trackingData[trackingData.length - 1]?.date || "Never"}
        </div>
      </div>
    </div>
  );
};
